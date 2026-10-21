import { Link } from "@tanstack/react-router";
import { Search, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CATEGORIES, WIDGETS, filterWidgets, type WidgetDef } from "@/lib/widgets";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppLivePreview";
import { cn } from "@/lib/utils";

interface WidgetTheme {
  bgGradient: string;
  iconBg: string;
  borderHover: string;
  shadowHover: string;
  categoryTag: string;
}

const WIDGET_THEMES: Record<string, WidgetTheme> = {
  "google-reviews": {
    bgGradient: "bg-gradient-to-tr from-amber-500/15 via-yellow-500/10 to-orange-500/15 border-amber-500/20",
    iconBg: "bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-500 text-white shadow-lg shadow-amber-500/30",
    borderHover: "hover:border-amber-400/60",
    shadowHover: "hover:shadow-amber-500/15",
    categoryTag: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  "instagram-feed": {
    bgGradient: "bg-gradient-to-tr from-[#833AB4]/20 via-[#FD1D1D]/15 to-[#FCB045]/20 border-pink-500/20",
    iconBg: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-lg shadow-pink-500/30",
    borderHover: "hover:border-pink-400/60",
    shadowHover: "hover:shadow-pink-500/15",
    categoryTag: "bg-pink-500/10 text-pink-700 dark:text-pink-300",
  },
  "facebook-feed": {
    bgGradient: "bg-gradient-to-tr from-[#1877F2]/20 via-[#0D65D9]/15 to-[#05469C]/20 border-blue-500/20",
    iconBg: "bg-gradient-to-tr from-[#1877F2] to-[#0D65D9] text-white shadow-lg shadow-blue-500/30",
    borderHover: "hover:border-blue-400/60",
    shadowHover: "hover:shadow-blue-500/15",
    categoryTag: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  },
  "whatsapp-chat": {
    bgGradient: "bg-gradient-to-tr from-[#25D366]/20 via-[#128C7E]/15 to-[#075E54]/20 border-emerald-500/20",
    iconBg: "bg-gradient-to-tr from-[#25D366] via-[#1fad53] to-[#128C7E] text-white shadow-lg shadow-emerald-500/30",
    borderHover: "hover:border-emerald-400/60",
    shadowHover: "hover:shadow-emerald-500/15",
    categoryTag: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  faq: {
    bgGradient: "bg-gradient-to-tr from-teal-500/20 via-emerald-500/15 to-cyan-500/20 border-teal-500/20",
    iconBg: "bg-gradient-to-tr from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/30",
    borderHover: "hover:border-teal-400/60",
    shadowHover: "hover:shadow-teal-500/15",
    categoryTag: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
  },
  countdown: {
    bgGradient: "bg-gradient-to-tr from-orange-500/20 via-amber-500/15 to-red-500/20 border-orange-500/20",
    iconBg: "bg-gradient-to-tr from-orange-500 via-amber-500 to-red-500 text-white shadow-lg shadow-orange-500/30",
    borderHover: "hover:border-orange-400/60",
    shadowHover: "hover:shadow-orange-500/15",
    categoryTag: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  },
  testimonials: {
    bgGradient: "bg-gradient-to-tr from-rose-500/20 via-pink-500/15 to-orange-500/20 border-rose-500/20",
    iconBg: "bg-gradient-to-tr from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30",
    borderHover: "hover:border-rose-400/60",
    shadowHover: "hover:shadow-rose-500/15",
    categoryTag: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  },
  "contact-form": {
    bgGradient: "bg-gradient-to-tr from-blue-600/20 via-indigo-500/15 to-sky-500/20 border-indigo-500/20",
    iconBg: "bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30",
    borderHover: "hover:border-indigo-400/60",
    shadowHover: "hover:shadow-indigo-500/15",
    categoryTag: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  },
  popup: {
    bgGradient: "bg-gradient-to-tr from-fuchsia-500/20 via-purple-500/15 to-pink-500/20 border-fuchsia-500/20",
    iconBg: "bg-gradient-to-tr from-fuchsia-600 via-pink-600 to-purple-600 text-white shadow-lg shadow-fuchsia-500/30",
    borderHover: "hover:border-fuchsia-400/60",
    shadowHover: "hover:shadow-fuchsia-500/15",
    categoryTag: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
  },
  "event-calendar": {
    bgGradient: "bg-gradient-to-tr from-sky-500/20 via-blue-500/15 to-indigo-500/20 border-sky-500/20",
    iconBg: "bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30",
    borderHover: "hover:border-sky-400/60",
    shadowHover: "hover:shadow-sky-500/15",
    categoryTag: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  },
  "social-feed": {
    bgGradient: "bg-gradient-to-tr from-purple-500/20 via-pink-500/15 to-orange-500/20 border-purple-500/20",
    iconBg: "bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 text-white shadow-lg shadow-purple-500/30",
    borderHover: "hover:border-purple-400/60",
    shadowHover: "hover:shadow-purple-500/15",
    categoryTag: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  },
  "youtube-gallery": {
    bgGradient: "bg-gradient-to-tr from-red-600/20 via-rose-500/15 to-red-700/20 border-red-500/20",
    iconBg: "bg-gradient-to-tr from-red-600 via-red-600 to-rose-700 text-white shadow-lg shadow-red-500/30",
    borderHover: "hover:border-red-400/60",
    shadowHover: "hover:shadow-red-500/15",
    categoryTag: "bg-red-500/10 text-red-700 dark:text-red-300",
  },
  accessibility: {
    bgGradient: "bg-gradient-to-tr from-cyan-500/20 via-teal-500/15 to-blue-500/20 border-cyan-500/20",
    iconBg: "bg-gradient-to-tr from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/30",
    borderHover: "hover:border-cyan-400/60",
    shadowHover: "hover:shadow-cyan-500/15",
    categoryTag: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  },
  "language-switcher": {
    bgGradient: "bg-gradient-to-tr from-violet-500/20 via-purple-500/15 to-indigo-500/20 border-violet-500/20",
    iconBg: "bg-gradient-to-tr from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30",
    borderHover: "hover:border-violet-400/60",
    shadowHover: "hover:shadow-violet-500/15",
    categoryTag: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  },
  "store-locator": {
    bgGradient: "bg-gradient-to-tr from-emerald-500/20 via-green-500/15 to-teal-500/20 border-emerald-500/20",
    iconBg: "bg-gradient-to-tr from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-500/30",
    borderHover: "hover:border-emerald-400/60",
    shadowHover: "hover:shadow-emerald-500/15",
    categoryTag: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  "announcement-bar": {
    bgGradient: "bg-gradient-to-tr from-purple-600/20 via-violet-500/20 to-indigo-600/20 border-purple-500/20",
    iconBg: "bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30",
    borderHover: "hover:border-purple-400/60",
    shadowHover: "hover:shadow-purple-500/15",
    categoryTag: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  },
  "custom-html": {
    bgGradient: "bg-gradient-to-tr from-slate-900/40 via-purple-950/30 to-slate-900/40 border-emerald-500/30",
    iconBg: "bg-gradient-to-tr from-slate-900 to-zinc-800 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/20",
    borderHover: "hover:border-emerald-400/60",
    shadowHover: "hover:shadow-emerald-500/15",
    categoryTag: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
};

export function WidgetCatalog() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const list = filterWidgets(WIDGETS, q, cat);

  const renderCardVisual = (w: WidgetDef, theme: WidgetTheme) => {
    const isWhatsApp = w.type === "whatsapp-chat";
    const isGoogle = w.type === "google-reviews";
    const isCountdown = w.type === "countdown";
    const isAnnouncement = w.type === "announcement-bar";
    const isPopup = w.type === "popup";

    return (
      <div
        className={cn(
          "relative mb-4 flex h-32 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border p-4 transition-all duration-300 group-hover:scale-[1.01]",
          theme.bgGradient
        )}
      >
        {/* Subtle decorative background shine */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/30 via-transparent to-transparent opacity-60 dark:from-white/10" />

        {/* Central Icon in colorful badge */}
        <div
          className={cn(
            "relative z-10 grid h-14 w-14 place-items-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-1",
            theme.iconBg
          )}
        >
          {isWhatsApp ? (
            <WhatsAppIcon className="h-7 w-7 text-white" />
          ) : (
            <w.icon className="h-7 w-7" />
          )}
        </div>

        {/* Decorative mini element per widget type */}
        {isGoogle && (
          <div className="absolute bottom-2 flex items-center gap-0.5 rounded-full bg-white/90 dark:bg-card/90 px-2 py-0.5 text-[10px] font-bold text-amber-600 shadow-2xs backdrop-blur-xs">
            <span className="flex text-amber-500">★★★★★</span>
            <span className="ml-1 text-slate-700 dark:text-slate-200">4.9/5</span>
          </div>
        )}

        {isCountdown && (
          <div className="absolute bottom-2 rounded-full bg-white/90 dark:bg-card/90 px-2.5 py-0.5 font-mono text-[10px] font-bold text-orange-600 shadow-2xs backdrop-blur-xs">
            04d : 12h : 30m
          </div>
        )}

        {isAnnouncement && (
          <div className="absolute bottom-2 flex items-center gap-1 rounded-full bg-white/90 dark:bg-card/90 px-2.5 py-0.5 text-[10px] font-semibold text-purple-700 dark:text-purple-300 shadow-2xs backdrop-blur-xs">
            <Sparkles className="h-2.5 w-2.5 text-purple-500" />
            <span>Top Banner</span>
          </div>
        )}

        {isWhatsApp && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Chat</span>
          </div>
        )}

        {isPopup && (
          <div className="absolute bottom-2 flex items-center gap-1 rounded-full bg-white/90 dark:bg-card/90 px-2.5 py-0.5 text-[10px] font-semibold text-fuchsia-700 dark:text-fuchsia-300 shadow-2xs backdrop-blur-xs">
            <Sparkles className="h-2.5 w-2.5 text-fuchsia-500" />
            <span>10 Styles</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <section>
      {/* Search & Counter Bar */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search widgets (e.g. WhatsApp, Reviews)..."
            className="h-10 pl-10 rounded-xl bg-card/80 border-border/80 shadow-2xs focus-visible:ring-purple-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 border border-purple-500/20">
            {list.length} widget{list.length === 1 ? "" : "s"} available
          </span>
        </div>
      </div>

      {/* Colorful Category Filter Pills */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((c) => {
          const isActive = cat === c;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 shadow-2xs",
                isActive
                  ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white shadow-md shadow-purple-500/25 scale-[1.02]"
                  : "bg-card/90 text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border/70 hover:border-purple-300 dark:hover:border-purple-800"
              )}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Widget Grid */}
      {list.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/50 p-12 text-center text-sm text-muted-foreground shadow-2xs">
          <p className="font-semibold text-foreground text-base mb-1">No widgets match your search</p>
          <p className="text-xs">Try searching for "chat", "reviews", or "announcement".</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
          {list.map((w) => {
            const theme = WIDGET_THEMES[w.type] || {
              bgGradient: "bg-gradient-to-tr from-purple-500/15 via-indigo-500/10 to-transparent border-purple-500/20",
              iconBg: "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white",
              borderHover: "hover:border-purple-400/60",
              shadowHover: "hover:shadow-purple-500/15",
              categoryTag: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
            };

            return (
              <article
                key={w.type}
                className={cn(
                  "group relative flex flex-col rounded-3xl border border-border/75 bg-card/90 p-5 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl backdrop-blur-xs",
                  theme.borderHover,
                  theme.shadowHover
                )}
              >
                {/* Visual Top Preview Area */}
                {renderCardVisual(w, theme)}

                {/* Title & Status */}
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <h3 className="font-bold text-foreground text-base tracking-tight leading-snug group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                    {w.name}
                  </h3>
                  {w.ready ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shrink-0">
                      Coming Soon
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mb-5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {w.description}
                </p>

                {/* Footer with Category Tag & Action Button */}
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/60">
                  <span
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-[11px] font-semibold tracking-wide",
                      theme.categoryTag
                    )}
                  >
                    {w.category} · {w.kind === "floating" ? "Floating" : "Page"}
                  </span>

                  {w.ready ? (
                    <Button
                      asChild
                      size="sm"
                      className="h-8 rounded-xl px-4 font-semibold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 text-white shadow-xs hover:shadow-md hover:shadow-purple-500/25 transition-all active:scale-95"
                    >
                      <Link to="/editor/$type" params={{ type: w.type }}>
                        Create
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled
                      className="h-8 rounded-xl px-3.5 text-xs opacity-60"
                    >
                      Soon
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
