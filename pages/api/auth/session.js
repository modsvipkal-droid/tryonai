import { verifyIdToken } from "@/lib/firebaseAdmin";
import { setAuthCookies, clearAuthCookies } from "@/lib/authMiddleware";
import { setCsrfCookie } from "@/lib/csrf";
import { logSecurityEvent } from "@/lib/securityLog";
import { createRateLimiter } from "@/lib/rateLimit";

const sessionLimiter = createRateLimiter({ windowMs: 60000, max: 10, name: "session" });

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
