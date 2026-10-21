import { useState, useEffect } from "react";
import {
  X,
  RotateCcw,
  Megaphone,
  Gift,
  Info,
  Check,
  Flame,
  Tag,
  Clock,
  Star,
  Bell,
  ExternalLink,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import type { AnnouncementBarConfig, AnnouncementIcon } from "@/lib/announcement/types";
import { calculateTimeRemaining, type CountdownTimeRemaining } from "@/lib/announcement/validation";
import { cn } from "@/lib/utils";

interface AnnouncementLivePreviewProps {
  config: AnnouncementBarConfig;
  viewport?: "desktop" | "tablet" | "mobile";
  onViewportChange?: (viewport: "desktop" | "tablet" | "mobile") => void;
}

export function AnnouncementLivePreview({
  config,
  viewport: externalViewport,
  onViewportChange,
}: AnnouncementLivePreviewProps) {
  const [internalViewport, setInternalViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const activeViewport = externalViewport || internalViewport;

  const handleViewportChange = (vp: "desktop" | "tablet" | "mobile") => {
    if (onViewportChange) {
      onViewportChange(vp);
    } else {
      setInternalViewport(vp);
    }
  };

  const [isDismissed, setIsDismissed] = useState(false);
  const [countdown, setCountdown] = useState<CountdownTimeRemaining>(() =>
    calculateTimeRemaining(config.countdownTarget)
  );

  // Reset dismissal state when config updates
  useEffect(() => {
    setIsDismissed(false);
  }, [config.templateId, config.position, config.bgColor]);

  // Live countdown timer with clean interval unmount
  useEffect(() => {
    if (!config.hasCountdown) return;

    setCountdown(calculateTimeRemaining(config.countdownTarget));
    const interval = setInterval(() => {
      setCountdown(calculateTimeRemaining(config.countdownTarget));
    }, 1000);

    return () => clearInterval(interval);
  }, [config.hasCountdown, config.countdownTarget]);

  const handleRefresh = () => {
    setIsDismissed(false);
    setCountdown(calculateTimeRemaining(config.countdownTarget));
    toast.info("Preview refreshed");
  };

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const dest = config.buttonLink || config.linkUrl || "#";
    toast.success("Preview Mode: CTA Clicked", {
      description: `In live site, this opens ${dest}`,
      duration: 3000,
    });
  };

  const renderIcon = (icon: AnnouncementIcon) => {
    const iconClass = "h-4 w-4 shrink-0";
    switch (icon) {
      case "gift":
        return <Gift className={iconClass} />;
      case "info":
        return <Info className={iconClass} />;
      case "check":
        return <Check className={iconClass} />;
      case "flame":
        return <Flame className={iconClass} />;
      case "tag":
        return <Tag className={iconClass} />;
      case "clock":
        return <Clock className={iconClass} />;
      case "star":
        return <Star className={iconClass} />;
      case "bell":
        return <Bell className={iconClass} />;
      case "none":
        return null;
      case "megaphone":
      default:
        return <Megaphone className={iconClass} />;
    }
  };

  const viewportWidthClass = {
    desktop: "max-w-4xl",
    tablet: "max-w-[680px]",
    mobile: "max-w-[360px]",
  }[activeViewport];

  const isBottom = config.position === "bottom";

  return (
    <div className="flex flex-col rounded-2xl border bg-card p-5 shadow-soft">
      {/* Header with Responsive Preview Controls */}
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
                    ? "bg-amber-400 text-amber-950 shadow-xs font-bold"
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
            <span className="hidden sm:inline">Refresh Preview</span>
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
              https://apexacademy.com
            </div>
          </div>

          {/* Website Canvas Area */}
          <div className="relative flex min-h-[380px] flex-col select-none bg-stone-100">
            {/* ================= ANNOUNCEMENT BAR (TOP POSITION) ================= */}
            {!isBottom && !isDismissed && (
              <div
                className={cn(
                  "relative z-20 flex w-full flex-wrap items-center justify-center gap-3 px-4 shadow-xs transition-all duration-300",
                  config.animateSlideDown && "animate-in slide-in-from-top-2 duration-300"
                )}
                style={{
                  background: config.bgColor,
                  color: config.textColor,
                  fontSize: config.fontSize,
                  fontWeight: config.fontWeight === "bold" ? 700 : config.fontWeight === "semibold" ? 600 : 500,
                  paddingTop: `${config.padding}px`,
                  paddingBottom: `${config.padding}px`,
                  textAlign: config.textAlign,
                }}
              >
                <div className="flex items-center justify-center gap-2 max-w-[calc(100%-40px)] flex-wrap">
                  {renderIcon(config.icon)}
                  {config.headline && (
                    <strong className="font-bold mr-1">{config.headline}</strong>
                  )}
                  <span>{config.text}</span>
                  {config.secondaryText && (
                    <span className="opacity-80 text-xs ml-1 block sm:inline">
                      {config.secondaryText}
                    </span>
                  )}
                </div>

                {/* Inline link */}
                {config.hasLink && config.linkText && (
                  <a
                    href="#"
                    onClick={handleCtaClick}
                    className="underline hover:opacity-85 text-xs font-semibold shrink-0"
                    style={{ color: config.textColor }}
                  >
                    {config.linkText}
                  </a>
                )}

                {/* Countdown Timer Display */}
                {config.hasCountdown && (
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold shrink-0">
                    {countdown.isExpired ? (
                      <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-200">
                        {config.countdownExpireMessage || "Expired"}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className="rounded bg-black/30 px-1.5 py-0.5">
                          {String(countdown.days).padStart(2, "0")}d
                        </span>
                        <span className="rounded bg-black/30 px-1.5 py-0.5">
                          {String(countdown.hours).padStart(2, "0")}h
                        </span>
                        <span className="rounded bg-black/30 px-1.5 py-0.5">
                          {String(countdown.minutes).padStart(2, "0")}m
                        </span>
                        <span className="rounded bg-black/30 px-1.5 py-0.5">
                          {String(countdown.seconds).padStart(2, "0")}s
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* CTA Button */}
                {config.hasButton && config.buttonText && (
                  <button
                    type="button"
                    onClick={handleCtaClick}
                    className="rounded-lg px-3 py-1 text-xs font-bold shadow-xs transition-transform hover:opacity-95 active:scale-95 shrink-0"
                    style={{
                      backgroundColor: config.buttonBgColor,
                      color: config.buttonTextColor,
                    }}
                  >
                    {config.buttonText}
                  </button>
                )}

                {/* Close Button */}
                {config.showCloseButton && (
                  <button
                    type="button"
                    onClick={() => setIsDismissed(true)}
                    aria-label="Dismiss announcement"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 hover:bg-black/10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            {/* If dismissed, show recovery bar in preview */}
            {isDismissed && (
              <div className="flex items-center justify-center bg-muted/60 p-1 text-[11px] text-muted-foreground">
                <span>Announcement bar dismissed. </span>
                <button
                  type="button"
                  onClick={() => setIsDismissed(false)}
                  className="ml-1 text-primary underline font-medium hover:text-primary/80"
                >
                  Show bar again
                </button>
              </div>
            )}

            {/* Sample Website Header with generic dummy branding */}
            <header className="flex items-center justify-between border-b bg-white px-5 py-3 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-400 font-bold text-slate-900 text-sm">
                  A
                </span>
                <div>
                  <span className="text-xs font-black tracking-wider text-slate-900 block leading-tight">
                    APEX
                  </span>
                  <span className="text-[9px] tracking-widest text-slate-500 uppercase block font-semibold">
                    ACADEMY
                  </span>
                </div>
              </div>

              <nav className="hidden items-center gap-5 text-xs font-medium text-slate-600 md:flex">
                <span className="cursor-pointer hover:text-slate-900">Home</span>
                <span className="cursor-pointer hover:text-slate-900">About</span>
                <span className="cursor-pointer hover:text-slate-900">Courses</span>
                <span className="cursor-pointer hover:text-slate-900">Campuses</span>
                <span className="cursor-pointer hover:text-slate-900">FAQ</span>
                <span className="cursor-pointer hover:text-slate-900">Contact</span>
              </nav>

              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-black text-slate-900 shadow-xs"
              >
                STUDENT PORTAL
              </button>
            </header>

            {/* Sample Website Hero */}
            <div className="relative flex-1 overflow-hidden bg-cover bg-center py-12 px-6 text-center text-white"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80')",
              }}
            >
              <div className="mx-auto max-w-xl space-y-2">
                <h1 className="text-2xl font-serif font-black tracking-tight drop-shadow-md sm:text-3xl">
                  Modern Skills Academy
                </h1>
                <p className="text-xs font-medium tracking-wide text-amber-200 drop-shadow-xs sm:text-sm">
                  Empowering professional learning and careers for over 25 years
                </p>
              </div>
            </div>

            {/* ================= ANNOUNCEMENT BAR (BOTTOM POSITION) ================= */}
            {isBottom && !isDismissed && (
              <div
                className={cn(
                  "relative z-20 flex w-full flex-wrap items-center justify-center gap-3 px-4 shadow-md transition-all duration-300",
                  config.animateSlideDown && "animate-in slide-in-from-bottom-2 duration-300"
                )}
                style={{
                  background: config.bgColor,
                  color: config.textColor,
                  fontSize: config.fontSize,
                  fontWeight: config.fontWeight === "bold" ? 700 : config.fontWeight === "semibold" ? 600 : 500,
                  paddingTop: `${config.padding}px`,
                  paddingBottom: `${config.padding}px`,
                  textAlign: config.textAlign,
                }}
              >
                <div className="flex items-center justify-center gap-2 max-w-[calc(100%-40px)] flex-wrap">
                  {renderIcon(config.icon)}
                  {config.headline && (
                    <strong className="font-bold mr-1">{config.headline}</strong>
                  )}
                  <span>{config.text}</span>
                </div>

                {config.hasButton && config.buttonText && (
                  <button
                    type="button"
                    onClick={handleCtaClick}
                    className="rounded-lg px-3 py-1 text-xs font-bold shadow-xs transition-transform hover:opacity-95 active:scale-95 shrink-0"
                    style={{
                      backgroundColor: config.buttonBgColor,
                      color: config.buttonTextColor,
                    }}
                  >
                    {config.buttonText}
                  </button>
                )}

                {config.showCloseButton && (
                  <button
                    type="button"
                    onClick={() => setIsDismissed(true)}
                    aria-label="Dismiss announcement"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 hover:bg-black/10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
