import { useState, useEffect, useId, type FC } from "react";
import {
  RotateCw,
  Monitor,
  Tablet,
  Smartphone,
  X,
  ExternalLink,
  Check,
  Layout,
  Maximize2,
  Sliders,
  ShieldAlert,
  Play,
  Bell,
  Gift,
  Mail,
  Sparkles,
  HelpCircle,
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
  updateConfig: <K extends keyof PopupWidgetConfig>(
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

  // Sizing dimensions
  const getModalDimensions = () => {
    if (viewport === "mobile") {
      return "w-[92%] max-w-[360px]";
    }
    if (config.position === "bottom-right" || config.position === "bottom-left") {
      return "w-[360px] max-w-[90%]";
    }
    switch (config.size) {
      case "small":
        return "w-[400px] max-w-[90%]";
      case "large":
        return "w-[680px] max-w-[94%]";
      case "medium":
      default:
        return "w-[520px] max-w-[92%]";
    }
  };

  // Position alignment classes inside preview container
  const getPositionClasses = () => {
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
        return "animate-in slide-in-from-bottom-8 fade-in duration-300";
      case "slide-down":
        return "animate-in slide-in-from-top-8 fade-in duration-300";
      case "slide-left":
        return "animate-in slide-in-from-right-8 fade-in duration-300";
      case "slide-right":
        return "animate-in slide-in-from-left-8 fade-in duration-300";
      case "none":
      default:
        return "";
    }
  };

  // Overlay appearance
  const getOverlayClass = () => {
    switch (config.overlayStyle) {
      case "light":
        return "bg-white/60";
      case "blur":
        return "bg-black/40 backdrop-blur-md";
      case "dark":
        return "bg-black/60";
      case "none":
      default:
        return "bg-transparent pointer-events-none";
    }
  };

  return (
    <div className="flex h-full flex-col bg-muted/20 overflow-y-auto scrollbar-thin">
      {/* Top Header of Column 3 */}
      <div className="flex items-center justify-between border-b border-border/60 bg-card px-5 py-3">
        <div>
          <h2 className="text-sm font-bold text-foreground">Live Preview</h2>
          <p className="text-xs text-muted-foreground">
            See how your popup will look on your website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Viewport Segmented Control */}
          <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
            <button
              type="button"
              onClick={() => onViewportChange("desktop")}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md text-xs transition-colors",
                viewport === "desktop"
                  ? "bg-card text-foreground shadow-2xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Desktop View"
              aria-label="Desktop preview"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onViewportChange("tablet")}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md text-xs transition-colors",
                viewport === "tablet"
                  ? "bg-card text-foreground shadow-2xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Tablet View"
              aria-label="Tablet preview"
            >
              <Tablet className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onViewportChange("mobile")}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md text-xs transition-colors",
                viewport === "mobile"
                  ? "bg-card text-foreground shadow-2xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Mobile View"
              aria-label="Mobile preview"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Refresh Preview Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-8 text-xs rounded-lg border-border/80 shadow-2xs"
          >
            <RotateCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh Preview
          </Button>
        </div>
      </div>

      {/* Main Preview Container with Browser Frame */}
      <div className="flex flex-1 items-center justify-center p-4">
        <div
          className={cn(
            "relative flex flex-col rounded-2xl border border-border bg-card shadow-lg overflow-hidden transition-all duration-200",
            viewport === "desktop" && "w-full max-w-[960px] h-[520px]",
            viewport === "tablet" && "w-[680px] h-[520px]",
            viewport === "mobile" && "w-[360px] h-[520px]"
          )}
        >
          {/* Browser Chrome Bar */}
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

          {/* Simulated Website Content Canvas */}
          <div className="relative flex-1 overflow-hidden bg-slate-900 text-white select-none">
            {/* Website Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 px-6 py-3.5 backdrop-blur-xs bg-slate-950/40">
              <span className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                Your Website
              </span>
              <div className="hidden sm:flex items-center gap-4 text-xs text-slate-300">
                <span className="cursor-pointer hover:text-white">Home</span>
                <span className="cursor-pointer hover:text-white">About</span>
                <span className="cursor-pointer hover:text-white">Services</span>
                <span className="cursor-pointer hover:text-white">Blog</span>
                <span className="cursor-pointer hover:text-white">Contact</span>
              </div>
              <button
                type="button"
                className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-purple-700"
              >
                Get Started
              </button>
            </div>

            {/* Hero Section */}
            <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16 text-center max-w-xl mx-auto">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Build Amazing Websites
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                Engage visitors with high-converting popups, announcement banners, and floating widgets.
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-purple-700"
                >
                  Explore Features
                </button>
              </div>
            </div>

            {/* Background Living Room/Plant Atmosphere Image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-[1px]"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80')",
              }}
            />

            {/* ───────────────────────────────────────────────────────────── */}
            {/* POPUP OVERLAY & MODAL */}
            {/* ───────────────────────────────────────────────────────────── */}
            {isOpen ? (
              <div
                className={cn(
                  "absolute inset-0 z-40 flex overflow-y-auto transition-opacity duration-200",
                  getOverlayClass(),
                  getPositionClasses()
                )}
                onClick={handleOverlayClick}
              >
                {/* Popup Card */}
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
                    textAlign: config.textAlign,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  {config.showCloseButton && (
                    <button
                      type="button"
                      onClick={handleClose}
                      aria-label="Close popup"
                      className="absolute top-3.5 right-3.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-foreground/80 hover:text-foreground transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                  {/* 1. MEDIA SECTION */}
                  {/* Video Popup */}
                  {config.templateId === "video" ? (
                    <div className="relative mb-4 w-full overflow-hidden rounded-xl bg-black aspect-video flex items-center justify-center shadow-xs">
                      {config.videoUrl ? (
                        <iframe
                          src={parseVideoUrl(config.videoUrl).embedUrl}
                          title="Video preview"
                          className="h-full w-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; presentation"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-white/60">
                          <Play className="h-8 w-8 text-white/80" />
                          <span className="text-xs">Provide a valid video URL</span>
                        </div>
                      )}
                    </div>
                  ) : null}

                  {/* Standard Image */}
                  {config.imageUrl && config.templateId !== "video" && config.templateId !== "custom-html" ? (
                    <div className="relative mb-3.5 w-full overflow-hidden rounded-xl bg-muted/40 max-h-48 flex items-center justify-center">
                      <img
                        src={config.imageUrl}
                        alt={config.imageAlt || config.title}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  ) : null}

                  {/* Icon Indicator (if enabled) */}
                  {config.showIcon && (
                    <div className="mb-2 flex items-center justify-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300">
                        <Gift className="h-5 w-5" />
                      </div>
                    </div>
                  )}

                  {/* 2. CUSTOM HTML POPUP */}
                  {config.templateId === "custom-html" ? (
                    <div
                      className="w-full text-foreground"
                      dangerouslySetInnerHTML={{
                        // Strip any potential script tags for safe previewing
                        __html: config.customHtmlContent.replace(
                          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                          ""
                        ),
                      }}
                    />
                  ) : (
                    <>
                      {/* Title */}
                      <h3
                        className="text-base sm:text-lg font-bold leading-snug tracking-tight"
                        style={{ color: config.textColor }}
                      >
                        {config.title}
                      </h3>

                      {/* Description */}
                      {config.description && (
                        <p
                          className="mt-1.5 text-xs opacity-90 leading-relaxed"
                          style={{ color: config.textColor }}
                        >
                          {config.description}
                        </p>
                      )}

                      {/* Newsletter Form */}
                      {config.templateId === "newsletter" && (
                        <div className="mt-3.5 space-y-2 text-left">
                          {newsletterSubmitted ? (
                            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                              ✓ {config.successMessage}
                            </div>
                          ) : (
                            <>
                              <div className="flex gap-2">
                                <Input
                                  type="email"
                                  value={emailValue}
                                  onChange={(e) => setEmailValue(e.target.value)}
                                  placeholder={config.emailPlaceholder || "Enter your email..."}
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
                                  className="h-9 text-xs font-semibold px-4 shrink-0"
                                  style={{
                                    backgroundColor: config.primaryButtonBg,
                                    color: config.primaryButtonTextColor,
                                  }}
                                >
                                  {config.newsletterButtonText || "Subscribe"}
                                </Button>
                              </div>
                              {config.requireConsent && (
                                <div className="flex items-start gap-2 pt-1">
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
                                    {config.consentText}
                                  </label>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}

                      {/* Age Verification Buttons */}
                      {config.templateId === "age-verification" && (
                        <div className="mt-4 space-y-2">
                          {ageDeclined ? (
                            <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-center text-xs text-rose-600 dark:text-rose-400 font-medium">
                              🚫 {config.declineMessage}
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

                      {/* Primary / Secondary Buttons (for general popups) */}
                      {config.templateId !== "newsletter" &&
                        config.templateId !== "age-verification" &&
                        config.primaryButtonText && (
                          <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
                            <Button
                              type="button"
                              onClick={() => {
                                if (config.primaryButtonUrl && config.primaryButtonUrl !== "#") {
                                  window.open(
                                    config.primaryButtonUrl,
                                    config.openInNewTab ? "_blank" : "_self"
                                  );
                                } else {
                                  toast.info(`Clicked: ${config.primaryButtonText}`);
                                }
                              }}
                              className="w-full h-9 text-xs font-bold rounded-lg shadow-sm transition"
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
                                style={{
                                  backgroundColor: config.secondaryButtonBg,
                                  color: config.secondaryButtonTextColor,
                                }}
                              >
                                {config.secondaryButtonText}
                              </Button>
                            )}
                          </div>
                        )}

                      {/* Optional Footer / Disclaimer */}
                      {config.footerText && (
                        <p className="mt-2 text-[10px] text-muted-foreground opacity-80">
                          {config.footerText}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              /* Dismissed Banner helper */
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
