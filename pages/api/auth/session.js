import { verifyIdToken } from "@/lib/firebaseAdmin";
import { setAuthCookies, clearAuthCookies } from "@/lib/authMiddleware";
import { setCsrfCookie } from "@/lib/csrf";
import { logSecurityEvent } from "@/lib/securityLog";
import { createRateLimiter } from "@/lib/rateLimit";
import { findUserByEmail } from "@/lib/db";
import { sanitizeEmail } from "@/lib/validate";

const sessionLimiter = createRateLimiter({ windowMs: 60000, max: 10, name: "session" });

const BLOCKED_ACCOUNT_MESSAGE =
  "Your account has been blocked due to repeated subscription page visits without a purchase. Please contact support if you believe this was a mistake.";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { limited } = sessionLimiter(req, res);
  if (limited) {
    logSecurityEvent("session_rate_limited", { ip: req.ip });
    return res.status(429).json({ error: "Too many session requests" });
  }

  const { idToken } = req.body || {};
  if (!idToken || typeof idToken !== "string") {
    return res.status(400).json({ error: "Missing idToken" });
  }

  try {
    const decoded = await verifyIdToken(idToken);
    if (!decoded.email) {
      return res.status(401).json({ error: "Token missing email claim" });
    }

    // Server-side block check BEFORE any session/cookie is created. Blocked
    // Gmail accounts are rejected here and no new account is provisioned.
    const email = sanitizeEmail(decoded.email);
    const existing = await findUserByEmail(email);
    if (existing?.subscriptionBlocked === true) {
      logSecurityEvent("blocked_login_attempt", { email });
      clearAuthCookies(res);
      return res.status(403).json({
        blocked: true,
        error: BLOCKED_ACCOUNT_MESSAGE,
      });
    }

    setAuthCookies(res, { uid: decoded.uid, email: decoded.email });
    const csrfToken = setCsrfCookie(res);

    logSecurityEvent("session_created", { email: decoded.email });

    return res.status(200).json({
      user: { uid: decoded.uid, email: decoded.email },
      csrfToken,
    });
  } catch (err) {
    logSecurityEvent("session_creation_failed", { error: err.message });
    if (err.message?.includes("Firebase Admin not initialized")) {
      return res.status(501).json({ error: "Server authentication not configured" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
}
