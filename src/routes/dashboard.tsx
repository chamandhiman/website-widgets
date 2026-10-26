import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Boxes, CheckCircle2, Clock } from "lucide-react";
import { WidgetCatalog } from "@/components/WidgetCatalog";
import { WIDGETS, loadSaved } from "@/lib/widgets";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — WebToolOcean Widget Studio" },
      { name: "description", content: "Discover, customize and manage all your website widgets in one place." },
      { property: "og:title", content: "Dashboard — WebToolOcean Widget Studio" },
      { property: "og:description", content: "Discover, customize and manage all your website widgets in one place." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
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
    },
    {
      label: "Coming Soon",
      value: WIDGETS.filter((w) => !w.ready).length,
      icon: Clock,
      cardBg: "bg-gradient-to-br from-amber-500/12 via-orange-500/5 to-transparent border-amber-500/30",
      iconBg: "bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30",
      valueColor: "text-amber-700 dark:text-amber-300",
    },
    {
      label: "My Saved Widgets",
      value: saved,
      icon: Boxes,
      cardBg: "bg-gradient-to-br from-purple-500/12 via-indigo-500/5 to-transparent border-purple-500/30",
      iconBg: "bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-600 text-white shadow-md shadow-purple-500/30",
      valueColor: "text-purple-700 dark:text-purple-300",
    },
  ];

  return (
    <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-7 space-y-4 md:space-y-5">
      {/* Top Header Row: Title & Subtitle on Left, 3 Stat Boxes on Right */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 pb-4 border-b border-border/70">
        <div className="max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Explore Website Widgets
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-muted-foreground leading-relaxed">
            Pick from lightweight, customizable widgets and embed them on any website with a single JavaScript snippet.
          </p>
        </div>

        {/* 3 Compact Stat Boxes in Top Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0 xl:max-w-xl w-full xl:w-auto">
          {stats.map((s) => (
            <div
              key={s.label}
              className={cn(
                "relative flex flex-col justify-between rounded-2xl border p-3 shadow-2xs transition-all duration-200 hover:shadow-xs backdrop-blur-xs min-w-[140px]",
                s.cardBg
              )}
            >
              {/* Top: Icon and Count */}
              <div className="flex items-center gap-2.5">
                <span className={cn("grid h-9 w-9 place-items-center rounded-xl shrink-0 shadow-2xs", s.iconBg)}>
                  <s.icon className="h-4.5 w-4.5" />
                </span>
                <span className={cn("text-2xl font-black tracking-tight leading-none", s.valueColor)}>
                  {s.value}
                </span>
              </div>

              {/* Bottom: Text Label */}
              <div className="mt-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Catalog: Immediately visible on screen */}
      <WidgetCatalog />
    </div>
  );
}
