import { withAuth } from "@/lib/authMiddleware";
import { createRateLimiter } from "@/lib/rateLimit";
import { logSecurityEvent } from "@/lib/securityLog";
import { getModelById, getModelName, generateInternalOrderId, generateQr } from "@/lib/fampay";
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

  const { model } = req.body || {};
  const modelId = sanitizeString(model, 20).toLowerCase();
  const config = getModelById(modelId);
  if (!config) {
    return res.status(400).json({ error: "Invalid or unknown model" });
  }

  const dbUser = await findUserByEmail(user.email);
  if (!dbUser) {
    return res.status(403).json({ error: "Account not found. Please sign in again." });
  }

  const orderId = generateInternalOrderId();

  let qr;
  try {
    qr = await generateQr({ amount: config.amount });
  } catch (err) {
    logSecurityEvent("payment_qr_generation_failed", { email: user.email, modelId, error: err.message });
    return res.status(502).json({ error: "Could not generate payment QR. Please try again." });
  }

  const now = Date.now();
  const order = {
    order_id: orderId,
    gateway_order_id: qr.gatewayOrderId || null,
    user_id: user.uid || user.email,
    user_email: user.email,
    model_id: config.id,
    model_name: config.name,
    amount: config.amount,
    status: "PENDING",
    qr_url: qr.qrUrl || null,
    upi_id: qr.upiId || null,
    utr: null,
    paid_amount: null,
    created_at: now,
    verified_at: null,
    expires_at: null,
    gateway_created_ist: qr.createdAtIst,
    gateway_expires_ist: qr.expiresAtIst,
  };

  await ensurePaymentIndexes();
  const saved = await createPaymentOrder(order);
  if (!saved) {
    return res.status(500).json({ error: "Could not create payment order. Please try again." });
  }

  logSecurityEvent("payment_order_created", { email: user.email, orderId, modelId, amount: config.amount });

  return res.status(201).json({
    orderId,
    modelId: config.id,
    modelName: config.name,
    amount: config.amount,
    qrUrl: qr.qrUrl,
    upiId: qr.upiId,
    status: "PENDING",
  });
});