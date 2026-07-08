import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || (process.env.NODE_ENV === "production" ? null : "dev-access-secret");
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || (process.env.NODE_ENV === "production" ? null : "dev-refresh-secret");
const ACCESS_EXPIRY = "15m";
const REFRESH_EXPIRY = "7d";

export function signAccessToken(payload) {
  if (!ACCESS_SECRET) throw new Error("JWT_ACCESS_SECRET not configured");
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });
}

export function signRefreshToken(payload) {
  if (!REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET not configured");
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
}

export function verifyAccessToken(token) {
  if (!ACCESS_SECRET) throw new Error("JWT_ACCESS_SECRET not configured");
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  if (!REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET not configured");
  return jwt.verify(token, REFRESH_SECRET);
}
