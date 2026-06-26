import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
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

export async function signInWithGoogle() {
  const auth = await getFirebaseAuth();
  if (!auth) throw new Error("Firebase not initialized");
  const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}
