import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  Boxes,
  CheckCircle2,
  Clock,
  Crown,
  Plus,
  ArrowRight,
  ExternalLink,
  Pencil,
  Code2,
  Trash2,
  Globe,
  Sparkles,
  Layers,
  MessageCircle,
  Megaphone,
  PanelTop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  WIDGETS,
  loadSaved,
  deleteWidget,
  getPlanUsage,
  embedCode,
  type SavedWidget,
  type PlanUsage,
} from "@/lib/widgets";
import { InstallModal } from "@/components/InstallModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Website Widgets" },
      { name: "description", content: "Manage your active widgets, track usage, and create new website widgets." },
      { property: "og:title", content: "Dashboard — Website Widgets" },
      { property: "og:description", content: "Manage your active widgets, track usage, and create new website widgets." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [saved, setSaved] = useState<SavedWidget[]>([]);
  const [usage, setUsage] = useState<PlanUsage>(() => getPlanUsage());
  const [installWidget, setInstallWidget] = useState<SavedWidget | null>(null);

  const loadData = () => {
    const list = loadSaved();
    setSaved(list);
    setUsage(getPlanUsage());
  };

  useEffect(() => {
    loadData();
    if (typeof window !== "undefined") {
      window.addEventListener("wto-saved-changed", loadData);
      window.addEventListener("storage", loadData);
      return () => {
        window.removeEventListener("wto-saved-changed", loadData);
        window.removeEventListener("storage", loadData);
      };
    }
  }, []);

  const handleDelete = (id: string) => {
    deleteWidget(id);
    loadData();
    toast.success("Widget deleted");
  };

  // Published vs Draft count: widgets with a specified website are considered configured/live
  const publishedCount = useMemo(() => saved.filter((w) => Boolean(w.website)).length, [saved]);
  const draftCount = saved.length - publishedCount;

  // Spotlight popular widgets for quick creation
  const spotlightWidgets = useMemo(() => {
    return [
      { type: "whatsapp-chat", name: "WhatsApp Chat", icon: MessageCircle, desc: "Floating chat button connecting directly to WhatsApp", badge: "Popular", designs: "3 Designs" },
      { type: "announcement-bar", name: "Announcement Bar", icon: Megaphone, desc: "Top header ribbon for flash sales and news", badge: "Popular", designs: "6 Designs" },
      { type: "popup", name: "Popup Widget", icon: PanelTop, desc: "High-converting exit-intent & discount modal popups", badge: "Popular", designs: "8 Designs" },
      { type: "logo-carousel", name: "Logo Carousel", icon: Layers, desc: "Client logos, trusted brands & partner showcases", badge: "New", designs: "8 Designs" },
    ];
  }, []);

  return (
    <div className="mx-auto w-full max-w-[1600px] p-5 sm:p-7 lg:p-9 space-y-8">
      {/* 1. TOP WELCOME ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-zinc-100">
            Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed dark:text-zinc-400">
            Overview of your active website widgets, usage limits, and quick creation shortcuts.
          </p>
        </div>

        <Button asChild className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold rounded-xl h-10 px-4 shadow-sm shrink-0">
          <Link to="/widgets">
            <Plus className="mr-1.5 h-4 w-4 stroke-[2.5]" />
            <span>Create New Widget</span>
          </Link>
        </Button>
      </div>

      {/* 2. STATS OVERVIEW CARDS (4 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Widgets */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Total Widgets</span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-purple-50 text-[#7c3aed]">
              <Boxes className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900 dark:text-zinc-100">{saved.length}</div>
          <div className="mt-1 text-[11px] text-slate-400">Saved in your workspace</div>
        </div>

        {/* Live & Published */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Live & Published</span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900 dark:text-zinc-100">{publishedCount}</div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">Connected with website URLs</div>
        </div>

        {/* Drafts */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Draft Widgets</span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900 dark:text-zinc-100">{draftCount}</div>
          <div className="mt-1 text-[11px] text-amber-600 font-medium">Configured locally</div>
        </div>

        {/* Plan Usage */}
        <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50/50 to-white p-5 shadow-2xs dark:border-purple-900/50 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#7c3aed]">Free Plan Usage</span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-purple-100 text-[#7c3aed]">
              <Crown className="h-4 w-4 fill-[#7c3aed]" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900 dark:text-zinc-100">{usage.count}</span>
            <span className="text-xs text-slate-400">/ {usage.limit} widgets</span>
          </div>
          <div className="mt-2.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#7c3aed] transition-all"
              style={{ width: `${Math.max(4, Math.min(100, usage.percentage))}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. RECENT WIDGETS ACTIVITY */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100">Recent Widget Activity</h2>
            <p className="text-xs text-slate-500 mt-0.5">Quickly edit or copy embed codes for your configured widgets.</p>
          </div>
          {saved.length > 0 && (
            <Link to="/my-widgets" className="text-xs font-semibold text-[#7c3aed] hover:underline flex items-center gap-1">
              <span>View all ({saved.length})</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {saved.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
            <Boxes className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No widgets created yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Explore our marketplace of 18 widgets and customize your first widget in under 60 seconds.
            </p>
            <Button asChild size="sm" className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs rounded-xl">
              <Link to="/widgets">Browse All Widgets</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
            {saved.slice(0, 5).map((w) => {
              const def = WIDGETS.find((d) => d.type === w.type);
              const isPublished = Boolean(w.website);
              const dateStr = new Date(w.updatedAt || Date.now()).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div key={w.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-50 text-[#7c3aed] border border-purple-100">
                      {def ? <def.icon className="h-5 w-5" /> : <Boxes className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">{w.name}</span>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider",
                            isPublished
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600"
                          )}
                        >
                          {isPublished ? "Live" : "Draft"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                        <span>{def?.name || w.type}</span>
                        <span>•</span>
                        {w.website ? (
                          <span className="flex items-center gap-1 text-slate-600 truncate">
                            <Globe className="h-3 w-3 text-slate-400" />
                            {w.website}
                          </span>
                        ) : (
                          <span>Updated {dateStr}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button asChild variant="outline" size="sm" className="h-8 text-xs rounded-xl border-slate-200">
                      <Link to="/editor/$type" params={{ type: w.type }} search={{ id: w.id }}>
                        <Pencil className="h-3.5 w-3.5 mr-1 text-slate-500" />
                        Edit
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInstallWidget(w)}
                      className="h-8 text-xs rounded-xl border-slate-200 bg-purple-50/60 text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white"
                    >
                      <Code2 className="h-3.5 w-3.5 mr-1" />
                      Get Code
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(w.id)}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. SPOTLIGHT POPULAR WIDGETS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100">Featured Widgets</h2>
            <p className="text-xs text-slate-500 mt-0.5">Popular widgets ready to install on your website today.</p>
          </div>
          <Link to="/widgets" className="text-xs font-semibold text-[#7c3aed] hover:underline flex items-center gap-1">
            <span>Browse All 18 Widgets</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {spotlightWidgets.map((item) => (
            <div
              key={item.type}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-50 text-[#7c3aed] border border-purple-100">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-purple-50 text-[#7c3aed] px-2 py-0.5 text-[9.5px] font-bold border border-purple-200">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">{item.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{item.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">{item.designs}</span>
                <Button asChild size="sm" className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs h-7.5 rounded-lg px-2.5">
                  <Link to="/editor/$type" params={{ type: item.type }}>
                    <Plus className="h-3 w-3 mr-1 stroke-[2.5]" />
                    Add
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Install Code Modal */}
      {installWidget && (
        <InstallModal
          open={Boolean(installWidget)}
          onOpenChange={(open) => !open && setInstallWidget(null)}
          widgetType={installWidget.type}
          widgetId={installWidget.id}
          title={`Install ${installWidget.name}`}
          codeSnippet={embedCode(installWidget)}
        />
      )}
    </div>
  );
}
