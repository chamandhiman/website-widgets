import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  LayoutGrid,
  Boxes,
  LayoutTemplate,
  Link2,
  Settings,
  X,
  Crown,
  Menu,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { StudioTopNav } from "./StudioTopNav";
import { AuthGuard } from "@/lib/auth";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

const NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: Home,
  },
  {
    to: "/widgets",
    label: "All Widgets",
    icon: LayoutGrid,
  },
  {
    to: "/my-widgets",
    label: "My Widgets",
    icon: Boxes,
  },
  {
    to: "/templates",
    label: "Templates",
    icon: LayoutTemplate,
  },
  {
    to: "/integrations",
    label: "Integrations",
    icon: Link2,
  },
  {
    to: "/settings",
    label: "Settings",
    icon: Settings,
  },
] as const;

export function StudioLayout({ children }: { children: ReactNode }) {
  const rawPath = useRouterState({ select: (s) => s.location?.pathname || "" }) || "";
  const path = typeof rawPath === "string" ? rawPath : (rawPath as any)?.pathname || "/dashboard";

  // Sidebar toggle state (collapsed by default at 68px, expandable to 240px)
  const [isExpanded, setIsExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Standalone pages like /login or marketing / do not render the studio frame
  if (path === "/" || path === "/login") {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen w-full flex-col bg-[#f8fafc] text-slate-900 dark:bg-zinc-950 dark:text-zinc-100 font-sans">
        {/* ================= 1. COMMON TOP NAVIGATION BAR ================= */}
        {/* Visible across main application pages, independent of left sidebar */}
        <StudioTopNav onOpenMobileNav={() => setMobileOpen(true)} />

        {/* ================= BODY WRAPPER: SIDEBAR + CONTENT ================= */}
        <div className="relative flex flex-1 w-full min-w-0">
          {/* Fixed-width spacer so main workspace content stays 100% stable with smooth transition */}
          <div
            className={cn(
              "hidden md:block shrink-0 transition-[width] duration-200 ease-in-out",
              isExpanded ? "w-60" : "w-[68px]"
            )}
          />

          {/* ================= 2. BLACK LEFT NAVIGATION SIDEBAR ================= */}
          {/* Collapsed by default (68px), expandable on toggle (240px) with smooth transition */}
          <TooltipProvider delayDuration={100} skipDelayDuration={250}>
            <aside
              role="complementary"
              className={cn(
                "fixed top-16 bottom-0 left-0 z-40 hidden md:flex flex-col justify-between bg-[#0e1017] border-r border-zinc-800/80 select-none transition-[width] duration-200 ease-in-out",
                isExpanded ? "w-60" : "w-[68px]"
              )}
            >
              {/* Top Section: Hamburger toggle + Navigation items */}
              <div className="flex flex-col items-center p-3 pt-3.5">
                {/* 1. Hamburger Menu Icon (Top of sidebar, above Dashboard) */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setIsExpanded((prev) => !prev)}
                      aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
                      aria-expanded={isExpanded}
                      className={cn(
                        "group relative flex items-center rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors duration-150 h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 mb-2 cursor-pointer",
                        isExpanded ? "w-full px-3 gap-3 justify-start" : "w-11 justify-center"
                      )}
                    >
                      <Menu className="h-5 w-5 shrink-0 transition-transform duration-150 group-hover:scale-105" />
                      {isExpanded && (
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                          Collapse
                        </span>
                      )}
                    </button>
                  </TooltipTrigger>
                  {!isExpanded && (
                    <TooltipContent
                      side="right"
                      align="center"
                      sideOffset={14}
                      showArrow
                      className="font-medium text-xs whitespace-nowrap shadow-xl"
                    >
                      Expand sidebar
                    </TooltipContent>
                  )}
                </Tooltip>

                {/* Navigation List */}
                <nav className="flex flex-col gap-2 w-full items-center">
                  {NAV_ITEMS.map((item) => {
                    const isActive =
                      item.to === "/dashboard"
                        ? path === "/dashboard" || path === "/"
                        : path.startsWith(item.to);

                    return (
                      <Tooltip key={item.to}>
                        <TooltipTrigger asChild>
                          <Link
                            to={item.to}
                            aria-label={item.label}
                            className={cn(
                              "group relative flex items-center rounded-xl transition-colors duration-150 h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
                              isExpanded ? "w-full px-3 gap-3 justify-start" : "w-11 justify-center",
                              isActive
                                ? "bg-[#7c3aed] text-white font-semibold shadow-xs"
                                : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                            )}
                          >
                            <item.icon
                              className={cn(
                                "h-5 w-5 shrink-0 transition-transform duration-150 group-hover:scale-105",
                                isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                              )}
                            />
                            {isExpanded && (
                              <span
                                className={cn(
                                  "text-xs truncate transition-opacity duration-150",
                                  isActive
                                    ? "font-semibold text-white"
                                    : "font-medium text-zinc-300 group-hover:text-white"
                                )}
                              >
                                {item.label}
                              </span>
                            )}
                          </Link>
                        </TooltipTrigger>
                        {!isExpanded && (
                          <TooltipContent
                            side="right"
                            align="center"
                            sideOffset={14}
                            showArrow
                            className="font-medium text-xs whitespace-nowrap shadow-xl"
                          >
                            {item.label}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Section: Upgrade to Pro Button */}
              <div className="p-3 flex justify-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to="/settings"
                      aria-label="Upgrade to Pro"
                      className={cn(
                        "flex items-center rounded-xl bg-zinc-900/90 border border-zinc-800/90 text-amber-400 hover:bg-zinc-800 hover:text-amber-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 shadow-xs",
                        isExpanded ? "w-full px-3 py-2.5 gap-3 justify-start" : "h-11 w-11 justify-center"
                      )}
                    >
                      <Crown className="h-5 w-5 shrink-0 fill-amber-400" />
                      {isExpanded && (
                        <span className="text-xs font-bold text-white whitespace-nowrap">
                          Upgrade to Pro
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {!isExpanded && (
                    <TooltipContent
                      side="right"
                      align="center"
                      sideOffset={14}
                      showArrow
                      className="font-medium text-xs whitespace-nowrap shadow-xl"
                    >
                      Upgrade to Pro
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
            </aside>
          </TooltipProvider>

          {/* ================= MOBILE DRAWER SIDEBAR ================= */}
          {mobileOpen && (
            <div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <aside
                className="flex h-full w-64 flex-col justify-between bg-[#0e1017] p-4 text-white border-r border-zinc-800 shadow-2xl animate-in slide-in-from-left duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Navigation</span>
                    <button
                      onClick={() => setMobileOpen(false)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <nav className="flex flex-col gap-1.5">
                    {NAV_ITEMS.map((item) => {
                      const isActive =
                        item.to === "/dashboard"
                          ? path === "/dashboard" || path === "/"
                          : path.startsWith(item.to);

                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 h-11 text-xs font-medium transition-colors",
                            isActive
                              ? "bg-[#7c3aed] text-white font-semibold"
                              : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                          )}
                        >
                          <item.icon className="h-4.5 w-4.5" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1">
                    <Crown className="h-4 w-4 fill-amber-400" />
                    <span className="text-xs font-bold text-white">Upgrade to Pro</span>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setMobileOpen(false)}
                    className="mt-2 block w-full rounded-xl bg-[#7c3aed] py-1.5 text-xs font-bold text-white"
                  >
                    Upgrade plan
                  </Link>
                </div>
              </aside>
            </div>
          )}

          {/* ================= MAIN CONTENT WORKSPACE ================= */}
          <main className="flex-1 min-w-0 flex flex-col bg-[#f8fafc] dark:bg-zinc-950">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

export function PageHeader({
  title,
  description,
  children,
}: {
  title: ReactNode;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground md:text-3xl lg:text-4xl">
          {title}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

