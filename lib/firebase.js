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

export async function signInWithGoogle() {
  const auth = await getFirebaseAuth();
  if (!auth) throw new Error("Firebase not initialized");
  const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}
