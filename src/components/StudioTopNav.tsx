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
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

const ROUTE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
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
  const { user, signOut } = useAuth();

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

  // Determine page title
  let title = "All Widgets";
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

  // Dashboard has no back button; other pages show back arrow
  const isDashboard = path === "/" || path === "/dashboard";
  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/dashboard" });
    }
  };

  return (
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
                  WhatsApp Chat, Announcement Bar, Popup Widget, and FAQ Accordion are ready for live customization!
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
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={userName}
                    className="h-8 w-8 rounded-full object-cover border border-purple-200 shadow-2xs"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Hide broken image and show the initials fallback
                      const img = e.currentTarget;
                      img.style.display = "none";
                      const fallback = img.nextElementSibling as HTMLElement | null;
                      if (fallback) fallback.style.display = "grid";
                    }}
                  />
                ) : null}
                <div
                  className="grid h-8 w-8 place-items-center rounded-full bg-purple-100 text-xs font-bold text-purple-700 border border-purple-200/80 shadow-2xs dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800"
                  style={{ display: user.photoURL ? "none" : "grid" }}
                >
                  {initials}
                </div>

                <span className="hidden text-sm font-semibold text-slate-800 sm:inline-block dark:text-slate-200">
                  {userName}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none text-foreground">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
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
            onClick={() => navigate({ to: "/login" })}
            className="h-8.5 rounded-xl border-slate-300 px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-border dark:text-slate-200 dark:hover:bg-muted"
          >
            <User className="mr-1.5 h-3.5 w-3.5 text-purple-600" />
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
