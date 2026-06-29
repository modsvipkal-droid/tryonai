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
  const app = tryLoadAdmin();
  if (!app) {
    throw new Error("Firebase Admin not initialized – set FIREBASE_ADMIN_KEY and install firebase-admin");
  }

  try {
    // Dynamic require for same reason
    const admin = eval("require")("firebase-admin");
    const decodedToken = await admin.auth(app).verifyIdToken(idToken);
    return { uid: decodedToken.uid, email: decodedToken.email };
  } catch (err) {
    if (err.message?.includes("Cannot find module")) {
      throw new Error("Firebase Admin not initialized – set FIREBASE_ADMIN_KEY and install firebase-admin");
    }
    throw err;
  }
}
