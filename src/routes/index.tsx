import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Boxes, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/StudioLayout";
import { WidgetCatalog } from "@/components/WidgetCatalog";
import { WIDGETS, loadSaved } from "@/lib/widgets";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Website Widgets Studio — WebToolOcean" },
      { name: "description", content: "Discover, customize and manage all your website widgets in one place." },
      { property: "og:title", content: "Website Widgets Studio — WebToolOcean" },
      { property: "og:description", content: "Discover, customize and manage all your website widgets in one place." },
    ],
  }),
  component: Index,
});

function Index() {
  const [saved, setSaved] = useState(0);
  useEffect(() => setSaved(loadSaved().length), []);

  const stats = [
    {
      label: "Ready to Install",
      value: WIDGETS.filter((w) => w.ready).length,
      icon: CheckCircle2,
      cardBg: "bg-gradient-to-br from-emerald-500/12 via-teal-500/5 to-transparent border-emerald-500/30",
      iconBg: "bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30",
      valueColor: "text-emerald-700 dark:text-emerald-300",
      badge: "Production Ready",
      badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    },
    {
      label: "Coming Soon",
      value: WIDGETS.filter((w) => !w.ready).length,
      icon: Clock,
      cardBg: "bg-gradient-to-br from-amber-500/12 via-orange-500/5 to-transparent border-amber-500/30",
      iconBg: "bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30",
      valueColor: "text-amber-700 dark:text-amber-300",
      badge: "In Development",
      badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    },
    {
      label: "My Saved Widgets",
      value: saved,
      icon: Boxes,
      cardBg: "bg-gradient-to-br from-purple-500/12 via-indigo-500/5 to-transparent border-purple-500/30",
      iconBg: "bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-600 text-white shadow-md shadow-purple-500/30",
      valueColor: "text-purple-700 dark:text-purple-300",
      badge: "Local Studio",
      badgeClass: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl p-5 md:p-8 space-y-8">
      {/* Hero / Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b pb-6 border-border/70">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-500/15 to-pink-500/15 px-3 py-1 text-xs font-bold text-purple-700 dark:text-purple-300 border border-purple-500/20 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-purple-500" />
            <span>WebToolOcean Widget Studio</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
            Explore Website Widgets
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Pick from lightweight, customizable widgets and embed them on any website with a single JavaScript snippet.
          </p>
        </div>
      </div>

      {/* Colorful Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={cn(
              "relative overflow-hidden flex items-center justify-between gap-4 rounded-3xl border p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg backdrop-blur-xs",
              s.cardBg
            )}
          >
            <div className="flex items-center gap-4">
              <span className={cn("grid h-12 w-12 place-items-center rounded-2xl", s.iconBg)}>
                <s.icon className="h-6 w-6" />
              </span>
              <div>
                <div className={cn("text-3xl font-black tracking-tight", s.valueColor)}>
                  {s.value}
                </div>
                <div className="text-xs font-semibold text-muted-foreground">{s.label}</div>
              </div>
            </div>
            <span
              className={cn(
                "hidden sm:inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold border",
                s.badgeClass
              )}
            >
              {s.badge}
            </span>
          </div>
        ))}
      </div>

      {/* Main Catalog */}
      <WidgetCatalog />
    </div>
  );
}
