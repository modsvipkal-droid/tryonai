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

function saveLocalUser(email) {
  const user = { email, displayName: email.split("@")[0], photoURL: "", uid: email };
  localStorage.setItem("_trx_auth_email", email);
  localStorage.setItem("_trx_auth_user", JSON.stringify(user));
  return user;
}

function loadLocalUser() {
  try {
    const raw = localStorage.getItem("_trx_auth_user");
    if (raw) return JSON.parse(raw);
    const email = localStorage.getItem("_trx_auth_email");
    if (email) return saveLocalUser(email);
  } catch {}
  return null;
}

export async function watchAuthState(callback) {
  let unsub = () => {};
  try {
    const auth = await getFirebaseAuth();
    if (auth) {
      const { onAuthStateChanged } = await import("firebase/auth");
      unsub = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          callback(firebaseUser);
        } else {
          const local = loadLocalUser();
          callback(local);
        }
      });
      return unsub;
    }
  } catch {}
  const local = loadLocalUser();
  callback(local);
  return () => {};
}

export async function signOutUser() {
  try {
    const auth = await getFirebaseAuth();
    if (auth) {
      const { signOut } = await import("firebase/auth");
      await signOut(auth);
    }
  } catch {}
  localStorage.removeItem("_trx_auth_email");
  localStorage.removeItem("_trx_auth_user");
}

const GOOGLE_CLIENT_ID = "733137268147-s1bla3j4kdlfgeffi85ell9doa61fsp2.apps.googleusercontent.com";

function loadGIS() {
  return new Promise((resolve) => {
    if (typeof google !== "undefined" && google.accounts?.oauth2) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.onload = resolve;
    s.onerror = () => resolve();
    document.head.appendChild(s);
  });
}

export async function signInWithGoogle() {
  const auth = await getFirebaseAuth();
  if (!auth) throw new Error("Firebase not initialized");

  const { GoogleAuthProvider, signInWithCredential } = await import("firebase/auth");

  await loadGIS();

  if (typeof google === "undefined" || !google.accounts?.oauth2) {
    throw new Error("Google Identity Services failed to load");
  }

  return new Promise((resolve, reject) => {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "openid email profile",
      callback: (response) => {
        if (response.error) {
          reject(new Error(response.error));
          return;
        }
        const credential = GoogleAuthProvider.credential(response.id_token);
        signInWithCredential(auth, credential)
          .then((result) => resolve(result.user))
          .catch(reject);
      },
    });
    client.requestAccessToken();
  });
}
