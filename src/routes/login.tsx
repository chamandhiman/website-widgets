import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Waves, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

type AuthMode = "signin" | "signup" | "forgot";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search["redirect"] === "string" ? (search["redirect"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign In — WebToolOcean Widget Studio" },
      { name: "description", content: "Sign in to create and manage your website widgets." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithEmail, createAccount, resetPassword, isFirebaseConfigured } = useAuth();
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const targetDestination = redirect && redirect.startsWith("/") ? redirect : "/dashboard";
  const [mode, setMode] = useState<AuthMode>("signin");

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate({ to: targetDestination });
    }
  }, [user, loading, navigate, targetDestination]);

  const clearForm = () => {
    setError(null);
    setResetSent(false);
    setPassword("");
    setConfirmPassword("");
  };

  const switchMode = (m: AuthMode) => {
    setMode(m);
    clearForm();
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setBusy(true);
    try {
      await signInWithGoogle();
      toast.success("Signed in successfully!");
      navigate({ to: targetDestination });
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      if (e.code === "auth/configuration-not-found") {
        setError("Google Sign-In is not enabled yet in your Firebase Console. Go to Firebase Console → Authentication → Sign-in method and enable Google.");
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

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signInWithEmail(email, password);
      toast.success("Welcome back!");
      navigate({ to: targetDestination });
    } catch (err: unknown) {
      const er = err as { code?: string };
      if (er.code === "auth/configuration-not-found") {
        setError("Email/Password provider is not enabled in Firebase Console. Go to Firebase Console → Authentication → Sign-in method and enable Email/Password.");
      } else if (er.code === "auth/user-not-found" || er.code === "auth/wrong-password" || er.code === "auth/invalid-credential") {
        setError("Incorrect email or password. Please try again.");
      } else if (er.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please wait a moment then try again.");
      } else {
        setError("Sign-in failed. Please check your credentials.");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    try {
      await createAccount(name, email, password);
      toast.success("Account created! Welcome to Widget Studio 🎉");
      navigate({ to: targetDestination });
    } catch (err: unknown) {
      const er = err as { code?: string };
      if (er.code === "auth/configuration-not-found") {
        setError("Email/Password provider is not enabled in Firebase Console. Go to Firebase Console → Authentication → Sign-in method and enable Email/Password.");
      } else if (er.code === "auth/email-already-in-use") {
        setError("An account with this email already exists. Try signing in instead.");
      } else if (er.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Account creation failed. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err: unknown) {
      const er = err as { code?: string };
      if (er.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
          <p className="text-sm text-slate-500 font-medium">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/40 to-indigo-100/60 flex items-center justify-center p-4">
      {/* Background decorative glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-purple-400/20 via-violet-400/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-indigo-400/20 via-blue-400/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-gradient-radial from-pink-400/5 via-transparent to-transparent blur-3xl" />

      {/* Auth card */}
      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-white/80 bg-white/90 backdrop-blur-xl shadow-2xl shadow-purple-900/10 overflow-hidden">
          {/* Top gradient accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-500" />

          <div className="px-7 pt-7 pb-8">
            {/* Logo & branding */}
            <div className="mb-6 flex flex-col items-center">
              <Link to="/" className="group mb-5 flex items-center gap-2.5">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white shadow-lg shadow-purple-500/30 transition-transform group-hover:scale-105">
                  <Waves className="h-6 w-6" />
                </span>
                <div className="flex flex-col">
                  <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600 bg-clip-text text-xl font-black tracking-tight text-transparent">
                    WebToolOcean
                  </span>
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 -mt-0.5">
                    Widget Studio
                  </span>
                </div>
              </Link>

              {mode === "signin" && (
                <>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome back!</h1>
                  <p className="mt-1 text-sm text-slate-500 text-center leading-relaxed">
                    Sign in to create and manage your website widgets.
                  </p>
                </>
              )}
              {mode === "signup" && (
                <>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create account</h1>
                  <p className="mt-1 text-sm text-slate-500 text-center leading-relaxed">
                    Start building website widgets for free.
                  </p>
                </>
              )}
              {mode === "forgot" && (
                <>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reset password</h1>
                  <p className="mt-1 text-sm text-slate-500 text-center leading-relaxed">
                    Enter your email and we'll send you a reset link.
                  </p>
                </>
              )}
            </div>

            {/* Firebase not configured warning */}
            {!isFirebaseConfigured && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <div>
                  <p className="font-semibold text-amber-900">Firebase not configured</p>
                  <p className="mt-0.5 text-xs text-amber-700 leading-relaxed">
                    Copy <code className="rounded bg-amber-100 px-1 font-mono">.env.example</code> to{" "}
                    <code className="rounded bg-amber-100 px-1 font-mono">.env</code> and add your Firebase credentials to enable authentication.
                  </p>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <p>{error}</p>
              </div>
            )}

            {/* Reset-sent confirmation */}
            {resetSent && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <p className="font-semibold text-emerald-800">Reset link sent!</p>
                <p className="mt-0.5 text-xs">Check your inbox and follow the link to reset your password.</p>
              </div>
            )}

            {/* ===================== SIGN IN ===================== */}
            {mode === "signin" && (
              <>
                {/* Google */}
                <button
                  id="google-signin-btn"
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={busy || !isFirebaseConfigured}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-purple-500"
                >
                  {busy ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin text-slate-400" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  )}
                  Continue with Google
                </button>

                <div className="my-5 flex items-center gap-3">
                  <div className="flex-1 border-t border-slate-200" />
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    or continue with email
                  </span>
                  <div className="flex-1 border-t border-slate-200" />
                </div>

                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700">
                      Email address
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-200 disabled:opacity-60"
                      disabled={busy || !isFirebaseConfigured}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => switchMode("forgot")}
                        className="text-xs font-medium text-purple-600 hover:text-purple-800 hover:underline focus:outline-none"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-200 disabled:opacity-60"
                        disabled={busy || !isFirebaseConfigured}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    id="email-signin-btn"
                    type="submit"
                    disabled={busy || !isFirebaseConfigured}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-purple-500/30 transition-all hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Sign In
                  </button>
                </form>

                <p className="mt-5 text-center text-sm text-slate-500">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signup")}
                    className="font-semibold text-purple-600 hover:text-purple-800 hover:underline"
                  >
                    Create an account
                  </button>
                </p>
              </>
            )}

            {/* ===================== SIGN UP ===================== */}
            {mode === "signup" && (
              <>
                <button
                  id="google-signup-btn"
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={busy || !isFirebaseConfigured}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busy ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin text-slate-400" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  )}
                  Continue with Google
                </button>

                <div className="my-5 flex items-center gap-3">
                  <div className="flex-1 border-t border-slate-200" />
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    or continue with email
                  </span>
                  <div className="flex-1 border-t border-slate-200" />
                </div>

                <form onSubmit={handleCreateAccount} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="signup-name" className="block text-xs font-semibold text-slate-700">
                      Full name
                    </label>
                    <input
                      id="signup-name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Morgan"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-200 disabled:opacity-60"
                      disabled={busy || !isFirebaseConfigured}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="signup-email" className="block text-xs font-semibold text-slate-700">
                      Email address
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-200 disabled:opacity-60"
                      disabled={busy || !isFirebaseConfigured}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="signup-password" className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-200 disabled:opacity-60"
                        disabled={busy || !isFirebaseConfigured}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="signup-confirm" className="block text-xs font-semibold text-slate-700">
                      Confirm password
                    </label>
                    <div className="relative">
                      <input
                        id="signup-confirm"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-200 disabled:opacity-60"
                        disabled={busy || !isFirebaseConfigured}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    id="create-account-btn"
                    type="submit"
                    disabled={busy || !isFirebaseConfigured}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-purple-500/30 transition-all hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Create Account
                  </button>
                </form>

                <p className="mt-4 text-center text-[11px] text-slate-400 leading-relaxed">
                  By creating an account, you agree to our{" "}
                  <a href="#" className="text-purple-600 hover:underline">Terms of Service</a>{" "}
                  and{" "}
                  <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>.
                </p>

                <p className="mt-3 text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signin")}
                    className="font-semibold text-purple-600 hover:text-purple-800 hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </>
            )}

            {/* ===================== FORGOT PASSWORD ===================== */}
            {mode === "forgot" && !resetSent && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="reset-email" className="block text-xs font-semibold text-slate-700">
                    Email address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  />
                </div>
                <button
                  id="reset-password-btn"
                  type="submit"
                  disabled={busy || !isFirebaseConfigured}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-purple-500/30 transition-all hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Send Reset Link
                </button>
                <p className="text-center text-sm text-slate-500">
                  <button
                    type="button"
                    onClick={() => switchMode("signin")}
                    className="font-semibold text-purple-600 hover:text-purple-800 hover:underline"
                  >
                    Back to sign in
                  </button>
                </p>
              </form>
            )}

            {mode === "forgot" && resetSent && (
              <p className="mt-2 text-center text-sm text-slate-500">
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="font-semibold text-purple-600 hover:text-purple-800 hover:underline"
                >
                  Return to sign in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Back to homepage link */}
        <p className="mt-5 text-center text-sm text-slate-500">
          <Link to="/" className="font-medium text-slate-600 hover:text-purple-700 hover:underline transition-colors">
            ← Back to homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
