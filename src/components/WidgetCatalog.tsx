import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Search,
  ExternalLink,
  Smartphone,
  Monitor,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CATEGORIES, WIDGETS, SCHEMAS, filterWidgets, type WidgetDef } from "@/lib/widgets";
import { WhatsAppIcon, WhatsAppLivePreview } from "@/components/whatsapp/WhatsAppLivePreview";
import { DEFAULT_WHATSAPP_CONFIG } from "@/lib/whatsapp/types";
import { AnnouncementLivePreview } from "@/components/announcement/AnnouncementLivePreview";
import { DEFAULT_ANNOUNCEMENT_CONFIG } from "@/lib/announcement/types";
import { PopupLivePreview } from "@/components/popup/PopupLivePreview";
import { DEFAULT_POPUP_CONFIG } from "@/lib/popup/types";
import { FaqLivePreview } from "@/components/faq/FaqLivePreview";
import { DEFAULT_FAQ_CONFIG } from "@/lib/faq/types";
import { WidgetPreview } from "@/components/WidgetPreview";
import { cn } from "@/lib/utils";

// Curated soft background styles for widget icons
const WIDGET_SOFT_ICONS: Record<string, string> = {
  "whatsapp-chat": "bg-emerald-50 text-emerald-600 border border-emerald-100/90 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40",
  "announcement-bar": "bg-purple-50 text-purple-600 border border-purple-100/90 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/40",
  popup: "bg-pink-50 text-pink-600 border border-pink-100/90 dark:bg-pink-950/40 dark:text-pink-400 dark:border-pink-900/40",
  "google-reviews": "bg-amber-50 text-amber-600 border border-amber-100/90 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40",
  "instagram-feed": "bg-rose-50 text-rose-600 border border-rose-100/90 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/40",
  "facebook-feed": "bg-blue-50 text-blue-600 border border-blue-100/90 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40",
  faq: "bg-teal-50 text-teal-600 border border-teal-100/90 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-900/40",
  countdown: "bg-orange-50 text-orange-600 border border-orange-100/90 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/40",
  testimonials: "bg-violet-50 text-violet-600 border border-violet-100/90 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-900/40",
  "contact-form": "bg-indigo-50 text-indigo-600 border border-indigo-100/90 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/40",
  "event-calendar": "bg-sky-50 text-sky-600 border border-sky-100/90 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900/40",
  "social-feed": "bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-100/90 dark:bg-fuchsia-950/40 dark:text-fuchsia-400 dark:border-fuchsia-900/40",
  "youtube-gallery": "bg-red-50 text-red-600 border border-red-100/90 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/40",
  accessibility: "bg-cyan-50 text-cyan-600 border border-cyan-100/90 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-900/40",
  "language-switcher": "bg-purple-50 text-purple-600 border border-purple-100/90 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/40",
  "store-locator": "bg-emerald-50 text-emerald-600 border border-emerald-100/90 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40",
  "custom-html": "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

export function WidgetCatalog() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [demoWidget, setDemoWidget] = useState<WidgetDef | null>(null);
  const [demoMobile, setDemoMobile] = useState(false);

  const list = filterWidgets(WIDGETS, q, cat);

  return (
    <section className="space-y-6">
      {/* ================= CATEGORY FILTERS & SEARCH TOOLBAR ================= */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left: Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((c) => {
            const isActive = cat === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-xs md:text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-[#7c3aed] text-white shadow-xs font-semibold"
                    : "bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:bg-card dark:border-border/80 dark:text-slate-300 dark:hover:bg-muted dark:hover:text-foreground"
                )}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Right: Search Field */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search widgets..."
            className="h-10 w-full pl-9 pr-4 rounded-full border-slate-200/90 bg-white text-sm shadow-2xs placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-purple-500/20 focus-visible:border-purple-500 dark:bg-card dark:border-border/80 dark:placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* ================= WIDGET CARDS GRID ================= */}
      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-12 text-center text-sm text-slate-500 dark:border-border dark:bg-card/50 dark:text-muted-foreground">
          <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
            No widgets match your search
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Try searching for "WhatsApp", "Banner", or "Popup".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-5">
          {list.map((w) => {
            const isWhatsApp = w.type === "whatsapp-chat";
            const softBg =
              WIDGET_SOFT_ICONS[w.type] ||
              "bg-purple-50 text-purple-600 border border-purple-100 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/40";
            const hasFunctionalDemo = Boolean(w.ready);

            return (
              <article
                key={w.type}
                className="group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md hover:border-purple-200 transition-all duration-200 dark:border-border/70 dark:bg-card dark:hover:border-purple-800"
              >
                {/* 1. Centered widget icon inside softly colored square */}
                <div className="flex justify-center mb-3.5">
                  <div
                    className={cn(
                      "grid h-14 w-14 place-items-center rounded-2xl transition-transform duration-200 group-hover:scale-105",
                      softBg
                    )}
                  >
                    {isWhatsApp ? (
                      <WhatsAppIcon className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <w.icon className="h-7 w-7" />
                    )}
                  </div>
                </div>

                {/* 2. Widget Name */}
                <h3 className="text-center text-base font-bold text-slate-900 tracking-tight dark:text-slate-100 line-clamp-1 mb-1">
                  {w.name}
                </h3>

                {/* 3. Short, readable description */}
                <p className="text-center text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1 mb-4 dark:text-slate-400">
                  {w.description}
                </p>

                {/* 4. Action Buttons (Create Widget + optional View Demo) */}
                <div className="mt-auto space-y-2 pt-1">
                  {w.ready ? (
                    <Button
                      asChild
                      className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium text-xs h-9 rounded-xl shadow-xs transition-colors"
                    >
                      <Link to="/editor/$type" params={{ type: w.type }}>
                        Create Widget
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      disabled
                      variant="outline"
                      className="w-full text-xs h-9 rounded-xl text-slate-400 bg-slate-50/70 border-slate-200/80 dark:bg-slate-900/40 dark:border-slate-800"
                    >
                      Coming Soon
                    </Button>
                  )}

                  {/* 5. View Demo button, only when functional demo exists */}
                  {hasFunctionalDemo && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDemoWidget(w)}
                      className="w-full text-xs h-9 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors dark:border-border dark:text-slate-300 dark:hover:bg-muted"
                    >
                      View Demo
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ================= FUNCTIONAL DEMO MODAL ================= */}
      {demoWidget && (
        <Dialog open={Boolean(demoWidget)} onOpenChange={(open) => !open && setDemoWidget(null)}>
          <DialogContent className="max-w-3xl overflow-hidden p-0 gap-0 sm:rounded-2xl border-slate-200 dark:border-border">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-border bg-slate-50/50 dark:bg-card">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-xl",
                    WIDGET_SOFT_ICONS[demoWidget.type] || "bg-purple-100 text-purple-700"
                  )}
                >
                  {demoWidget.type === "whatsapp-chat" ? (
                    <WhatsAppIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <demoWidget.icon className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {demoWidget.name} Demo
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {demoWidget.description}
                  </DialogDescription>
                </div>
              </div>

              {/* Viewport Desktop/Mobile Toggle */}
              <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 dark:border-border dark:bg-card mr-6">
                <button
                  type="button"
                  onClick={() => setDemoMobile(false)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                    !demoMobile
                      ? "bg-purple-100 text-purple-700 font-semibold dark:bg-purple-950 dark:text-purple-300"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  <Monitor className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDemoMobile(true)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                    demoMobile
                      ? "bg-purple-100 text-purple-700 font-semibold dark:bg-purple-950 dark:text-purple-300"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Mobile</span>
                </button>
              </div>
            </div>

            {/* Modal Live Interactive Preview Area */}
            <div className="relative min-h-[380px] max-h-[520px] overflow-auto bg-slate-100/70 p-6 flex items-center justify-center dark:bg-slate-950/50">
              <div
                className={cn(
                  "relative w-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft transition-all duration-300 dark:border-border dark:bg-card",
                  demoMobile ? "max-w-[360px]" : "max-w-2xl"
                )}
              >
                {demoWidget.type === "whatsapp-chat" ? (
                  <div className="relative min-h-[280px]">
                    <div className="mb-4 text-xs font-medium text-slate-500">
                      Interactive WhatsApp Floating Button & Chat Window
                    </div>
                    <WhatsAppLivePreview
                      config={DEFAULT_WHATSAPP_CONFIG}
                      viewport={demoMobile ? "mobile" : "desktop"}
                      onViewportChange={(vp) => setDemoMobile(vp === "mobile")}
                    />
                  </div>
                ) : demoWidget.type === "announcement-bar" ? (
                  <div className="space-y-4">
                    <AnnouncementLivePreview
                      config={DEFAULT_ANNOUNCEMENT_CONFIG}
                      viewport={demoMobile ? "mobile" : "desktop"}
                    />
                    <div className="text-center text-xs text-slate-400 pt-6">
                      (Top Banner preview positioned above sample site header)
                    </div>
                  </div>
                ) : demoWidget.type === "popup" ? (
                  <div className="relative min-h-[280px] flex items-center justify-center">
                    <PopupLivePreview
                      config={DEFAULT_POPUP_CONFIG}
                      updateConfig={() => {}}
                      viewport={demoMobile ? "mobile" : "desktop"}
                      onViewportChange={(vp) => setDemoMobile(vp === "mobile")}
                    />
                  </div>
                ) : demoWidget.type === "faq" ? (
                  <div className="w-full">
                    <FaqLivePreview
                      config={DEFAULT_FAQ_CONFIG}
                      viewport={demoMobile ? "mobile" : "desktop"}
                      onViewportChange={(vp) => setDemoMobile(vp === "mobile")}
                    />
                  </div>
                ) : (
                  <WidgetPreview
                    type={demoWidget.type}
                    c={SCHEMAS[demoWidget.type]?.defaults ?? {}}
                    mobile={demoMobile}
                  />
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3.5 dark:border-border bg-white dark:bg-card">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Ready to customize for your website?
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDemoWidget(null)}
                  className="text-xs text-slate-600"
                >
                  Close
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium text-xs rounded-xl shadow-xs"
                >
                  <Link to="/editor/$type" params={{ type: demoWidget.type }}>
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                    Customize in Editor
                  </Link>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
