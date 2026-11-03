import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { GoogleSignInCard } from "@/components/LoginDropdown";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => {
    const redirect = typeof search["redirect"] === "string" ? (search["redirect"] as string) : undefined;
    return redirect ? { redirect } : {};
  },
  head: () => ({
    meta: [
      { title: "Sign In — Website Widgets by WebToolOcean" },
      { name: "description", content: "Sign in with Google to create and manage your website widgets." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const targetDestination = redirect && redirect.startsWith("/") ? redirect : "/dashboard";

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate({ to: targetDestination });
    }
  }, [user, loading, navigate, targetDestination]);

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

      {/* Centered Modern Google Sign-In Card matching the new design */}
      <div className="relative w-full max-w-[360px] flex justify-center">
        <GoogleSignInCard
          showBackHome
          redirectDestination={targetDestination}
          className="shadow-2xl shadow-purple-900/10"
        />
      </div>
    </div>
  );
}
