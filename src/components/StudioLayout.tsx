import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Grid3x3,
  Boxes,
  LayoutTemplate,
  Plug,
  Settings,
  Waves,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    iconColor: "text-blue-500 dark:text-blue-400",
    activeClass: "bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-transparent text-blue-700 dark:text-blue-300 border-blue-600",
  },
  {
    to: "/widgets",
    label: "All Widgets",
    icon: Grid3x3,
    iconColor: "text-purple-500 dark:text-purple-400",
    activeClass: "bg-gradient-to-r from-purple-500/15 via-violet-500/10 to-transparent text-purple-700 dark:text-purple-300 border-purple-600",
  },
  {
    to: "/my-widgets",
    label: "My Widgets",
    icon: Boxes,
    iconColor: "text-emerald-500 dark:text-emerald-400",
    activeClass: "bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent text-emerald-700 dark:text-emerald-300 border-emerald-600",
  },
  {
    to: "/templates",
    label: "Templates",
    icon: LayoutTemplate,
    iconColor: "text-amber-500 dark:text-amber-400",
    activeClass: "bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent text-amber-700 dark:text-amber-300 border-amber-600",
  },
  {
    to: "/integrations",
    label: "Integrations",
    icon: Plug,
    iconColor: "text-pink-500 dark:text-pink-400",
    activeClass: "bg-gradient-to-r from-pink-500/15 via-rose-500/10 to-transparent text-pink-700 dark:text-pink-300 border-pink-600",
  },
  {
    to: "/settings",
    label: "Settings",
    icon: Settings,
    iconColor: "text-cyan-500 dark:text-cyan-400",
    activeClass: "bg-gradient-to-r from-cyan-500/15 via-sky-500/10 to-transparent text-cyan-700 dark:text-cyan-300 border-cyan-600",
  },
] as const;

export function StudioLayout({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const brand = (
    <Link to="/" className="flex items-center gap-2.5 px-2 font-bold tracking-tight group">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white shadow-md shadow-purple-500/30 transition-transform group-hover:scale-105">
        <Waves className="h-5 w-5" />
      </span>
      <div className="flex flex-col">
        <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600 bg-clip-text text-lg font-black tracking-tight text-transparent dark:from-purple-400 dark:via-indigo-300 dark:to-pink-400">
          WebToolOcean
        </span>
        <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground -mt-1">
          Widget Studio
        </span>
      </div>
    </Link>
  );

  const nav = (
    <nav className="flex flex-col gap-1.5">
      {NAV.map((n) => {
        const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
        return (
          <Link
            key={n.to}
            to={n.to}
            onClick={() => setOpen(false)}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? cn("border-l-4 font-semibold shadow-2xs", n.activeClass)
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground hover:translate-x-0.5"
            )}
          >
            <span
              className={cn(
                "grid h-7 w-7 place-items-center rounded-lg transition-transform group-hover:scale-110",
                active
                  ? "bg-white/80 dark:bg-card shadow-2xs"
                  : "bg-muted/50"
              )}
            >
              <n.icon className={cn("h-4 w-4 transition-colors", n.iconColor)} />
            </span>
            <span className="leading-none">{n.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="relative flex min-h-screen w-full bg-background overflow-hidden selection:bg-purple-500/20">
      {/* ================= AMBIENT COLORFUL GRADIENT GLOWS ================= */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-purple-500/12 via-indigo-500/8 to-transparent blur-3xl" />
      <div className="pointer-events-none fixed top-1/4 right-0 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-blue-500/12 via-cyan-500/8 to-transparent blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 left-1/3 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-pink-500/10 via-amber-500/8 to-transparent blur-3xl" />

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-6 border-r border-border/70 bg-card/85 backdrop-blur-xl p-5 md:flex z-10 shadow-xs">
        {brand}
        {nav}

        {/* Colorful Bottom Widget Studio Pro Card */}
        <div className="mt-auto rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-pink-500/10 p-4 text-xs shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-foreground tracking-tight flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-purple-500" />
              Widget Studio
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Fast, zero-code widgets running locally in your browser.
          </p>
        </div>
      </aside>

      {/* ================= MOBILE SIDEBAR ================= */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-xs md:hidden"
          onClick={() => setOpen(false)}
        >
          <aside
            className="flex h-full w-64 flex-col gap-6 bg-card p-5 shadow-2xl border-r"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              {brand}
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <div className="relative z-1 flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-border/70 bg-card/80 backdrop-blur-md px-4 md:hidden">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>
          {brand}
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
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
