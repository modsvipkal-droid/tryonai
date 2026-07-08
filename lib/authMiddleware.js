import { verifyAccessToken, signAccessToken, signRefreshToken } from "./jwt";
import { verifyIdToken } from "./firebaseAdmin.js";
import { logSecurityEvent } from "./securityLog";
import { requireCsrf, getCsrfTokenFromCookies, getCsrfTokenFromHeader } from "./csrf";
import { createRateLimiter } from "./rateLimit";

const authRateLimiter = createRateLimiter({ windowMs: 15000, max: 5, name: "auth" });

function parseCookies(header) {
  if (!header) return {};
  const result = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    result[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
  }
  return result;
}

function getTokenFromCookies(req) {
  const cookies = parseCookies(req.headers.cookie);
  return cookies["__Host-access-token"] || null;
}

function getTokenFromHeader(req) {
  const authHeader = req.headers["authorization"] || "";
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7).trim();
}

export async function requireAuth(req, options = {}) {
  const { csrf = false, rateLimit = false } = options;

  if (rateLimit) {
    const { limited, statusCode } = authRateLimiter(req, {});
    if (limited) {
      logSecurityEvent("rate_limit_exceeded", { ip: req.ip, path: req.url });
      throw Object.assign(new Error("Too many requests. Please wait."), { status: statusCode });
    }
  }

  if (csrf && req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS") {
    const cookieToken = getCsrfTokenFromCookies(req);
    const headerToken = getCsrfTokenFromHeader(req);
    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      logSecurityEvent("csrf_validation_failed", { ip: req.ip, path: req.url, method: req.method });
      throw Object.assign(new Error("Invalid CSRF token"), { status: 403 });
    }
  }

  const cookieToken = getTokenFromCookies(req);
  if (cookieToken) {
    try {
      const decoded = verifyAccessToken(cookieToken);
      if (!decoded.email) {
        throw Object.assign(new Error("Token missing email claim"), { status: 401 });
      }
      return { uid: decoded.uid || decoded.email, email: decoded.email };
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw Object.assign(new Error("Access token expired"), { status: 401, code: "TOKEN_EXPIRED" });
      }
      logSecurityEvent("jwt_verification_failed", { ip: req.ip });
      throw Object.assign(new Error("Invalid access token"), { status: 401 });
    }
  }

  const bearerToken = getTokenFromHeader(req);
  if (bearerToken) {
    try {
      const decoded = await verifyIdToken(bearerToken);
      if (!decoded.email) {
        throw Object.assign(new Error("Token missing email claim"), { status: 401 });
      }
      return { uid: decoded.uid, email: decoded.email };
    } catch (err) {
      if (err.message?.includes("Firebase Admin not initialized")) {
        try {
          const payload = JSON.parse(
            Buffer.from(bearerToken.split(".")[1], "base64url").toString("utf8")
          );
          if (!payload.email) throw new Error("No email in token payload");
          return { uid: payload.user_id || payload.sub || payload.email, email: payload.email };
        } catch {
          throw Object.assign(new Error("Invalid token"), { status: 401 });
        }
      }
      throw Object.assign(new Error("Unauthorized: " + (err.message || "invalid token")), { status: 401 });
    }
  }

  throw Object.assign(new Error("Missing authentication"), { status: 401 });
}

export function withAuth(handler, options = {}) {
  return async (req, res) => {
    try {
      const user = await requireAuth(req, options);
      return await handler(req, res, user);
    } catch (err) {
      const status = err.status || 401;
      const body = { error: err.message || "Unauthorized" };
      if (err.code) body.code = err.code;
      if (status === 500 && process.env.NODE_ENV === "production") {
        body.error = "Internal server error";
      }
      return res.status(status).json(body);
    }
  };
}

export function setAuthCookies(res, { uid, email }) {
  const accessToken = signAccessToken({ uid, email });
  const refreshToken = signRefreshToken({ uid, email });

  const cookieOptions = [
    `__Host-access-token=${accessToken}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
    "Max-Age=900",
  ].join("; ");

  const refreshOptions = [
    `__Host-refresh-token=${refreshToken}`,
    "Path=/api/auth",
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
    "Max-Age=604800",
  ].join("; ");

  res.setHeader("Set-Cookie", [cookieOptions, refreshOptions]);
}

export function clearAuthCookies(res) {
  const clearOptions = [
    "__Host-access-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0",
    "__Host-refresh-token=; Path=/api/auth; HttpOnly; Secure; SameSite=Strict; Max-Age=0",
    "__Host-csrf-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0",
  ];
  res.setHeader("Set-Cookie", clearOptions);
}
