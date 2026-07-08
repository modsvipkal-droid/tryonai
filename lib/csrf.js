import crypto from "crypto";

const CSRF_COOKIE_NAME = "__Host-csrf-token";
const CSRF_HEADER_NAME = "x-csrf-token";

function getSecret() {
  const secret = process.env.CSRF_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("CSRF_SECRET environment variable is required in production");
  }
  return "dev-csrf-secret-do-not-use-in-production";
}

export function generateCsrfToken() {
  const secret = getSecret();
  const random = crypto.randomBytes(32).toString("hex");
  const hmac = crypto.createHmac("sha256", secret).update(random).digest("hex");
  return `${random}.${hmac}`;
}

export function validateCsrfToken(token) {
  if (!token || !token.includes(".")) return false;
  const [random, hmac] = token.split(".");
  if (!random || !hmac) return false;
  const secret = getSecret();
  const expected = crypto.createHmac("sha256", secret).update(random).digest("hex");
  if (hmac.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expected));
}

export function setCsrfCookie(res) {
  const token = generateCsrfToken();
  res.setHeader("Set-Cookie", `${CSRF_COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`);
  return token;
}

export function getCsrfTokenFromCookies(req) {
  const cookies = parseCookies(req);
  return cookies[CSRF_COOKIE_NAME] || null;
}

export function getCsrfTokenFromHeader(req) {
  return req.headers[CSRF_HEADER_NAME] || null;
}

export function requireCsrf(req, res) {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
    return true;
  }
  const cookieToken = getCsrfTokenFromCookies(req);
  const headerToken = getCsrfTokenFromHeader(req);
  if (!cookieToken || !headerToken) return false;
  return validateCsrfToken(cookieToken) && cookieToken === headerToken;
}

function parseCookies(req) {
  const cookie = req.headers.cookie;
  if (!cookie) return {};
  const result = {};
  for (const part of cookie.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    result[key] = value;
  }
  return result;
}

export { CSRF_COOKIE_NAME, CSRF_HEADER_NAME };
