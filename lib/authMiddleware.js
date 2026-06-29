import { verifyIdToken } from "./firebaseAdmin.js";

/**
 * Extracts and verifies the Firebase ID token from the Authorization header.
 * Returns { uid, email } on success, or throws an error.
 *
 * Falls back to a simple JWT decode (no signature check) if Firebase Admin
 * is not configured — this is acceptable in dev, but NEVER in production
 * without FIREBASE_ADMIN_KEY set.
 */
export async function requireAuth(req) {
  const authHeader = req.headers["authorization"] || "";
  if (!authHeader.startsWith("Bearer ")) {
    throw Object.assign(new Error("Missing authorization token"), { status: 401 });
  }

  const idToken = authHeader.slice(7).trim();
  if (!idToken) {
    throw Object.assign(new Error("Empty authorization token"), { status: 401 });
  }

  try {
    const decoded = await verifyIdToken(idToken);
    if (!decoded.email) {
      throw Object.assign(new Error("Token missing email claim"), { status: 401 });
    }
    return { uid: decoded.uid, email: decoded.email };
  } catch (err) {
    // If Firebase Admin isn't configured, try a simple JWT body decode
    // for development (without signature verification).
    if (err.message?.includes("Firebase Admin not initialized")) {
      try {
        const payload = JSON.parse(
          Buffer.from(idToken.split(".")[1], "base64url").toString("utf8")
        );
        if (!payload.email) throw new Error("No email in token payload");
        console.warn("[authMiddleware] ⚠️  Token decoded WITHOUT signature verification – set FIREBASE_ADMIN_KEY for production");
        return { uid: payload.user_id || payload.sub || payload.email, email: payload.email };
      } catch {
        throw Object.assign(new Error("Invalid token"), { status: 401 });
      }
    }
    throw Object.assign(new Error("Unauthorized: " + (err.message || "invalid token")), { status: 401 });
  }
}

/**
 * Wraps an API route handler with auth. Passes { uid, email } as third arg.
 * Usage:
 *   export default withAuth(async (req, res, { uid, email }) => { ... });
 */
export function withAuth(handler) {
  return async (req, res) => {
    try {
      const user = await requireAuth(req);
      return await handler(req, res, user);
    } catch (err) {
      const status = err.status || 401;
      return res.status(status).json({ error: err.message || "Unauthorized" });
    }
  };
}
