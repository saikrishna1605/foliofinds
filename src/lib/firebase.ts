import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage;
let isFirebaseConfigured = false;

// This check is important to avoid crashes on the server and client.
if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('YOUR_')) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    isFirebaseConfigured = true;
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // isFirebaseConfigured remains false
  }
} else {
    // This warning is helpful for users who haven't configured their keys yet.
    console.warn("Firebase configuration is missing or incomplete. Some features might not work.");
}

export { app, auth, db, storage, isFirebaseConfigured };
