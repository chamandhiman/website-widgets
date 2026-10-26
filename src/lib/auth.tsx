/**
 * Firebase Authentication Context for WebToolOcean Widget Studio.
 *
 * Provides:
 *  - `useAuth()` hook: returns { user, loading, signInWithGoogle, signInWithEmail,
 *    createAccount, signOut, resetPassword, isFirebaseConfigured }
 *  - `AuthProvider` component: wraps the entire app
 *  - `AuthGuard` component: protects routes that require authentication
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  type User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { useNavigate, useRouterState } from "@tanstack/react-router";

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  createAccount: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    // Handle redirect result on page load (fallback for popup blockers)
    getRedirectResult(auth).catch(() => {
      // Ignore — redirect wasn't in progress
    });

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase is not configured. Please add your Firebase credentials to .env");
    }
    const provider = new GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    try {
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      const e = err as { code?: string };
      // Popup blocked — fall back to redirect flow
      if (
        e.code === "auth/popup-blocked" ||
        e.code === "auth/popup-closed-by-user"
      ) {
        await signInWithRedirect(auth, provider);
        return;
      }
      throw err;
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<void> => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase is not configured. Please add your Firebase credentials to .env");
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const createAccount = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase is not configured. Please add your Firebase credentials to .env");
    }
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (name.trim()) {
      await updateProfile(credential.user, { displayName: name.trim() });
      // Refresh the user object so the displayName is reflected immediately
      setUser({ ...credential.user, displayName: name.trim() } as User);
    }
  };

  const signOut = async (): Promise<void> => {
    if (auth) {
      await firebaseSignOut(auth);
    }
    setUser(null);
  };

  const resetPassword = async (email: string): Promise<void> => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase is not configured.");
    }
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseConfigured,
        signInWithGoogle,
        signInWithEmail,
        createAccount,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth() must be used within <AuthProvider>");
  }
  return ctx;
}

/**
 * AuthGuard — renders children only when the user is authenticated.
 * While Firebase is initializing, shows a full-screen loading spinner.
 * When unauthenticated, redirects to /login (preserving the return URL).
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useRouterState({ select: (s) => s.location });

  useEffect(() => {
    if (!loading && !user) {
      const destination = location.pathname;
      navigate({
        to: "/login",
        search: { redirect: destination !== "/" && destination !== "/login" ? destination : "/dashboard" },
      });
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
          <p className="text-sm text-muted-foreground font-medium">Loading Widget Studio…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect above
  }

  return <>{children}</>;
}
