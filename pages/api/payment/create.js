import { withAuth } from "@/lib/authMiddleware";
import { createRateLimiter } from "@/lib/rateLimit";
import { logSecurityEvent } from "@/lib/securityLog";
import { getModelById, getModelName, getFx1PlanById, generateInternalOrderId, generateQr } from "@/lib/fampay";
import { createPaymentOrder, findUserByEmail } from "@/lib/db";
import { ensurePaymentIndexes } from "@/lib/mongodb";
import { sanitizeString } from "@/lib/validate";

const createLimiter = createRateLimiter({ windowMs: 15000, max: 6, name: "payment-create" });

export default withAuth(async (req, res, user) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { limited } = createLimiter(req, res);
  if (limited) {
    logSecurityEvent("payment_create_rate_limited", { ip: req.ip, email: user.email });
    return res.status(429).json({ error: "Too many payment requests. Please wait." });
  }

  const { model, plan } = req.body || {};
  const modelId = sanitizeString(model, 20).toLowerCase();
  const config = getModelById(modelId);
  if (!config) {
    return res.status(400).json({ error: "Invalid or unknown model" });
  }

  // FX1 is subscription-based: the amount + duration always come from the
  // server-side plan catalog. Never trust a frontend-supplied amount.
  let planConfig = null;
  let amount = config.amount;
  if (modelId === "fx1") {
    const planId = sanitizeString(plan, 20).toLowerCase();
    planConfig = getFx1PlanById(planId);
    if (!planConfig) {
      return res.status(400).json({ error: "Please select a valid FX1 plan" });
    }
    amount = planConfig.amount;
  }

  const dbUser = await findUserByEmail(user.email);
  if (!dbUser) {
    return res.status(403).json({ error: "Account not found. Please sign in again." });
  }

  const orderId = generateInternalOrderId();

  let qr;
  try {
    qr = await generateQr({ amount });
  } catch (err) {
    logSecurityEvent("payment_qr_generation_failed", { email: user.email, modelId, plan: planConfig?.id, error: err.message });
    return res.status(502).json({ error: "Could not generate payment QR. Please try again." });
  }

  const now = Date.now();
  // IMPORTANT: never store utr/paid as null here — the unique sparse index on
  // `utr` still indexes explicit nulls, so a second order would hit duplicate-key.
  // Omit the fields entirely until verification writes real values.
  const order = {
    order_id: orderId,
    user_id: user.uid || user.email,
    user_email: user.email,
    model_id: config.id,
    model_name: config.name,
    amount,
    status: "PENDING",
    qr_url: qr.qrUrl || null,
    upi_id: qr.upiId || null,
    created_at: now,
    gateway_created_ist: qr.createdAtIst,
    gateway_expires_ist: qr.expiresAtIst,
  };
  if (planConfig) {
    order.plan_id = planConfig.id;
    order.plan_name = planConfig.name;
    order.duration_days = planConfig.duration_days;
    order.access_type = planConfig.access_type;
    order.access_expires_at = planConfig.duration_days == null ? null : now + planConfig.duration_days * 24 * 60 * 60 * 1000;
  }
  if (qr.gatewayOrderId) order.gateway_order_id = qr.gatewayOrderId;

  const saved = await createPaymentOrder(order);
  if (!saved) {
    return res.status(500).json({ error: "Could not create payment order. Please try again." });
  }

  // Index creation must never block or fail an order.
  ensurePaymentIndexes().catch(() => {});

  logSecurityEvent("payment_order_created", { email: user.email, orderId, modelId, plan: planConfig?.id, amount });

  return res.status(201).json({
    orderId,
    modelId: config.id,
    modelName: config.name,
    planId: planConfig?.id || null,
    planName: planConfig?.name || null,
    amount,
    qrUrl: qr.qrUrl,
    gatewayOrderId: qr.gatewayOrderId || orderId,
    upiId: qr.upiId,
    status: "PENDING",
  });
});