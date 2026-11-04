import { useState, useRef, useEffect, forwardRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ShieldCheck, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GoogleSignInCardProps {
  onSuccess?: () => void;
  redirectDestination?: string;
  className?: string;
  showBackHome?: boolean;
}

export function GoogleSignInCard({
  onSuccess,
  redirectDestination,
  className,
  showBackHome = false,
}: GoogleSignInCardProps) {
  const { signInWithGoogle, isFirebaseConfigured } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    setBusy(true);
    try {
      await signInWithGoogle();
      toast.success("Signed in successfully!");
      if (onSuccess) {
        onSuccess();
      }
      if (redirectDestination) {
        navigate({ to: redirectDestination });
      }
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      if (e.code === "auth/configuration-not-found") {
        setError(
          "Google Sign-In is not enabled yet in your Firebase Console. Go to Firebase Console → Authentication → Sign-in method and enable Google."
        );
      } else if (e.code === "auth/popup-closed-by-user") {
        setError("Sign-in was cancelled.");
      } else if (e.code === "auth/unauthorized-domain") {
        setError("This domain is not authorised in Firebase. Add it under Authentication → Settings → Authorized Domains.");
      } else {
        setError(e.message ?? "Google sign-in failed. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-[340px] rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-900/10 overflow-hidden text-left",
        className
      )}
    >
      {/* 1. Top rainbow gradient accent stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500" />

      <div className="p-5">
        {/* 2. Top header: Origami logo + WEBTOOLOCEAN on left, Verified badge on right */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/favicon.png"
              alt="WebToolOcean"
              className="h-5 w-5 object-contain"
            />
            <span className="text-xs font-black tracking-wider text-slate-500 uppercase font-sans">
              WEBTOOLOCEAN
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Verified</span>
          </div>
        </div>

        {/* 3. Main title */}
        <h3 className="text-lg font-bold text-slate-900 mt-3.5 tracking-tight">
          Sign in to your account
        </h3>

        {/* 4. Subtitle */}
        <p className="text-xs text-slate-500 leading-relaxed mt-1 mb-4">
          Secure sign-in with your Google account. Choose any account already logged in your browser.
        </p>

        {/* Firebase not configured warning */}
        {!isFirebaseConfigured && (
          <div className="mb-3.5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-900">Firebase not configured</p>
              <p className="mt-0.5 text-[11px] text-amber-700 leading-relaxed">
                Add Firebase credentials to <code className="font-mono">.env</code> to enable sign in.
              </p>
            </div>
          </div>
        )}

        {/* Error alert */}
        {error && (
          <div className="mb-3 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-600" />
            <p className="leading-snug">{error}</p>
          </div>
        )}

        {/* 5. Google Sign-In Button */}
        <button
          id="google-signin-btn"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={busy || !isFirebaseConfigured}
          className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm font-semibold text-slate-800 shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-purple-500"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
          ) : (
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 shrink-0" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        {/* 6. Sub-caption */}
        <p className="text-[11px] text-slate-400 mt-2 text-center">
          Secure sign-in with your Google account
        </p>

        {/* 7. Bottom footer strip */}
        <div className="mt-4 -mx-5 -mb-5 px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 rounded-b-2xl flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-purple-600 shrink-0" />
            <span>OAuth 2.0 Account Chooser</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span>Fast access</span>
          </div>
        </div>
      </div>

      {showBackHome && (
        <div className="p-3 text-center bg-slate-50/50 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="text-xs font-semibold text-slate-600 hover:text-purple-600 transition-colors cursor-pointer"
          >
            ← Back to homepage
          </button>
        </div>
      )}
    </div>
  );
}

interface LoginDropdownProps {
  buttonText?: string;
  className?: string;
  redirectDestination?: string;
}

export const LoginDropdown = forwardRef<HTMLDivElement, LoginDropdownProps>(
  ({ buttonText = "Log in", className, redirectDestination }, ref) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Close on outside click
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      }
      if (open) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [open]);

    // Close on Escape key
    useEffect(() => {
      function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape") {
          setOpen(false);
        }
      }
      if (open) {
        document.addEventListener("keydown", handleKeyDown);
      }
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [open]);

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn("relative inline-block text-left", className)}
      >
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-haspopup="dialog"
          className="rounded-full border border-slate-300 bg-white px-5 py-1.5 text-sm font-semibold text-slate-800 shadow-2xs hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-purple-500"
        >
          {buttonText}
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <GoogleSignInCard
              onSuccess={() => setOpen(false)}
              redirectDestination={redirectDestination}
            />
          </div>
        )}
      </div>
    );
  }
);
LoginDropdown.displayName = "LoginDropdown";

