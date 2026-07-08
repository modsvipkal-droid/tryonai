import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB5smmOAWiyDuewdeEGq-vtr44xEXvMC7U",
  authDomain: "trxtrader1-d7dde.firebaseapp.com",
  databaseURL: "https://trxtrader1-d7dde-default-rtdb.firebaseio.com",
  projectId: "trxtrader1-d7dde",
  storageBucket: "trxtrader1-d7dde.firebasestorage.app",
  messagingSenderId: "733137268147",
  appId: "1:733137268147:web:a0091a8e7970c766762fc6",
  measurementId: "G-SV1FKZCZ37",
};

export function getFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export async function getFirebaseAuth() {
  if (typeof window === "undefined") return null;
  const { browserLocalPersistence, getAuth, setPersistence } = await import("firebase/auth");
  const auth = getAuth(getFirebaseApp());
  await setPersistence(auth, browserLocalPersistence).catch(() => {});
  return auth;
}

function getTokenFromUser(firebaseUser) {
  try {
    return firebaseUser.getIdToken();
  } catch {
    return Promise.resolve(null);
  }
}

async function createSession(firebaseUser) {
  try {
    const idToken = await getTokenFromUser(firebaseUser);
    if (!idToken) return;
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
      credentials: "include",
    });
  } catch {
    // Session creation is best-effort for auth cookies
  }
}

export async function watchAuthState(callback) {
  let unsub = () => {};
  try {
    const auth = await getFirebaseAuth();
    if (auth) {
      const { onAuthStateChanged } = await import("firebase/auth");
      unsub = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          await createSession(firebaseUser);
          callback(firebaseUser);
        } else {
          callback(null);
        }
      });
      return unsub;
    }
  } catch {}
  callback(null);
  return () => {};
}

export async function signOutUser() {
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  } catch {}
  try {
    const auth = await getFirebaseAuth();
    if (auth) {
      const { signOut } = await import("firebase/auth");
      await signOut(auth);
    }
  } catch {}
}

const GOOGLE_CLIENT_ID = "733137268147-s1bla3j4kdlfgeffi85ell9doa61fsp2.apps.googleusercontent.com";

let gisReady = false;
let gisCallbacks = [];

function onGISReady() {
  gisReady = true;
  gisCallbacks.forEach((fn) => fn());
  gisCallbacks = [];
}

function loadGIS() {
  return new Promise((resolve) => {
    if (typeof google !== "undefined" && google.accounts?.id) {
      gisReady = true;
      resolve();
      return;
    }
    gisCallbacks.push(resolve);
    if (document.querySelector('script[src*="gsi/client"]')) return;
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.onload = onGISReady;
    s.onerror = onGISReady;
    document.head.appendChild(s);
  });
}

let gisInit = false;

export async function signInWithGoogle() {
  const auth = await getFirebaseAuth();
  if (!auth) throw new Error("Firebase not initialized");

  const { GoogleAuthProvider, signInWithCredential } = await import("firebase/auth");

  await loadGIS();

  if (!gisReady || typeof google === "undefined" || !google.accounts?.id) {
    throw new Error("Google sign-in unavailable. Refresh and try again.");
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    const done = (fn, val) => { if (!settled) { settled = true; fn(val); } };
    const timeout = setTimeout(() => done(reject, new Error("Sign-in timed out. Try again.")), 35000);

    if (!gisInit) {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        cancel_on_tap_outside: false,
        callback: async (response) => {
          clearTimeout(timeout);
          if (response.error) { done(reject, new Error(response.error)); return; }
          try {
            const result = await signInWithCredential(auth, GoogleAuthProvider.credential(response.credential));
            await createSession(result.user);
            done(resolve, result.user);
          } catch (e) {
            done(reject, e);
          }
        },
      });
      gisInit = true;
    }

    google.accounts.id.prompt();
  });
}
