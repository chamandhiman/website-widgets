import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Grid3x3, Boxes, LayoutTemplate, Plug, Settings, Waves, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/widgets", label: "All Widgets", icon: Grid3x3 },
  { to: "/my-widgets", label: "My Widgets", icon: Boxes },
  { to: "/templates", label: "Templates", icon: LayoutTemplate },
  { to: "/integrations", label: "Integrations", icon: Plug },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function StudioLayout({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map((n) => {
        const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
        return (
          <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
            className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
            <n.icon className="h-4 w-4" />{n.label}
          </Link>
        );
      })}
    </nav>
  );
  const brand = (
    <Link to="/" className="flex items-center gap-2 px-2 font-bold tracking-tight">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-primary-foreground"><Waves className="h-4 w-4" /></span>
      WebToolOcean
    </Link>
  );
  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-6 border-r bg-card p-4 md:flex">
        {brand}{nav}
        <div className="mt-auto rounded-xl bg-brand-soft p-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Widget Studio</p>Settings are saved in this browser.
        </div>
      </aside>
      {open && (
        <div className="fixed inset-0 z-40 bg-foreground/30 md:hidden" onClick={() => setOpen(false)}>
          <aside className="flex h-full w-64 flex-col gap-6 bg-card p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">{brand}<button onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button></div>
            {nav}
          </aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b bg-card px-4 md:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>{brand}
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
