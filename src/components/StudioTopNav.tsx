import { useState, useEffect } from "react";
import { useRouterState, useNavigate, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  Menu,
  LogOut,
  User,
  Settings,
  Boxes,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export interface AuthUser {
  name: string;
  email: string;
  initials: string;
}

const AUTH_STORAGE_KEY = "wto_auth_user";

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

const ROUTE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/widgets": "All Widgets",
  "/my-widgets": "My Widgets",
  "/templates": "Templates",
  "/integrations": "Integrations",
  "/settings": "Settings",
};

interface StudioTopNavProps {
  onOpenMobileNav?: () => void;
}

export function StudioTopNav({ onOpenMobileNav }: StudioTopNavProps) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [signInOpen, setSignInOpen] = useState(false);
  const [signInName, setSignInName] = useState("Chaman Dhiman");
  const [signInEmail, setSignInEmail] = useState("chaman@webtoolocean.com");

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const handleSignIn = (name: string, email: string) => {
    const trimmedName = name.trim() || "User";
    const parts = trimmedName.split(" ").filter(Boolean);
    const initials =
      parts.length > 1
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : trimmedName.slice(0, 2).toUpperCase();

    const newUser: AuthUser = {
      name: trimmedName,
      email: email.trim() || "user@webtoolocean.com",
      initials,
    };

    saveStoredUser(newUser);
    setUser(newUser);
    setSignInOpen(false);
    toast.success(`Welcome back, ${trimmedName}!`);
  };

  const handleSignOut = () => {
    saveStoredUser(null);
    setUser(null);
    toast("Signed out successfully");
  };

  // Determine page title
  let title = "All Widgets";
  if (ROUTE_TITLES[path]) {
    title = ROUTE_TITLES[path];
  } else if (path.startsWith("/editor")) {
    title = "Widget Editor";
  } else {
    for (const [route, t] of Object.entries(ROUTE_TITLES)) {
      if (route !== "/" && path.startsWith(route)) {
        title = t;
        break;
      }
    }
  }

  // Dashboard has no back button; other pages show back arrow
  const isDashboard = path === "/";
  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white px-4 md:px-6 lg:px-8 dark:border-border/70 dark:bg-card">
        {/* Left Side: (Mobile Hamburger) + Back Arrow + Page Title */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Mobile hamburger menu */}
          {onOpenMobileNav && (
            <button
              onClick={onOpenMobileNav}
              aria-label="Open navigation menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden dark:text-muted-foreground dark:hover:bg-muted"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Back arrow icon button (hidden on main dashboard) */}
          {!isDashboard && (
            <button
              onClick={handleBack}
              aria-label="Navigate back"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-muted dark:hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5 stroke-[2.2]" />
            </button>
          )}

          {/* Page title */}
          <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-slate-100">
            {title}
          </h1>
        </div>

        {/* Right Side: Notification Bell + User Avatar or Sign In */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors dark:text-slate-400 dark:hover:bg-muted dark:hover:text-foreground"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="h-full w-full rounded-full bg-purple-500 opacity-75 animate-ping" />
                  <span className="absolute -top-0 -left-0 h-2 w-2 rounded-full bg-purple-600" />
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Notifications
                </span>
                <span className="text-[11px] text-purple-600 font-semibold">1 new</span>
              </div>
              <div className="mt-2 space-y-2">
                <div className="rounded-xl bg-purple-500/10 p-2.5 text-xs border border-purple-500/20">
                  <div className="flex items-center gap-1.5 font-semibold text-purple-900 dark:text-purple-200">
                    <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                    <span>Widget Studio Updated</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    WhatsApp Chat, Announcement Bar, and Popup Widget are ready for live customization!
                  </p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Section: Shows avatar & name if authenticated, otherwise Sign In */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 hover:bg-slate-100 transition-colors focus:outline-hidden dark:hover:bg-muted">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-purple-100 text-xs font-bold text-purple-700 border border-purple-200/80 shadow-2xs dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800">
                    {user.initials}
                  </div>
                  <span className="hidden text-sm font-semibold text-slate-800 sm:inline-block dark:text-slate-200">
                    {user.name}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-foreground">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/my-widgets" className="cursor-pointer">
                    <Boxes className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>My Widgets</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4 text-slate-500" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSignInOpen(true)}
              className="h-8.5 rounded-xl border-slate-300 px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-border dark:text-slate-200 dark:hover:bg-muted"
            >
              <User className="mr-1.5 h-3.5 w-3.5 text-purple-600" />
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* Sign In Dialog */}
      <Dialog open={signInOpen} onOpenChange={setSignInOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Sign In to Widget Studio</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Sign in to manage your website widgets and sync across your studio workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-xl border border-purple-200/80 bg-purple-50/60 p-3 text-xs dark:border-purple-900/50 dark:bg-purple-950/30">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-purple-900 dark:text-purple-200">
                  Quick Demo Login
                </span>
                <span className="text-[10px] rounded-full bg-purple-200/60 px-2 py-0.5 font-bold text-purple-800 dark:bg-purple-800 dark:text-purple-200">
                  Mockup Profile
                </span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Sign in as Chaman Dhiman to activate the exact profile seen in the mockup.
              </p>
              <Button
                type="button"
                size="sm"
                className="mt-2.5 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs h-8"
                onClick={() => handleSignIn("Chaman Dhiman", "chaman@webtoolocean.com")}
              >
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                Continue as Chaman Dhiman
              </Button>
            </div>

            <div className="relative flex items-center justify-center">
              <span className="bg-background px-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                or sign in with custom details
              </span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="wto-name" className="text-xs">
                  Full Name
                </Label>
                <Input
                  id="wto-name"
                  value={signInName}
                  onChange={(e) => setSignInName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="wto-email" className="text-xs">
                  Email Address
                </Label>
                <Input
                  id="wto-email"
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSignInOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
              onClick={() => handleSignIn(signInName, signInEmail)}
            >
              Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
