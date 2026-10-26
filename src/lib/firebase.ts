/**
 * Firebase configuration for WebToolOcean Widget Studio.
 *
 * Set these values in a .env file at the project root:
 *
 *   VITE_FIREBASE_API_KEY=...
 *   VITE_FIREBASE_AUTH_DOMAIN=...
 *   VITE_FIREBASE_PROJECT_ID=...
 *   VITE_FIREBASE_STORAGE_BUCKET=...
 *   VITE_FIREBASE_MESSAGING_SENDER_ID=...
 *   VITE_FIREBASE_APP_ID=...
 *
 * Get these values from:
 * https://console.firebase.google.com → Project Settings → Your apps → Web app → Config
 *
 * IMPORTANT: Enable the following in Firebase Console → Authentication → Sign-in method:
 *   - Google
 *   - Email/Password
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const rawApiKey = (import.meta.env["VITE_FIREBASE_API_KEY"] as string | undefined) || "";
const rawProjectId = (import.meta.env["VITE_FIREBASE_PROJECT_ID"] as string | undefined) || "";

export const isFirebaseConfigured =
  Boolean(rawApiKey) &&
  rawApiKey !== "YOUR_FIREBASE_API_KEY" &&
  rawApiKey !== "YOUR_API_KEY" &&
  rawApiKey !== "undefined" &&
  rawApiKey.trim().length > 5 &&
  Boolean(rawProjectId) &&
  rawProjectId !== "YOUR_PROJECT_ID";

const firebaseConfig = {
  apiKey: rawApiKey,
  authDomain: (import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"] as string | undefined) || "",
  projectId: rawProjectId,
  storageBucket: (import.meta.env["VITE_FIREBASE_STORAGE_BUCKET"] as string | undefined) || "",
  messagingSenderId: (import.meta.env["VITE_FIREBASE_MESSAGING_SENDER_ID"] as string | undefined) || "",
  appId: (import.meta.env["VITE_FIREBASE_APP_ID"] as string | undefined) || "",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!;
    auth = getAuth(app);
  } catch (err) {
    console.warn("[Firebase] Could not initialize Firebase Auth:", err);
  }
}

export { app, auth };
export default app;
