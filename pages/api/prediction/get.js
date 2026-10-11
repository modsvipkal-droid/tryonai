import { findUserByEmail } from "@/lib/db";
import { sanitizeEmail } from "@/lib/validate";
import { generateSmartPrediction } from "@/lib/prediction";
import { fetchWingoHistory } from "@/lib/wingo";
import { createRateLimiter } from "@/lib/rateLimit";

const predictionLimiter = createRateLimiter({ windowMs: 15000, max: 10, name: "prediction-get" });

/**
 * Server-Side Access Verification:
 * Validates whether the user has a real, active paid plan in the database.
 * No client timestamp or client-supplied status is trusted.
 */
function hasValidAccess(user, now = Date.now()) {
  if (!user) return false;
  
  if (user.subscriptionBlocked === true) return false;

  const modelAccess = Array.isArray(user.model_access) ? user.model_access : [];
  const korven = modelAccess.includes("korven");
  
  const fx1Raw = user.fx1_subscription && typeof user.fx1_subscription === "object" ? user.fx1_subscription : null;
  let fx1Active = false;

  if (fx1Raw) {
    const lifetime = fx1Raw.access_type === "LIFETIME" || fx1Raw.expires_at == null;
    const expired = !lifetime && typeof fx1Raw.expires_at === "number" && now >= fx1Raw.expires_at;
    fx1Active = !expired && fx1Raw.access_status !== "REVOKED";
  }

  const isPaidUser = user.payment_status === "SUCCESS" || user.unlimited === true;
  return korven || fx1Active || isPaidUser;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { limited } = predictionLimiter(req, res);
  if (limited) {
    return res.status(429).json({ error: "Too many prediction requests. Please wait." });
  }

  try {
    const { periodNum, email: rawEmail, predictionLevel = 0, history: clientHistory } = req.body || {};

    if (!periodNum) {
      return res.status(400).json({ error: "periodNum is required" });
    }

    const email = sanitizeEmail(rawEmail);
    if (!email) {
      return res.status(401).json({ error: "User authentication required", code: "UNAUTHORIZED" });
    }

    // Direct Database Query - Check genuine payment/access status
    const user = await findUserByEmail(email);

    if (!user || !hasValidAccess(user)) {
      // 403 Forbidden: Zero prediction data returned if payment check fails
      return res.status(403).json({
        error: "Payment Required: Active plan needed to access predictions.",
        code: "PAYMENT_REQUIRED",
        requiresUpgrade: true,
      });
    }

    // Fetch official historical results or use client fallback
    let history = Array.isArray(clientHistory) && clientHistory.length >= 2 ? clientHistory : [];
    if (history.length < 2) {
      try {
        const fetched = await fetchWingoHistory();
        if (Array.isArray(fetched) && fetched.length > 0) {
          history = fetched;
        }
      } catch {}
    }

    // Generate prediction strictly on the server
    const prediction = generateSmartPrediction(periodNum, history, Number(predictionLevel) || 0);

    return res.status(200).json({
      success: true,
      prediction,
      serverTime: Date.now(),
    });
  } catch (err) {
    console.error("[api/prediction/get error]:", err?.message);
    return res.status(500).json({ error: "Failed to generate prediction" });
  }
}
