import { withAuth } from "@/lib/authMiddleware";
import { createRateLimiter } from "@/lib/rateLimit";
import { logSecurityEvent } from "@/lib/securityLog";
import { verifyPayment, amountsEqual, getModelById } from "@/lib/fampay";
import {
  findPaymentByOrderId,
  findPaymentByGatewayId,
  findPaymentByUtr,
  updatePaymentByOrderId,
  findUserByEmail,
  updateUser,
  insertActivation,
} from "@/lib/db";
import { ensurePaymentIndexes } from "@/lib/mongodb";
import { sanitizeString } from "@/lib/validate";

const verifyLimiter = createRateLimiter({ windowMs: 10000, max: 10, name: "payment-verify" });

function hasModelAccess(user, modelId) {
  return Array.isArray(user?.model_access) && user.model_access.includes(modelId);
}

export default withAuth(async (req, res, user) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { limited } = verifyLimiter(req, res);
  if (limited) {
    logSecurityEvent("payment_verify_rate_limited", { ip: req.ip, email: user.email });
    return res.status(429).json({ error: "Too many verification requests. Please wait." });
  }

  const { orderId, utr: userUtr } = req.body || {};
  const safeOrderId = sanitizeString(orderId, 100);
  if (!safeOrderId) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  const order = await findPaymentByOrderId(safeOrderId);
  if (!order) {
    return res.status(404).json({ error: "Payment order not found" });
  }

  if (order.user_email?.toLowerCase() !== user.email?.toLowerCase()) {
    logSecurityEvent("payment_verify_owner_mismatch", { email: user.email, orderId: safeOrderId });
    return res.status(403).json({ error: "This order does not belong to your account" });
  }

  if (order.status === "VERIFIED") {
    const model = getModelById(order.model_id);
    return res.status(200).json({
      verified: true,
      status: "VERIFIED",
      orderId: order.order_id,
      modelId: order.model_id,
      modelName: order.model_name || model?.name || order.model_id,
      amount: order.amount,
      paidAmount: order.paid_amount,
    });
  }

  if (!order.gateway_order_id) {
    return res
      .status(409)
      .json({ verified: false, status: "PENDING", error: "Payment QR was never created for this order." });
  }

  let result;
  try {
    result = await verifyPayment({ gatewayOrderId: order.gateway_order_id, expectedAmount: order.amount });
  } catch (err) {
    logSecurityEvent("payment_verify_api_error", { email: user.email, orderId: safeOrderId, error: err.message });
    return res.status(502).json({ verified: false, status: "PENDING", error: "Payment not confirmed yet. Try again in a moment." });
  }

  if (!result.success) {
    return res.status(200).json({ verified: false, status: "PENDING", error: result.message || "Payment not received yet." });
  }

  // Amount must match the database amount — never trust a client-supplied amount.
  if (!amountsEqual(result.paidAmount, order.amount)) {
    logSecurityEvent("payment_amount_mismatch", {
      email: user.email,
      orderId: safeOrderId,
      expected: order.amount,
      paid: result.paidAmount,
    });
    await updatePaymentByOrderId(safeOrderId, { status: "FAILED", failed_reason: "AMOUNT_MISMATCH" });
    return res.status(409).json({ verified: false, status: "FAILED", error: "Paid amount does not match the order amount." });
  }

  const utr = result.utr || String(userUtr || "").trim() || null;

  // Unique transaction constraint: the gateway order id belongs to exactly this order.
  const sameGateway = await findPaymentByGatewayId(order.gateway_order_id);
  if (sameGateway && sameGateway.order_id !== order.order_id) {
    logSecurityEvent("payment_gateway_order_reuse", { email: user.email, orderId: safeOrderId });
    return res.status(409).json({ verified: false, status: "FAILED", error: "This payment has already been used for another order." });
  }

  // Idempotency: a UTR/transaction must never be processed twice.
  if (utr) {
    const existingUtr = await findPaymentByUtr(utr);
    if (existingUtr && existingUtr.order_id !== order.order_id && existingUtr.status === "VERIFIED") {
      logSecurityEvent("payment_utr_already_processed", { email: user.email, orderId: safeOrderId, utr });
      return res.status(409).json({ verified: false, status: "FAILED", error: "This transaction has already been used." });
    }
  }

  await ensurePaymentIndexes();

  const verifiedAt = Date.now();
  const updated = await updatePaymentByOrderId(safeOrderId, {
    status: "VERIFIED",
    utr,
    paid_amount: result.paidAmount ?? order.amount,
    verified_at: verifiedAt,
  });
  if (!updated) {
    return res.status(409).json({ verified: false, status: "PENDING", error: "Payment could not be finalized. Please try again." });
  }

  // Unlock the purchased model on the authenticated user's account.
  const dbUser = await findUserByEmail(user.email);
  if (dbUser) {
    const modelId = order.model_id;
    const modelAccess = Array.isArray(dbUser.model_access) ? dbUser.model_access : [];
    const nextAccess = modelAccess.includes(modelId) ? modelAccess : [...modelAccess, modelId];
    await updateUser(user.email, {
      model_access: nextAccess,
      unlimited: true,
      unlimitedAt: verifiedAt,
      model: modelId,
    });
    if (!hasModelAccess(dbUser, modelId)) {
      await insertActivation({
        email: user.email,
        model: modelId,
        orderId: order.order_id,
        utr,
        activatedAt: verifiedAt,
      });
    }
    logSecurityEvent("payment_verified_access_unlocked", { email: user.email, orderId: safeOrderId, modelId, utr });
  }

  const model = getModelById(order.model_id);

  return res.status(200).json({
    verified: true,
    status: "VERIFIED",
    orderId: order.order_id,
    modelId: order.model_id,
    modelName: order.model_name || model?.name || order.model_id,
    amount: order.amount,
    paidAmount: updated.paid_amount ?? result.paidAmount,
    utr,
  });
});