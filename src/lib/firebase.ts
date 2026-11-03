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

/**
 * Safely resolves an environment variable across Vite client builds,
 * Node/SSR, and Cloudflare Worker environments.
 */
function resolveEnv(metaVal: string | undefined, processKey: string): string {
  if (metaVal && metaVal !== "undefined" && !metaVal.startsWith("YOUR_")) {
    return metaVal;
  }
  if (typeof process !== "undefined" && process?.env) {
    const fromProc = process.env[processKey] || process.env[processKey.replace(/^VITE_/, "")];
    if (fromProc && fromProc !== "undefined" && !fromProc.startsWith("YOUR_")) {
      return fromProc;
    }
  }
  return "";
}

// Dot-notation is required for Vite static AST replacement at build time.
const rawApiKey = resolveEnv(import.meta.env.VITE_FIREBASE_API_KEY, "VITE_FIREBASE_API_KEY");
const rawAuthDomain = resolveEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, "VITE_FIREBASE_AUTH_DOMAIN");
const rawProjectId = resolveEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID, "VITE_FIREBASE_PROJECT_ID");
const rawStorageBucket = resolveEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, "VITE_FIREBASE_STORAGE_BUCKET");
const rawMessagingSenderId = resolveEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, "VITE_FIREBASE_MESSAGING_SENDER_ID");
const rawAppId = resolveEnv(import.meta.env.VITE_FIREBASE_APP_ID, "VITE_FIREBASE_APP_ID");

export const isFirebaseConfigured =
  Boolean(rawApiKey) &&
  rawApiKey !== "YOUR_FIREBASE_API_KEY" &&
  rawApiKey !== "YOUR_API_KEY" &&
  rawApiKey !== "undefined" &&
  rawApiKey.trim().length > 5 &&
  Boolean(rawProjectId) &&
  rawProjectId !== "YOUR_PROJECT_ID" &&
  rawProjectId !== "undefined";

export const firebaseConfig = {
  apiKey: rawApiKey,
  authDomain: rawAuthDomain,
  projectId: rawProjectId,
  storageBucket: rawStorageBucket,
  messagingSenderId: rawMessagingSenderId,
  appId: rawAppId,
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
