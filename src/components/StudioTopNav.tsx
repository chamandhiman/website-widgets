import { useRouterState, useNavigate, Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Menu,
  LogOut,
  User,
  Settings,
  Boxes,
  Crown,
  HelpCircle,
  ExternalLink,
  BookOpen,
  Code2,
  Check,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { getPlanUsage, type PlanUsage } from "@/lib/widgets";

const ROUTE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/widgets": "Explore widgets",
  "/my-widgets": "My Widgets",
  "/templates": "Templates",
  "/integrations": "Integrations",
  "/settings": "Settings",
};

interface StudioTopNavProps {
  onOpenMobileNav?: () => void;
}

export function StudioTopNav({ onOpenMobileNav }: StudioTopNavProps) {
  const selectedPath: any = useRouterState({ select: (s) => s.location?.pathname || "" });
  const path: string =
    typeof selectedPath === "string"
      ? selectedPath
      : selectedPath?.location?.pathname || selectedPath?.pathname || "/dashboard";
  const navigate = useNavigate();
  let authContext: any = null;
  try {
    authContext = useAuth();
  } catch {
    // Graceful fallback when rendered in isolated unit tests without AuthProvider
  }
  const user = authContext?.user || null;
  const signOut = authContext?.signOut || (async () => {});
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [usage, setUsage] = useState<PlanUsage>(() => getPlanUsage());

  // Subscribe to widget count changes so usage indicator updates reactively
  useEffect(() => {
    const refresh = () => setUsage(getPlanUsage());
    refresh();
    if (typeof window !== "undefined") {
      window.addEventListener("wto-saved-changed", refresh);
      window.addEventListener("storage", refresh);
      return () => {
        window.removeEventListener("wto-saved-changed", refresh);
        window.removeEventListener("storage", refresh);
      };
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast("Signed out successfully");
      navigate({ to: "/login" });
    } catch {
      toast.error("Failed to sign out");
    }
  };

  // Derive user display info
  const userName = user?.displayName || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";
  const parts = userName.trim().split(" ").filter(Boolean);
  const initials =
    parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : userName.slice(0, 2).toUpperCase();

  // Determine section breadcrumb
  let title = "Explore widgets";
  if (ROUTE_TITLES[path]) {
    title = ROUTE_TITLES[path];
  } else if (path.startsWith("/editor")) {
    title = "Widget Editor";
  } else {
    for (const [route, t] of Object.entries(ROUTE_TITLES)) {
      if (route !== "/" && route !== "/dashboard" && path.startsWith(route)) {
        title = t;
        break;
      }
    }
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/90 bg-white px-4 md:px-6 dark:border-zinc-800 dark:bg-zinc-950">
        {/* Left Side: Mobile Menu + Full Logo + Breadcrumb */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* Mobile hamburger menu */}
          {onOpenMobileNav && (
            <button
              onClick={onOpenMobileNav}
              aria-label="Open navigation menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Full Website Widgets Logo: Preserves aspect ratio & transparency */}
          <Link to="/" className="flex items-center shrink-0 group focus:outline-none">
            <img
              src="/logo.png"
              alt="Website Widgets by WebToolOcean"
              className="h-8 md:h-9 w-auto object-contain transition-opacity group-hover:opacity-90"
            />
          </Link>

          {/* Breadcrumb separator & page title */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 font-medium select-none pl-1">
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-slate-500 font-medium">Widget Studio</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="font-semibold text-slate-900 dark:text-zinc-100">{title}</span>
          </div>
        </div>

        {/* Right Side: Plan Usage + Progress Bar + Upgrade Button + Help + Avatar */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Plan Usage Indicator and Horizontal Progress Bar */}
          <div className="hidden sm:flex flex-col items-end gap-1 select-none">
            <div className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300">
              <span className="capitalize">{usage.planName}</span>
              <span className="mx-1 text-slate-300">•</span>
              <span className="font-bold text-slate-900 dark:text-zinc-100">
                {usage.count} of {usage.limit}
              </span>{" "}
              widgets used
            </div>
            <div className="h-1.5 w-28 md:w-32 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden border border-slate-200/60 dark:border-zinc-700">
              <div
                className="h-full rounded-full bg-[#7c3aed] transition-all duration-300"
                style={{ width: `${Math.max(4, Math.min(100, usage.percentage))}%` }}
              />
            </div>
          </div>

          {/* Upgrade Plan button */}
          <button
            onClick={() => setUpgradeOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] active:scale-98 text-white px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-all duration-150"
          >
            <Crown className="h-3.5 w-3.5 fill-white text-white" />
            <span>Upgrade plan</span>
          </button>

          {/* Help icon button */}
          <button
            onClick={() => setHelpOpen(true)}
            aria-label="Help & Documentation"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <HelpCircle className="h-4.5 w-4.5" />
          </button>

          {/* User Avatar & Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="User account menu"
                  className="flex items-center gap-2 rounded-full p-0.5 hover:ring-2 hover:ring-purple-200 transition-all focus:outline-none"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={userName}
                      className="h-8 w-8 rounded-full object-cover border border-purple-200 shadow-2xs"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.style.display = "none";
                        const fallback = img.nextElementSibling as HTMLElement | null;
                        if (fallback) fallback.style.display = "grid";
                      }}
                    />
                  ) : null}
                  <div
                    className="grid h-8 w-8 place-items-center rounded-full bg-[#7c3aed] text-xs font-bold text-white shadow-2xs"
                    style={{ display: user.photoURL ? "none" : "grid" }}
                  >
                    {initials}
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-xl shadow-lg border-slate-200 dark:border-zinc-800">
                <DropdownMenuLabel className="font-normal px-2 py-1.5">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-zinc-100">{userName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem asChild className="rounded-lg text-xs cursor-pointer">
                  <Link to="/my-widgets" className="flex items-center py-1.5">
                    <Boxes className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>My Widgets ({usage.count})</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg text-xs cursor-pointer">
                  <Link to="/settings" className="flex items-center py-1.5">
                    <Settings className="mr-2 h-4 w-4 text-slate-500" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="rounded-lg text-xs text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer py-1.5"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: "/login" })}
              className="h-8.5 rounded-xl border-slate-300 px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-border dark:text-slate-200 dark:hover:bg-muted"
            >
              <User className="mr-1.5 h-3.5 w-3.5 text-purple-600" />
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* Upgrade Plan Modal */}
      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent className="max-w-2xl p-6 sm:rounded-2xl border-slate-200">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-purple-100 text-[#7c3aed]">
                <Crown className="h-4.5 w-4.5 fill-[#7c3aed]" />
              </span>
              <DialogTitle className="text-xl font-black text-slate-900">
                Upgrade Your Website Widgets Plan
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500">
              Unlock unlimited widgets, premium designs, custom branding removal, and faster CDN delivery.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Free Plan (Current) */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-left flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Free Plan</span>
                <div className="mt-1 text-2xl font-black text-slate-900">$0 <span className="text-xs font-normal text-slate-500">/ forever</span></div>
                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Up to 10 active widgets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>All standard design templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Instant CDN embed script</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6">
                <Button disabled variant="outline" className="w-full text-xs h-9 rounded-xl text-slate-500">
                  Current Plan ({usage.count}/10 used)
                </Button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="relative rounded-2xl border-2 border-[#7c3aed] bg-gradient-to-b from-purple-50/40 to-white p-4 text-left flex flex-col justify-between shadow-md">
              <span className="absolute -top-3 right-4 rounded-full bg-[#7c3aed] text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                Popular
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#7c3aed]">Pro Plan</span>
                <div className="mt-1 text-2xl font-black text-slate-900">$9 <span className="text-xs font-normal text-slate-500">/ month</span></div>
                <ul className="mt-4 space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#7c3aed] font-bold shrink-0" />
                    <span className="font-semibold text-slate-900">Unlimited website widgets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#7c3aed] font-bold shrink-0" />
                    <span>All 8+ premium design templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#7c3aed] font-bold shrink-0" />
                    <span>Remove "WebToolOcean" watermark</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#7c3aed] font-bold shrink-0" />
                    <span>Priority CDN edge routing & analytics</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6">
                <Button
                  onClick={() => {
                    toast.success("Thank you for your interest! Pro upgrade billing checkout is coming soon.");
                    setUpgradeOpen(false);
                  }}
                  className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs h-9 rounded-xl shadow-xs"
                >
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Help Modal */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-w-lg p-6 sm:rounded-2xl border-slate-200">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-100 text-blue-600">
                <HelpCircle className="h-4.5 w-4.5" />
              </span>
              <DialogTitle className="text-lg font-black text-slate-900">
                Help & Documentation
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500">
              Guides, embed tutorials, and answers to common questions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-3 text-xs">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Code2 className="h-4 w-4 text-purple-600" />
                How to install any widget on your website
              </div>
              <p className="mt-1 text-slate-600 text-[11px] leading-relaxed">
                1. Click <b>+ Add widget</b> on any widget card.<br />
                2. Customize its colors, texts, and layout in the live editor.<br />
                3. Click <b>Get Code</b> and copy the single &lt;script&gt; snippet into your HTML, WordPress, Shopify, or Webflow site.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-blue-600" />
                CMS Integrations Supported
              </div>
              <p className="mt-1 text-slate-600 text-[11px] leading-relaxed">
                Compatible with WordPress, Shopify, Wix, Squarespace, Webflow, React, Vue, Next.js, and static HTML websites.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Keep getStoredUser & saveStoredUser for tests backwards compatibility
export function getStoredUser(): { name: string; email: string; initials: string } | null {
  try {
    const raw = localStorage.getItem("wto.user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredUser(user: { name: string; email: string; initials: string } | null) {
  try {
    if (!user) {
      localStorage.removeItem("wto.user");
    } else {
      localStorage.setItem("wto.user", JSON.stringify(user));
    }
  } catch {}
}
