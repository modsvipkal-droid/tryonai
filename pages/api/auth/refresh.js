import { verifyRefreshToken, signAccessToken } from "@/lib/jwt";
import { setAuthCookies, clearAuthCookies } from "@/lib/authMiddleware";
import { setCsrfCookie } from "@/lib/csrf";
import { logSecurityEvent } from "@/lib/securityLog";
import { createRateLimiter } from "@/lib/rateLimit";

const refreshLimiter = createRateLimiter({ windowMs: 60000, max: 20, name: "refresh" });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { limited } = refreshLimiter(req, res);
  if (limited) {
    logSecurityEvent("refresh_rate_limited", { ip: req.ip });
    return res.status(429).json({ error: "Too many refresh requests" });
  }

  const cookies = (req.headers.cookie || "").split(";").reduce((acc, c) => {
    const idx = c.indexOf("=");
    if (idx !== -1) acc[c.slice(0, idx).trim()] = c.slice(idx + 1).trim();
    return acc;
  }, {});

  const refreshToken = cookies["__Host-refresh-token"];
  if (!refreshToken) {
    return res.status(401).json({ error: "Missing refresh token" });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded.email) {
      throw new Error("Invalid token payload");
    }

    setAuthCookies(res, { uid: decoded.uid, email: decoded.email });
    setCsrfCookie(res);

    return res.status(200).json({ ok: true });
  } catch (err) {
    logSecurityEvent("refresh_token_invalid", { error: err.message });
    clearAuthCookies(res);
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
}
