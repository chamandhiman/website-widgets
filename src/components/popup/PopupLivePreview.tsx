import { useState, useEffect, type FC } from "react";
import {
  RotateCw,
  Monitor,
  Tablet,
  Smartphone,
  X,
  ExternalLink,
  Check,
  Play,
  Copy,
  Gift,
  Mail,
  Sparkles,
  Tag,
  Bell,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import type {
  PopupWidgetConfig,
  PopupPosition,
  PopupSize,
  OverlayStyle,
} from "@/lib/popup/types";
import { parseVideoUrl } from "@/lib/popup/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface PopupLivePreviewProps {
  config: PopupWidgetConfig;
  updateConfig?: <K extends keyof PopupWidgetConfig>(
    key: K,
    value: PopupWidgetConfig[K]
  ) => void;
  viewport: "desktop" | "tablet" | "mobile";
  onViewportChange: (vp: "desktop" | "tablet" | "mobile") => void;
  resetTriggerKey?: number;
}

export const PopupLivePreview: FC<PopupLivePreviewProps> = ({
  config,
  updateConfig,
  viewport,
  onViewportChange,
  resetTriggerKey = 0,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [ageDeclined, setAgeDeclined] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Re-open and replay animation whenever template, resetTriggerKey, or refresh is clicked
  useEffect(() => {
    setIsOpen(true);
    setAnimating(true);
    setNewsletterSubmitted(false);
    setAgeDeclined(false);
    const timer = setTimeout(() => setAnimating(false), config.animationDuration + 50);
    return () => clearTimeout(timer);
  }, [config.templateId, resetTriggerKey, config.entryAnimation]);

  const handleRefresh = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsOpen(true);
      setAnimating(true);
      setNewsletterSubmitted(false);
      setAgeDeclined(false);
      setTimeout(() => setAnimating(false), config.animationDuration + 50);
    }, 100);
    toast.info("Preview refreshed");
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOverlayClick = () => {
    if (config.closeOnOverlayClick) {
      handleClose();
    }
  };

  const handleCopyCoupon = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    toast.success(`Coupon code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Sizing dimensions
  const getModalDimensions = () => {
    if (viewport === "mobile") {
      return "w-[94%] max-w-[360px]";
    }
    if (config.templateId === "slide-in" || config.position === "bottom-right" || config.position === "bottom-left") {
      return "w-[380px] max-w-[90%]";
    }
    if (config.templateId === "split") {
      return "w-[660px] max-w-[94%]";
    }
    switch (config.size) {
      case "small":
        return "w-[420px] max-w-[90%]";
      case "large":
        return "w-[640px] max-w-[94%]";
      case "medium":
      default:
        return "w-[520px] max-w-[92%]";
    }
  };

  // Position alignment classes inside preview container
  const getPositionClasses = () => {
    if (config.templateId === "slide-in" && config.position === "center") {
      return "items-end justify-end p-6";
    }
    switch (config.position) {
      case "top":
        return "items-start justify-center pt-8";
      case "bottom":
        return "items-end justify-center pb-8";
      case "left":
        return "items-center justify-start pl-8";
      case "right":
        return "items-center justify-end pr-8";
      case "bottom-right":
        return "items-end justify-end p-6";
      case "bottom-left":
        return "items-end justify-start p-6";
      case "center":
      default:
        return "items-center justify-center p-4";
    }
  };

  // Entrance animation class
  const getAnimationClass = () => {
    if (!animating) return "";
    switch (config.entryAnimation) {
      case "fade":
        return "animate-in fade-in duration-300";
      case "zoom":
        return "animate-in zoom-in-90 fade-in duration-300";
      case "slide-up":
        return "animate-in slide-in-from-bottom-6 fade-in duration-300";
      case "slide-down":
        return "animate-in slide-in-from-top-6 fade-in duration-300";
      case "bounce":
        return "animate-bounce duration-500";
      default:
        return "animate-in zoom-in-95 duration-200";
    }
  };

  // Overlay Backdrop Classes
  const getOverlayClass = () => {
    if (config.templateId === "slide-in" || config.overlayStyle === "none") {
      return "bg-transparent pointer-events-none [&>*]:pointer-events-auto";
    }
    switch (config.overlayStyle) {
      case "light":
        return "bg-black/25 backdrop-blur-2xs";
      case "blur":
        return "bg-slate-950/40 backdrop-blur-md";
      case "dark":
      default:
        return "bg-black/60 backdrop-blur-xs";
    }
  };

  const effectiveTemplate = config.templateId || "classic";

  return (
    <div className="flex flex-col gap-3">
      {/* 1. TOP CONTROLS BAR: Title, Device Switchers, Refresh */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border bg-card p-3 shadow-soft">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-foreground">Live Preview</span>
          <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-purple-600 dark:text-purple-400 capitalize">
            {config.templateId || "classic"} Layout
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Viewport controls */}
          <div className="flex items-center rounded-xl border border-border/80 bg-muted/30 p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => onViewportChange("desktop")}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition",
                viewport === "desktop"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "hover:text-foreground"
              )}
              title="Desktop View (100%)"
              aria-label="Desktop preview"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onViewportChange("tablet")}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition",
                viewport === "tablet"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "hover:text-foreground"
              )}
              title="Tablet View (768px)"
              aria-label="Tablet preview"
            >
              <Tablet className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onViewportChange("mobile")}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition",
                viewport === "mobile"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "hover:text-foreground"
              )}
              title="Mobile View (375px)"
              aria-label="Mobile preview"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Refresh button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-8 text-xs font-semibold rounded-xl border-border/80 shadow-2xs"
          >
            <RotateCw className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            Refresh Preview
          </Button>
        </div>
      </div>

      {/* 2. LIVE SIMULATION CANVAS FRAME */}
      <div className="relative flex justify-center w-full rounded-2xl border bg-muted/15 p-2 sm:p-4 min-h-[560px]">
        <div
          className={cn(
            "relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl transition-all duration-300 w-full min-h-[540px]",
            viewport === "mobile" && "max-w-[375px]",
            viewport === "tablet" && "max-w-[768px]"
          )}
        >
          {/* Simulated Browser Bar */}
          <div className="flex items-center gap-2 border-b border-border/80 bg-muted/40 px-3.5 py-2 select-none">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
            </div>
            <div className="mx-auto flex h-5 w-44 items-center justify-center rounded-md bg-background/80 px-2 text-[10px] text-muted-foreground font-mono">
              example.com
            </div>
          </div>

          {/* Simulated Website Canvas */}
          <div className="relative flex-1 overflow-hidden bg-slate-900 text-white select-none">
            {/* Website Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 px-6 py-3.5 backdrop-blur-xs bg-slate-950/40">
              <span className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                Your Website
              </span>
              <div className="hidden sm:flex items-center gap-4 text-xs text-slate-300">
                <span>Home</span>
                <span>Products</span>
                <span>Pricing</span>
                <span>Blog</span>
              </div>
              <button
                type="button"
                className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs"
              >
                Sign In
              </button>
            </div>

            {/* Simulated Hero Section */}
            <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16 text-center max-w-xl mx-auto">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Build Amazing Websites
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                Engage visitors with high-converting popups, announcement banners, and floating widgets.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md">
                  Explore Features
                </span>
              </div>
            </div>

            {/* Simulated Background Atmosphere */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-[1px]"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80')",
              }}
            />

            {/* POPUP OVERLAY & MODAL */}
            {isOpen ? (
              <div
                className={cn(
                  "absolute inset-0 z-40 flex overflow-y-auto transition-opacity duration-200",
                  getOverlayClass(),
                  getPositionClasses()
                )}
                onClick={handleOverlayClick}
              >
                {/* ───────────────────────────────────────────────────────── */}
                {/* 1. SPLIT IMAGE & CONTENT LAYOUT */}
                {/* ───────────────────────────────────────────────────────── */}
                {effectiveTemplate === "split" ? (
                  <div
                    className={cn(
                      "relative flex flex-col sm:flex-row overflow-hidden text-left shadow-2xl transition-all",
                      getModalDimensions(),
                      getAnimationClass(),
                      config.customClass
                    )}
                    style={{
                      backgroundColor: config.bgColor,
                      color: config.textColor,
                      borderRadius: `${config.borderRadius}px`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close Button */}
                    {config.showCloseButton && (
                      <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Close popup"
                        className="absolute top-3 right-3 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-foreground transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}

                    {/* Image Side */}
                    <div className="relative w-full sm:w-[45%] min-h-[160px] sm:min-h-full bg-muted/40">
                      {config.imageUrl ? (
                        <img
                          src={config.imageUrl}
                          alt={config.imageAlt || config.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 text-3xl">
                          💎
                        </div>
                      )}
                    </div>

                    {/* Content Side */}
                    <div
                      className="flex-1 flex flex-col justify-center"
                      style={{ padding: `${config.padding}px` }}
                    >
                      {config.discountBadge && (
                        <span className="self-start mb-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                          {config.discountBadge}
                        </span>
                      )}

                      <h3
                        className="text-lg font-bold leading-snug tracking-tight"
                        style={{ color: config.textColor }}
                      >
                        {config.title}
                      </h3>

                      {config.description && (
                        <p
                          className="mt-2 text-xs opacity-90 leading-relaxed"
                          style={{ color: config.textColor }}
                        >
                          {config.description}
                        </p>
                      )}

                      {config.couponCode && (
                        <div className="mt-3 flex items-center justify-between border border-dashed border-purple-400 bg-purple-50/50 dark:bg-purple-950/20 px-3 py-1.5 rounded-lg">
                          <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-300">
                            {config.couponCode}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCoupon(config.couponCode || "")}
                            className="text-[10px] font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                          >
                            {copiedCode ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            {copiedCode ? "Copied" : "Copy"}
                          </button>
                        </div>
                      )}

                      <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
                        {config.primaryButtonText && (
                          <Button
                            type="button"
                            onClick={() => {
                              if (config.primaryButtonUrl && config.primaryButtonUrl !== "#") {
                                window.open(config.primaryButtonUrl, config.openInNewTab ? "_blank" : "_self");
                              } else {
                                toast.info(`Clicked: ${config.primaryButtonText}`);
                              }
                            }}
                            className="w-full h-9 text-xs font-bold rounded-lg shadow-sm"
                            style={{
                              backgroundColor: config.primaryButtonBg,
                              color: config.primaryButtonTextColor,
                            }}
                          >
                            {config.primaryButtonText}
                          </Button>
                        )}
                        {config.hasSecondaryButton && config.secondaryButtonText && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={handleClose}
                            className="w-full sm:w-auto h-9 text-xs font-medium"
                          >
                            {config.secondaryButtonText}
                          </Button>
                        )}
                      </div>

                      {config.footerText && (
                        <p className="mt-2 text-[10px] text-muted-foreground opacity-80">
                          {config.footerText}
                        </p>
                      )}
                    </div>
                  </div>
                ) : effectiveTemplate === "hero-image" ? (
                  /* ───────────────────────────────────────────────────────── */
                  /* 2. IMAGE HERO POPUP LAYOUT */
                  /* ───────────────────────────────────────────────────────── */
                  <div
                    className={cn(
                      "relative flex flex-col overflow-hidden text-center shadow-2xl transition-all",
                      getModalDimensions(),
                      getAnimationClass(),
                      config.customClass
                    )}
                    style={{
                      backgroundColor: config.bgColor,
                      color: config.textColor,
                      borderRadius: `${config.borderRadius}px`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close Button */}
                    {config.showCloseButton && (
                      <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Close popup"
                        className="absolute top-3.5 right-3.5 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs hover:bg-black/60 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}

                    {/* Edge-to-Edge Hero Image */}
                    <div className="relative w-full h-44 sm:h-52 overflow-hidden bg-muted">
                      {config.imageUrl ? (
                        <img
                          src={config.imageUrl}
                          alt={config.imageAlt || config.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white text-3xl">
                          🌅
                        </div>
                      )}
                    </div>

                    {/* Hero Content Body */}
                    <div
                      className="flex flex-col items-center"
                      style={{ padding: `${config.padding}px` }}
                    >
                      <h3
                        className="text-lg sm:text-xl font-bold leading-tight"
                        style={{ color: config.textColor }}
                      >
                        {config.title}
                      </h3>

                      {config.description && (
                        <p
                          className="mt-2 text-xs sm:text-sm opacity-90 leading-relaxed max-w-md"
                          style={{ color: config.textColor }}
                        >
                          {config.description}
                        </p>
                      )}

                      {config.primaryButtonText && (
                        <Button
                          type="button"
                          onClick={() => {
                            if (config.primaryButtonUrl && config.primaryButtonUrl !== "#") {
                              window.open(config.primaryButtonUrl, config.openInNewTab ? "_blank" : "_self");
                            } else {
                              toast.info(`Clicked: ${config.primaryButtonText}`);
                            }
                          }}
                          className="mt-4 w-full h-10 text-xs sm:text-sm font-bold rounded-xl shadow-md transition hover:scale-[1.01]"
                          style={{
                            backgroundColor: config.primaryButtonBg,
                            color: config.primaryButtonTextColor,
                          }}
                        >
                          {config.primaryButtonText}
                        </Button>
                      )}

                      {config.footerText && (
                        <p className="mt-2.5 text-[10px] text-muted-foreground opacity-80">
                          {config.footerText}
                        </p>
                      )}
                    </div>
                  </div>
                ) : effectiveTemplate === "discount" ? (
                  /* ───────────────────────────────────────────────────────── */
                  /* 3. DISCOUNT OFFER LAYOUT */
                  /* ───────────────────────────────────────────────────────── */
                  <div
                    className={cn(
                      "relative flex flex-col items-center text-center overflow-hidden shadow-2xl transition-all",
                      getModalDimensions(),
                      getAnimationClass(),
                      config.customClass
                    )}
                    style={{
                      backgroundColor: config.bgColor,
                      color: config.textColor,
                      borderRadius: `${config.borderRadius}px`,
                      padding: `${config.padding}px`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close Button */}
                    {config.showCloseButton && (
                      <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Close popup"
                        className="absolute top-3.5 right-3.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-foreground transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}

                    {/* Bold Discount Badge */}
                    <div className="mb-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                      <Tag className="h-3 w-3" />
                      {config.discountBadge || "LIMITED TIME SALE"}
                    </div>

                    <h3
                      className="text-lg sm:text-xl font-black tracking-tight"
                      style={{ color: config.textColor }}
                    >
                      {config.title}
                    </h3>

                    {config.description && (
                      <p
                        className="mt-1.5 text-xs opacity-90 leading-relaxed"
                        style={{ color: config.textColor }}
                      >
                        {config.description}
                      </p>
                    )}

                    {/* Prominent Coupon Code Box */}
                    {config.couponCode && (
                      <div className="mt-3.5 w-full flex items-center justify-between gap-2 rounded-xl border-2 border-dashed border-amber-500/60 bg-amber-50/60 dark:bg-amber-950/20 p-2.5">
                        <div className="flex flex-col text-left pl-1">
                          <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 tracking-wider">
                            Coupon Code
                          </span>
                          <span className="font-mono text-sm font-black tracking-wider text-foreground">
                            {config.couponCode}
                          </span>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleCopyCoupon(config.couponCode || "")}
                          className="h-8 text-xs font-bold px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                        >
                          {copiedCode ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                          {copiedCode ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                    )}

                    {/* CTA Button */}
                    {config.primaryButtonText && (
                      <Button
                        type="button"
                        onClick={() => {
                          if (config.primaryButtonUrl && config.primaryButtonUrl !== "#") {
                            window.open(config.primaryButtonUrl, config.openInNewTab ? "_blank" : "_self");
                          } else {
                            toast.info(`Clicked: ${config.primaryButtonText}`);
                          }
                        }}
                        className="mt-3.5 w-full h-10 text-xs sm:text-sm font-bold rounded-xl shadow-md transition"
                        style={{
                          backgroundColor: config.primaryButtonBg,
                          color: config.primaryButtonTextColor,
                        }}
                      >
                        {config.primaryButtonText}
                      </Button>
                    )}

                    {config.footerText && (
                      <p className="mt-2 text-[10px] text-muted-foreground opacity-80">
                        {config.footerText}
                      </p>
                    )}
                  </div>
                ) : effectiveTemplate === "minimal" ? (
                  /* ───────────────────────────────────────────────────────── */
                  /* 4. MINIMAL ELEGANT LAYOUT */
                  /* ───────────────────────────────────────────────────────── */
                  <div
                    className={cn(
                      "relative flex flex-col items-center text-center overflow-hidden border border-border/80 shadow-2xl transition-all",
                      getModalDimensions(),
                      getAnimationClass(),
                      config.customClass
                    )}
                    style={{
                      backgroundColor: config.bgColor,
                      color: config.textColor,
                      borderRadius: `${config.borderRadius}px`,
                      padding: `${Math.max(config.padding, 32)}px`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close Button */}
                    {config.showCloseButton && (
                      <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Close popup"
                        className="absolute top-4 right-4 z-20 flex h-7 w-7 items-center justify-center text-foreground/60 hover:text-foreground transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}

                    {/* Subtle top image if uploaded */}
                    {config.imageUrl && (
                      <div className="mb-4 h-28 w-28 overflow-hidden rounded-full border border-border shadow-xs">
                        <img
                          src={config.imageUrl}
                          alt={config.imageAlt || config.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    <span className="text-[10px] tracking-widest uppercase text-muted-foreground mb-1 font-semibold">
                      Exclusive
                    </span>

                    <h3
                      className="text-lg sm:text-xl font-serif font-medium tracking-normal leading-snug"
                      style={{ color: config.textColor }}
                    >
                      {config.title}
                    </h3>

                    {config.description && (
                      <p
                        className="mt-2.5 text-xs text-muted-foreground leading-relaxed max-w-sm"
                        style={{ color: config.textColor }}
                      >
                        {config.description}
                      </p>
                    )}

                    <div className="mt-5 flex flex-col sm:flex-row items-center gap-2.5 w-full">
                      {config.primaryButtonText && (
                        <Button
                          type="button"
                          onClick={() => {
                            if (config.primaryButtonUrl && config.primaryButtonUrl !== "#") {
                              window.open(config.primaryButtonUrl, config.openInNewTab ? "_blank" : "_self");
                            } else {
                              toast.info(`Clicked: ${config.primaryButtonText}`);
                            }
                          }}
                          className="w-full h-9 text-xs font-semibold rounded-lg transition"
                          style={{
                            backgroundColor: config.primaryButtonBg,
                            color: config.primaryButtonTextColor,
                          }}
                        >
                          {config.primaryButtonText}
                        </Button>
                      )}

                      {config.hasSecondaryButton && config.secondaryButtonText && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleClose}
                          className="w-full sm:w-auto h-9 text-xs font-normal text-muted-foreground hover:text-foreground"
                        >
                          {config.secondaryButtonText}
                        </Button>
                      )}
                    </div>
                  </div>
                ) : effectiveTemplate === "newsletter" ? (
                  /* ───────────────────────────────────────────────────────── */
                  /* 5. NEWSLETTER SIGNUP LAYOUT */
                  /* ───────────────────────────────────────────────────────── */
                  <div
                    className={cn(
                      "relative flex flex-col items-center text-center overflow-hidden shadow-2xl transition-all",
                      getModalDimensions(),
                      getAnimationClass(),
                      config.customClass
                    )}
                    style={{
                      backgroundColor: config.bgColor,
                      color: config.textColor,
                      borderRadius: `${config.borderRadius}px`,
                      padding: `${config.padding}px`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close Button */}
                    {config.showCloseButton && (
                      <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Close popup"
                        className="absolute top-3.5 right-3.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-foreground transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}

                    {config.imageUrl ? (
                      <div className="mb-3.5 h-16 w-16 overflow-hidden rounded-2xl shadow-xs">
                        <img
                          src={config.imageUrl}
                          alt={config.imageAlt || config.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300">
                        <Mail className="h-6 w-6" />
                      </div>
                    )}

                    <h3
                      className="text-base sm:text-lg font-bold leading-tight"
                      style={{ color: config.textColor }}
                    >
                      {config.title}
                    </h3>

                    {config.description && (
                      <p
                        className="mt-1.5 text-xs opacity-90 leading-relaxed max-w-sm"
                        style={{ color: config.textColor }}
                      >
                        {config.description}
                      </p>
                    )}

                    {/* Interactive Form */}
                    <div className="mt-4 w-full space-y-2">
                      {newsletterSubmitted ? (
                        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-center text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1.5 animate-in zoom-in-95">
                          <Check className="h-4 w-4 stroke-[3]" />
                          {config.successMessage || "Thank you for subscribing!"}
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                              type="email"
                              value={emailValue}
                              onChange={(e) => setEmailValue(e.target.value)}
                              placeholder={config.emailPlaceholder || "Enter your email address..."}
                              className="h-9 text-xs bg-card"
                            />
                            <Button
                              type="button"
                              onClick={() => {
                                if (!emailValue.includes("@")) {
                                  toast.error("Please enter a valid email address");
                                  return;
                                }
                                if (config.requireConsent && !consentChecked) {
                                  toast.error("Please agree to the consent terms");
                                  return;
                                }
                                setNewsletterSubmitted(true);
                                toast.success("Subscribed successfully!");
                              }}
                              className="h-9 text-xs font-semibold px-4 shrink-0 shadow-xs"
                              style={{
                                backgroundColor: config.primaryButtonBg,
                                color: config.primaryButtonTextColor,
                              }}
                            >
                              {config.newsletterButtonText || "Subscribe"}
                            </Button>
                          </div>

                          {config.requireConsent && (
                            <div className="flex items-start gap-2 pt-1 text-left">
                              <Checkbox
                                id="previewConsent"
                                checked={consentChecked}
                                onCheckedChange={(c) => setConsentChecked(Boolean(c))}
                                className="mt-0.5"
                              />
                              <label
                                htmlFor="previewConsent"
                                className="text-[10px] text-muted-foreground leading-tight cursor-pointer"
                              >
                                {config.consentText || "I agree to receive promotional emails."}
                              </label>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ) : effectiveTemplate === "slide-in" ? (
                  /* ───────────────────────────────────────────────────────── */
                  /* 6. SIDE SLIDE-IN LAYOUT */
                  /* ───────────────────────────────────────────────────────── */
                  <div
                    className={cn(
                      "relative flex flex-col overflow-hidden text-left shadow-2xl border border-border/80 transition-all",
                      getModalDimensions(),
                      getAnimationClass(),
                      config.customClass
                    )}
                    style={{
                      backgroundColor: config.bgColor,
                      color: config.textColor,
                      borderRadius: `${config.borderRadius}px`,
                      padding: `${config.padding}px`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close Button */}
                    {config.showCloseButton && (
                      <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Close popup"
                        className="absolute top-2.5 right-2.5 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-foreground transition"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}

                    <div className="flex items-start gap-3">
                      {config.imageUrl ? (
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl shadow-xs">
                          <img
                            src={config.imageUrl}
                            alt={config.imageAlt || config.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600 text-lg">
                          👋
                        </div>
                      )}

                      <div className="flex-1 pr-4">
                        <h4
                          className="text-xs sm:text-sm font-bold leading-tight"
                          style={{ color: config.textColor }}
                        >
                          {config.title}
                        </h4>
                        {config.description && (
                          <p
                            className="mt-1 text-[11px] opacity-85 leading-relaxed line-clamp-2"
                            style={{ color: config.textColor }}
                          >
                            {config.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {config.primaryButtonText && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          if (config.primaryButtonUrl && config.primaryButtonUrl !== "#") {
                            window.open(config.primaryButtonUrl, config.openInNewTab ? "_blank" : "_self");
                          } else {
                            toast.info(`Clicked: ${config.primaryButtonText}`);
                          }
                        }}
                        className="mt-3 w-full h-8 text-xs font-semibold rounded-lg shadow-xs"
                        style={{
                          backgroundColor: config.primaryButtonBg,
                          color: config.primaryButtonTextColor,
                        }}
                      >
                        {config.primaryButtonText}
                      </Button>
                    )}
                  </div>
                ) : effectiveTemplate === "announcement" ? (
                  /* ───────────────────────────────────────────────────────── */
                  /* 7. ANNOUNCEMENT POPUP LAYOUT */
                  /* ───────────────────────────────────────────────────────── */
                  <div
                    className={cn(
                      "relative flex flex-col overflow-hidden text-left shadow-2xl transition-all",
                      getModalDimensions(),
                      getAnimationClass(),
                      config.customClass
                    )}
                    style={{
                      backgroundColor: config.bgColor,
                      color: config.textColor,
                      borderRadius: `${config.borderRadius}px`,
                      padding: `${config.padding}px`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close Button */}
                    {config.showCloseButton && (
                      <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Close popup"
                        className="absolute top-3.5 right-3.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-foreground transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}

                    {/* Announcement Alert Pill */}
                    <div className="self-start mb-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-wider">
                      <Bell className="h-3 w-3" />
                      Notice & Updates
                    </div>

                    {config.imageUrl && (
                      <div className="mb-3.5 w-full h-32 overflow-hidden rounded-xl bg-muted/40">
                        <img
                          src={config.imageUrl}
                          alt={config.imageAlt || config.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <h3
                      className="text-base sm:text-lg font-bold leading-snug tracking-tight"
                      style={{ color: config.textColor }}
                    >
                      {config.title}
                    </h3>

                    {config.description && (
                      <p
                        className="mt-2 text-xs opacity-90 leading-relaxed"
                        style={{ color: config.textColor }}
                      >
                        {config.description}
                      </p>
                    )}

                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
                      {config.primaryButtonText && (
                        <Button
                          type="button"
                          onClick={() => {
                            if (config.primaryButtonUrl && config.primaryButtonUrl !== "#") {
                              window.open(config.primaryButtonUrl, config.openInNewTab ? "_blank" : "_self");
                            } else {
                              toast.info(`Clicked: ${config.primaryButtonText}`);
                            }
                          }}
                          className="w-full h-9 text-xs font-bold rounded-lg shadow-sm"
                          style={{
                            backgroundColor: config.primaryButtonBg,
                            color: config.primaryButtonTextColor,
                          }}
                        >
                          {config.primaryButtonText}
                        </Button>
                      )}

                      {config.hasSecondaryButton && config.secondaryButtonText && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleClose}
                          className="w-full sm:w-auto h-9 text-xs font-medium"
                        >
                          {config.secondaryButtonText}
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* ───────────────────────────────────────────────────────── */
                  /* 8. CLASSIC CENTER MODAL & SPECIALIZED (DEFAULT) */
                  /* ───────────────────────────────────────────────────────── */
                  <div
                    className={cn(
                      "relative flex flex-col overflow-hidden text-center shadow-2xl transition-all",
                      getModalDimensions(),
                      getAnimationClass(),
                      config.customClass
                    )}
                    style={{
                      backgroundColor: config.bgColor,
                      color: config.textColor,
                      borderRadius: `${config.borderRadius}px`,
                      padding: `${config.padding}px`,
                      textAlign: config.textAlign || "center",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close Button */}
                    {config.showCloseButton && (
                      <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Close popup"
                        className="absolute top-3.5 right-3.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-foreground transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}

                    {/* Video Player */}
                    {config.templateId === "video" && (
                      <div className="relative mb-3.5 w-full overflow-hidden rounded-xl bg-black aspect-video flex items-center justify-center shadow-xs">
                        {config.videoUrl ? (
                          <iframe
                            src={parseVideoUrl(config.videoUrl).embedUrl}
                            title="Video preview"
                            className="h-full w-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-white/60">
                            <Play className="h-8 w-8 text-white/80" />
                            <span className="text-xs">Provide a valid video URL</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Standard Image */}
                    {config.imageUrl && config.templateId !== "video" && config.templateId !== "custom-html" && (
                      <div className="relative mb-3.5 w-full overflow-hidden rounded-xl bg-muted/40 max-h-48 flex items-center justify-center">
                        <img
                          src={config.imageUrl}
                          alt={config.imageAlt || config.title}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                    )}

                    {/* Custom HTML Preview */}
                    {config.templateId === "custom-html" ? (
                      <div
                        className="w-full text-foreground text-left"
                        dangerouslySetInnerHTML={{
                          __html: config.customHtmlContent.replace(
                            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                            ""
                          ),
                        }}
                      />
                    ) : (
                      <>
                        <h3
                          className="text-base sm:text-lg font-bold leading-snug tracking-tight"
                          style={{ color: config.textColor }}
                        >
                          {config.title}
                        </h3>

                        {config.description && (
                          <p
                            className="mt-1.5 text-xs opacity-90 leading-relaxed"
                            style={{ color: config.textColor }}
                          >
                            {config.description}
                          </p>
                        )}

                        {/* Optional coupon box */}
                        {config.couponCode && (
                          <div className="mt-3 inline-flex items-center gap-2 border border-dashed border-purple-400 bg-purple-50/50 dark:bg-purple-950/20 px-3 py-1.5 rounded-lg mx-auto">
                            <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-300">
                              {config.couponCode}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyCoupon(config.couponCode || "")}
                              className="text-[10px] font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                            >
                              {copiedCode ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              {copiedCode ? "Copied" : "Copy"}
                            </button>
                          </div>
                        )}

                        {/* Age Verification buttons */}
                        {config.templateId === "age-verification" && (
                          <div className="mt-4 space-y-2">
                            {ageDeclined ? (
                              <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-center text-xs text-rose-600 dark:text-rose-400 font-medium">
                                🚫 {config.declineMessage || "Access denied. You must be at least 18 years old."}
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-2.5">
                                <Button
                                  type="button"
                                  onClick={() => {
                                    setAgeConfirmed(true);
                                    handleClose();
                                    toast.success("Age verified! Welcome.");
                                  }}
                                  className="h-9 text-xs font-bold"
                                  style={{
                                    backgroundColor: config.primaryButtonBg,
                                    color: config.primaryButtonTextColor,
                                  }}
                                >
                                  {config.confirmText}
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    if (config.declineAction === "redirect") {
                                      window.open(config.declineUrl || "https://google.com", "_blank");
                                    } else {
                                      setAgeDeclined(true);
                                    }
                                  }}
                                  className="h-9 text-xs"
                                >
                                  {config.declineText}
                                </Button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action buttons */}
                        {config.templateId !== "age-verification" && config.primaryButtonText && (
                          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
                            <Button
                              type="button"
                              onClick={() => {
                                if (config.primaryButtonUrl && config.primaryButtonUrl !== "#") {
                                  window.open(config.primaryButtonUrl, config.openInNewTab ? "_blank" : "_self");
                                } else {
                                  toast.info(`Clicked: ${config.primaryButtonText}`);
                                }
                              }}
                              className="w-full sm:w-auto min-w-[140px] h-9 text-xs font-bold rounded-lg shadow-sm transition"
                              style={{
                                backgroundColor: config.primaryButtonBg,
                                color: config.primaryButtonTextColor,
                              }}
                            >
                              {config.primaryButtonText}
                            </Button>

                            {config.hasSecondaryButton && config.secondaryButtonText && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                className="w-full sm:w-auto h-9 text-xs font-medium rounded-lg"
                              >
                                {config.secondaryButtonText}
                              </Button>
                            )}
                          </div>
                        )}

                        {config.footerText && (
                          <p className="mt-2 text-[10px] text-muted-foreground opacity-80">
                            {config.footerText}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Dismissed Banner Helper */
              <div className="absolute inset-0 z-30 flex items-center justify-center p-4">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsOpen(true)}
                  className="rounded-xl shadow-lg border border-border"
                >
                  <RotateCw className="h-3.5 w-3.5 mr-2" />
                  Popup Closed. Click to Reopen
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
