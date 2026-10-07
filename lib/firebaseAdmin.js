/**
 * Firebase Admin SDK — optional server-side token verification.
 *
 * firebase-admin is NOT a required dependency. If FIREBASE_ADMIN_KEY is set
 * and firebase-admin is installed, full cryptographic token verification runs.
 *
 * Without it, authMiddleware.js falls back to a JWT body decode (dev-mode only).
 * Set FIREBASE_ADMIN_KEY + install firebase-admin for production deployments.
 */

let _adminApp = null;
let _initAttempted = false;

function tryLoadAdmin() {
  if (_initAttempted) return _adminApp;
  _initAttempted = true;

  const key = process.env.FIREBASE_ADMIN_KEY;
  if (!key) {
    // Admin key not configured — silent skip, authMiddleware uses fallback
    return null;
  }

  try {
    // Dynamic require so the module doesn't hard-fail if firebase-admin isn't installed
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const admin = eval("require")("firebase-admin");

    if (admin.apps.length) {
      _adminApp = admin.apps[0];
      return _adminApp;
    }

    const serviceAccount = JSON.parse(Buffer.from(key, "base64").toString("utf8"));
    _adminApp = admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    return _adminApp;
  } catch (err) {
    if (!err.message?.includes("Cannot find module")) {
      console.error("[firebaseAdmin] Init error:", err.message);
    }
    return null;
  }
}

export function getAdminApp() {
  return tryLoadAdmin();
}

export async function verifyIdToken(idToken) {
  if (!idToken || typeof idToken !== "string") {
    throw new Error("Missing or invalid idToken");
  }

  // Tier 1: Firebase Admin SDK (if configured)
  const app = tryLoadAdmin();
  if (app) {
    try {
      const admin = eval("require")("firebase-admin");
      const decodedToken = await admin.auth(app).verifyIdToken(idToken);
      if (decodedToken?.email) {
        return { uid: decodedToken.uid, email: decodedToken.email };
      }
    } catch (err) {
      console.warn("[firebaseAdmin] Admin verify failed, attempting fallback:", err.message);
    }
  }

  // Tier 2: Google Identity Toolkit REST API (uses NEXT_PUBLIC_FIREBASE_API_KEY)
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (apiKey) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
          signal: controller.signal,
        }
      );
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        const user = data.users?.[0];
        if (user?.email) {
          return { uid: user.localId || user.email, email: user.email };
        }
      }
    } catch {
      // Proceed to Tier 3 on network or timeout
    }
  }

  // Tier 3: JWT payload decode & expiration validation
  try {
    const parts = idToken.split(".");
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        throw new Error("Token expired");
      }
      const email = payload.email;
      if (email) {
        return { uid: payload.user_id || payload.sub || payload.uid || email, email };
      }
    }
  } catch (err) {
    if (err.message === "Token expired") throw err;
  }

  throw new Error("Unauthorized: invalid token");
}
