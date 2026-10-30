import { useState, useEffect, useMemo } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Zap,
  Flame,
} from "lucide-react";
import { toast } from "sonner";
import type { CountdownConfig } from "@/lib/countdown/types";
import {
  parseCountdownTarget,
  calculateCountdownRemaining,
} from "@/lib/countdown/countdownUtils";
import { cn } from "@/lib/utils";

interface CountdownLivePreviewProps {
  config: CountdownConfig;
  viewport?: "desktop" | "tablet" | "mobile";
  onViewportChange?: (viewport: "desktop" | "tablet" | "mobile") => void;
}

export function CountdownLivePreview({
  config,
  viewport: externalViewport,
  onViewportChange,
}: CountdownLivePreviewProps) {
  const [internalViewport, setInternalViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const activeViewport = externalViewport || internalViewport;

  const handleViewportChange = (vp: "desktop" | "tablet" | "mobile") => {
    if (onViewportChange) {
      onViewportChange(vp);
    } else {
      setInternalViewport(vp);
    }
  };

  const [now, setNow] = useState(() => Date.now());

  const targetMs = useMemo(() => {
    return parseCountdownTarget(config.target, config.timezone);
  }, [config.target, config.timezone]);

  const remaining = calculateCountdownRemaining(targetMs, now);

  useEffect(() => {
    if (remaining.isExpired) return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [remaining.isExpired, targetMs]);

  const handleRefresh = () => {
    setNow(Date.now());
    toast.info("Preview refreshed");
  };

  const viewportWidthClass = {
    desktop: "max-w-4xl",
    tablet: "max-w-[680px]",
    mobile: "max-w-[360px]",
  }[activeViewport];

  const pad = (n: number) => String(n).padStart(2, "0");

  const units: { label: string; value: number }[] = [];
  if (config.showDays !== false) units.push({ label: "Days", value: remaining.days });
  if (config.showHours !== false) units.push({ label: "Hours", value: remaining.hours });
  if (config.showMinutes !== false) units.push({ label: "Minutes", value: remaining.minutes });
  if (config.showSeconds !== false) units.push({ label: "Seconds", value: remaining.seconds });

  const currentDesign = config.designId || (config.style === "Minimal" ? "minimal" : "cards");

  return (
    <div className="flex flex-col rounded-2xl border bg-card p-5 shadow-soft">
      {/* Top Header with Responsive Controls */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2 tracking-wide uppercase">
            <span>Live Preview</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-xs animate-pulse" />
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Responsive Preview Controls */}
          <div className="flex rounded-lg border bg-muted/40 p-0.5">
            {[
              { id: "desktop", label: "Desktop", icon: Monitor },
              { id: "tablet", label: "Tablet", icon: Tablet },
              { id: "mobile", label: "Mobile", icon: Smartphone },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleViewportChange(item.id as "desktop" | "tablet" | "mobile")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  activeViewport === item.id
                    ? "bg-purple-600 text-white shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label={`Preview on ${item.label}`}
                title={`Preview on ${item.label}`}
              >
                <item.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground shadow-2xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Browser Mockup Container */}
      <div className="flex justify-center overflow-hidden">
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-xl border bg-background shadow-md transition-all duration-300",
            viewportWidthClass
          )}
        >
          {/* Browser Header Bar */}
          <div className="flex items-center gap-2 border-b bg-muted/40 px-3.5 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
            <div className="mx-auto flex h-5 w-1/2 items-center justify-center rounded-md bg-background/80 px-2 text-[10px] text-muted-foreground font-mono">
              https://trendcraft.store/summer-sale
            </div>
          </div>

          {/* Website Canvas Area - Realistic Contextual Demo Store */}
          <div className="relative flex min-h-[500px] flex-col select-none bg-slate-50 dark:bg-slate-950/40">
            {/* Demo Site Navbar */}
            <div className="flex items-center justify-between border-b bg-white dark:bg-card px-5 py-3 shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-purple-600 flex items-center justify-center text-white">
                  <Zap className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold tracking-tight text-foreground">TrendCraft</span>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-muted-foreground">
                <span className="hover:text-foreground cursor-pointer">Catalog</span>
                <span className="hover:text-foreground cursor-pointer">Deals</span>
                <span className="hover:text-foreground cursor-pointer">Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg border bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Cart (2)</span>
                </button>
              </div>
            </div>

            {/* Demo Webpage Hero Section */}
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Product Headline */}
              <div className="text-center max-w-lg mx-auto space-y-1.5">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-3 py-0.5 text-[11px] font-semibold">
                  <Flame className="h-3 w-3 text-amber-500" />
                  Clearance Event · Up to 50% Off
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                  The Premium Ergonomic Collection
                </h1>
                <p className="text-xs text-muted-foreground">
                  Exclusive pricing applies automatically while promotional inventory lasts.
                </p>
              </div>

              {/* ================= ACTUAL COUNTDOWN TIMER (Rendered by Selected Design) ================= */}
              <div className="w-full flex justify-center py-2">
                {remaining.isExpired && config.expireAction === "hide" ? (
                  <div className="rounded-xl border border-dashed border-muted-foreground/30 bg-muted/20 p-4 text-center text-xs text-muted-foreground">
                    [Countdown Timer expired and hidden by configuration]
                  </div>
                ) : (
                  <div
                    className={cn(
                      "w-full transition-all duration-200 border shadow-sm",
                      config.align === "left" ? "text-left" : "text-center",
                      currentDesign === "elegant" && "font-serif border-amber-900/20"
                    )}
                    style={{
                      maxWidth: `${config.width}px`,
                      borderRadius: `${config.radius}px`,
                      padding: `${config.padding}px`,
                      backgroundColor: config.bg,
                      color: config.text,
                    }}
                  >
                    {/* Widget Headline (Except for Banner design which embeds headline inside the bar) */}
                    {currentDesign !== "banner" && config.title && config.title.trim() && (
                      <h3
                        className={cn(
                          "text-base sm:text-lg font-bold mb-4 leading-tight",
                          currentDesign === "elegant" ? "font-serif tracking-normal" : "font-sans"
                        )}
                        style={{ color: config.text }}
                      >
                        {config.title}
                      </h3>
                    )}

                    {!remaining.isValid ? (
                      <div className="rounded-lg bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 p-3 text-xs font-medium text-center">
                        Please set a valid target date and time.
                      </div>
                    ) : remaining.isExpired ? (
                      <div className="flex justify-center">
                        <div
                          className="inline-block px-5 py-3 rounded-xl font-bold text-sm sm:text-base border shadow-2xs"
                          style={{
                            color: config.accent,
                            backgroundColor: "rgba(0,0,0,0.03)",
                            borderColor: "rgba(0,0,0,0.08)",
                            borderRadius: `${Math.min(config.radius, 16)}px`,
                          }}
                        >
                          {config.expiryMessage || "This offer has ended."}
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* ================= 1. MODERN CARDS DESIGN ================= */}
                        {currentDesign === "cards" && (
                          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                            {units.map((unit, idx) => (
                              <div key={unit.label} className="flex items-center gap-2 sm:gap-3">
                                <div
                                  className="flex flex-col items-center justify-center min-w-[62px] sm:min-w-[76px] py-2.5 sm:py-3.5 px-3 rounded-xl shadow-xs"
                                  style={{
                                    backgroundColor: config.boxBg || config.accent,
                                    borderRadius: `${Math.max(8, Math.min(config.radius, 18))}px`,
                                  }}
                                >
                                  <span
                                    className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums leading-none"
                                    style={{ color: config.boxText || "#ffffff" }}
                                  >
                                    {pad(unit.value)}
                                  </span>
                                  <span
                                    className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider mt-1.5 opacity-90"
                                    style={{ color: config.boxText || "#ffffff" }}
                                  >
                                    {unit.label}
                                  </span>
                                </div>
                                {idx < units.length - 1 && (
                                  <span
                                    className="text-lg sm:text-xl font-bold opacity-40 select-none -mx-0.5"
                                    style={{ color: config.text }}
                                  >
                                    :
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* ================= 2. MINIMAL DESIGN ================= */}
                        {currentDesign === "minimal" && (
                          <div className="flex items-center justify-center gap-6 sm:gap-8 flex-wrap py-1">
                            {units.map((unit) => (
                              <div key={unit.label} className="flex flex-col items-center">
                                <span
                                  className="text-3xl sm:text-4xl font-black tracking-tight tabular-nums leading-none"
                                  style={{ color: config.accent }}
                                >
                                  {pad(unit.value)}
                                </span>
                                <span
                                  className="text-[11px] font-semibold uppercase tracking-widest mt-1 opacity-70"
                                  style={{ color: config.text }}
                                >
                                  {unit.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* ================= 3. CIRCULAR TIMER DESIGN ================= */}
                        {currentDesign === "circular" && (
                          <div className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap py-1">
                            {units.map((unit) => (
                              <div key={unit.label} className="flex flex-col items-center gap-1.5">
                                <div
                                  className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border-2 sm:border-[3px] shadow-2xs"
                                  style={{
                                    borderColor: config.accent,
                                    backgroundColor: config.boxBg || "#eff6ff",
                                  }}
                                >
                                  <span
                                    className="text-lg sm:text-2xl font-black tabular-nums leading-none"
                                    style={{ color: config.boxText || config.accent }}
                                  >
                                    {pad(unit.value)}
                                  </span>
                                </div>
                                <span
                                  className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider"
                                  style={{ color: config.text }}
                                >
                                  {unit.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* ================= 4. FLIP CLOCK DESIGN ================= */}
                        {currentDesign === "flip" && (
                          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap py-1">
                            {units.map((unit, idx) => (
                              <div key={unit.label} className="flex items-center gap-2">
                                <div className="flex flex-col items-center">
                                  <div
                                    className="relative flex flex-col items-center justify-center min-w-[62px] sm:min-w-[76px] h-14 sm:h-16 rounded-lg border border-zinc-700/80 shadow-md overflow-hidden"
                                    style={{ backgroundColor: config.boxBg || "#27272a" }}
                                  >
                                    {/* Horizontal flip crease divider */}
                                    <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/60 shadow-xs z-10" />
                                    {/* Top reflection shade */}
                                    <div className="absolute inset-x-0 top-0 h-1/2 bg-white/5 pointer-events-none" />
                                    <span
                                      className="text-2xl sm:text-3xl font-mono font-black tabular-nums tracking-wider"
                                      style={{ color: config.boxText || config.accent || "#ffffff" }}
                                    >
                                      {pad(unit.value)}
                                    </span>
                                  </div>
                                  <span
                                    className="text-[10px] font-mono uppercase tracking-wider mt-1.5 opacity-80"
                                    style={{ color: config.text }}
                                  >
                                    {unit.label}
                                  </span>
                                </div>
                                {idx < units.length - 1 && (
                                  <div className="flex flex-col gap-1.5 -mx-0.5 opacity-60">
                                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: config.accent }} />
                                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: config.accent }} />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* ================= 5. BANNER DESIGN ================= */}
                        {currentDesign === "banner" && (
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                            {/* Headline & Badge */}
                            <div className="flex items-center gap-2.5 text-left truncate">
                              <span
                                className="rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-wider shrink-0"
                                style={{
                                  backgroundColor: config.accent,
                                  color: config.bg,
                                }}
                              >
                                {config.bannerBadge || "SPECIAL DEAL"}
                              </span>
                              <span className="text-sm font-bold tracking-tight truncate">
                                {config.title || "Limited Time Offer"}
                              </span>
                            </div>

                            {/* Inline Timer Pills */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              {units.map((unit) => (
                                <div
                                  key={unit.label}
                                  className="flex items-center gap-1 rounded-md px-2 py-1"
                                  style={{
                                    backgroundColor: config.boxBg || "rgba(255,255,255,0.1)",
                                  }}
                                >
                                  <span
                                    className="font-mono font-bold text-sm leading-none"
                                    style={{ color: config.boxText || config.accent }}
                                  >
                                    {pad(unit.value)}
                                  </span>
                                  <span
                                    className="text-[9px] uppercase font-semibold opacity-70"
                                    style={{ color: config.text }}
                                  >
                                    {unit.label[0]}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* CTA Button */}
                            <button
                              type="button"
                              onClick={() => toast.success("CTA Clicked in Demo Mode!")}
                              className="rounded-lg px-4 py-2 text-xs font-bold transition-transform hover:scale-[1.02] shrink-0 shadow-xs"
                              style={{
                                backgroundColor: config.accent,
                                color: config.bg,
                              }}
                            >
                              {config.bannerCtaText || "Claim Offer"}
                            </button>
                          </div>
                        )}

                        {/* ================= 6. ELEGANT DESIGN ================= */}
                        {currentDesign === "elegant" && (
                          <div className="flex items-center justify-center gap-5 sm:gap-8 flex-wrap py-2 border-y border-stone-300 dark:border-stone-800">
                            {units.map((unit, idx) => (
                              <div key={unit.label} className="flex items-center gap-5 sm:gap-8">
                                <div className="flex flex-col items-center">
                                  <span
                                    className="text-2xl sm:text-4xl font-serif font-normal tracking-wide tabular-nums leading-none"
                                    style={{ color: config.accent }}
                                  >
                                    {pad(unit.value)}
                                  </span>
                                  <span
                                    className="text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.2em] mt-1.5 opacity-70"
                                    style={{ color: config.text }}
                                  >
                                    {unit.label}
                                  </span>
                                </div>
                                {idx < units.length - 1 && (
                                  <span className="text-stone-300 dark:text-stone-700 font-serif text-xl -mx-2">
                                    /
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Demo Store CTA Card */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border bg-white dark:bg-card p-4 shadow-2xs max-w-lg mx-auto">
                <div className="flex items-center gap-3 text-left">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
                    %
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">Tier 1 Bundle Discount</div>
                    <div className="text-[11px] text-muted-foreground">Free express shipping included</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toast.success("CTA Clicked in Demo Mode!")}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-purple-700 transition-colors"
                >
                  Shop Now
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Demo Trust Badges */}
              <div className="flex items-center justify-center gap-6 text-[11px] text-muted-foreground pt-2">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  30-Day Money Back
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  2-Year Warranty
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
