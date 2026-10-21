import { useState, useEffect } from "react";
import {
  X,
  RotateCcw,
  MessageCircle,
  Phone,
  MessageSquare,
  ExternalLink,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import type { WhatsAppWidgetConfig } from "@/lib/whatsapp/types";
import { generateWhatsAppLink } from "@/lib/whatsapp/phone";
import { cn } from "@/lib/utils";

// Official WhatsApp SVG icon
export function WhatsAppIcon({ className = "h-6 w-6", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface WhatsAppLivePreviewProps {
  config: WhatsAppWidgetConfig;
  viewport?: "desktop" | "tablet" | "mobile";
  onViewportChange?: (viewport: "desktop" | "tablet" | "mobile") => void;
}

export function WhatsAppLivePreview({
  config,
  viewport: externalViewport,
  onViewportChange,
}: WhatsAppLivePreviewProps) {
  const [internalViewport, setInternalViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const activeViewport = externalViewport || internalViewport;

  const handleViewportChange = (vp: "desktop" | "tablet" | "mobile") => {
    if (onViewportChange) {
      onViewportChange(vp);
    } else {
      setInternalViewport(vp);
    }
  };

  const [popupOpen, setPopupOpen] = useState(config.showChatPopup);
  const [resetKey, setResetKey] = useState(0);

  // Sync popup state when user config changes
  useEffect(() => {
    setPopupOpen(config.showChatPopup);
  }, [config.showChatPopup, resetKey]);

  const handleRefresh = () => {
    setResetKey((k) => k + 1);
    setPopupOpen(config.showChatPopup);
    toast.info("Preview refreshed");
  };

  const handlePreviewChatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const destination = generateWhatsAppLink(config.phone, config.countryCode, config.prefilledMessage);
    if (!destination) {
      toast.error("Please enter a valid WhatsApp phone number in the Content tab.");
      return;
    }
    toast.success("Preview Mode: WhatsApp conversation would open", {
      description: `Target URL: ${destination}`,
      duration: 3500,
    });
  };

  // Position styles for the floating widget within the preview box
  const getPositionStyles = () => {
    const margin = Math.min(Math.max(config.spacing, 12), 36);
    switch (config.position) {
      case "bottom-left":
        return { bottom: margin, left: margin };
      case "top-left":
        return { top: margin, left: margin };
      case "top-right":
        return { top: margin, right: margin };
      case "bottom-right":
      default:
        return { bottom: margin, right: margin };
    }
  };

  // FAB sizing
  const fabSizeClasses = {
    small: "h-11 w-11",
    medium: "h-14 w-14",
    large: "h-16 w-16",
  }[config.buttonSize];

  const fabIconSize = {
    small: "h-5 w-5",
    medium: "h-7 w-7",
    large: "h-8 w-8",
  }[config.buttonSize];

  const isTopPosition = config.position.startsWith("top");

  // Render FAB Icon
  const renderIcon = () => {
    if (config.buttonIcon === "custom" && config.customIconUrl) {
      return (
        <img
          src={config.customIconUrl}
          alt="Custom Icon"
          className={cn("rounded-full object-cover", fabIconSize)}
        />
      );
    }
    switch (config.buttonIcon) {
      case "message-circle":
        return <MessageCircle className={fabIconSize} />;
      case "speech-bubble":
        return <MessageSquare className={fabIconSize} />;
      case "phone":
        return <Phone className={fabIconSize} />;
      case "whatsapp":
      default:
        return <WhatsAppIcon className={fabIconSize} />;
    }
  };

  // Max width container for viewport
  const viewportWidthClass = {
    desktop: "max-w-4xl",
    tablet: "max-w-[680px]",
    mobile: "max-w-[360px]",
  }[activeViewport];

  return (
    <div className="flex flex-col rounded-2xl border bg-card p-4 shadow-soft">
      {/* Browser Mockup Window */}
      <div className="flex justify-center overflow-hidden">
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-xl border bg-background shadow-md transition-all duration-300",
            viewportWidthClass
          )}
        >
          {/* Browser Header Bar with integrated icon-only viewport & refresh controls */}
          <div className="flex items-center justify-between border-b bg-muted/40 px-3.5 py-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
            </div>

            <div className="flex h-5 items-center justify-center rounded-md bg-background/80 px-2.5 text-[10px] text-muted-foreground font-mono">
              https://yourwebsite.com
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center rounded-md border bg-muted/50 p-0.5">
                <button
                  type="button"
                  onClick={() => handleViewportChange("desktop")}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded text-xs transition-colors",
                    activeViewport === "desktop"
                      ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-label="Desktop preview"
                  title="Desktop preview"
                >
                  <Monitor className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleViewportChange("tablet")}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded text-xs transition-colors",
                    activeViewport === "tablet"
                      ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-label="Tablet preview"
                  title="Tablet preview"
                >
                  <Tablet className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleViewportChange("mobile")}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded text-xs transition-colors",
                    activeViewport === "mobile"
                      ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-label="Mobile preview"
                  title="Mobile preview"
                >
                  <Smartphone className="h-3 w-3" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                className="flex h-6 w-6 items-center justify-center rounded-md border bg-background text-muted-foreground hover:text-foreground shadow-2xs transition-colors"
                aria-label="Refresh preview"
                title="Refresh preview"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Sample Website Content */}
          <div className="relative min-h-[460px] select-none bg-gradient-to-b from-stone-50 to-white text-slate-800">
            {/* Website Navbar */}
            <header className="flex items-center justify-between border-b border-stone-200/80 bg-white/80 px-4 py-3 backdrop-blur-xs">
              <div className="text-sm font-black tracking-tight text-slate-900">Your Website</div>
              <nav className="hidden items-center gap-4 text-xs font-medium text-slate-600 sm:flex">
                <span className="cursor-pointer hover:text-slate-900">Home</span>
                <span className="cursor-pointer hover:text-slate-900">About</span>
                <span className="cursor-pointer hover:text-slate-900">Services</span>
                <span className="cursor-pointer hover:text-slate-900">Contact</span>
              </nav>
              <button
                type="button"
                className="rounded-md px-3 py-1 text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-90"
                style={{ backgroundColor: config.primaryColor }}
              >
                Get Started
              </button>
            </header>

            {/* Hero Section */}
            <div className="relative grid grid-cols-1 items-center gap-6 p-6 md:grid-cols-12 md:p-8">
              <div className="space-y-3 md:col-span-7">
                <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                  Grow Your Business
                </span>
                <h1 className="text-2xl font-black leading-tight tracking-tight text-slate-900 md:text-3xl">
                  Create Amazing Experiences
                </h1>
                <p className="text-xs leading-relaxed text-slate-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    className="rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-xs transition-transform active:scale-95"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    Learn More
                  </button>
                </div>
              </div>

              {/* Sample decorative plant image */}
              <div className="hidden justify-center md:col-span-5 md:flex">
                <div className="relative h-44 w-44 overflow-hidden rounded-2xl bg-stone-100 shadow-inner">
                  <img
                    src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=80"
                    alt="Sample aesthetic interior"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* ================= FLOATING WHATSAPP WIDGET ================= */}
            <div
              className={cn(
                "absolute z-30 flex flex-col transition-all duration-200",
                config.position.includes("left") ? "items-start" : "items-end",
                isTopPosition ? "flex-col-reverse" : "flex-col"
              )}
              style={getPositionStyles()}
            >
              {/* CHAT POPUP WINDOW */}
              {popupOpen && (
                <div
                  className={cn(
                    "w-[270px] max-w-[calc(100vw-3rem)] overflow-hidden bg-white shadow-2xl transition-all duration-200 animate-in fade-in zoom-in-95",
                    isTopPosition ? "mt-2.5" : "mb-2.5"
                  )}
                  style={{
                    borderRadius: `${config.borderRadius}px`,
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  {/* Popup Header */}
                  <div
                    className="flex items-center justify-between p-3.5 text-white"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    {config.showAgent ? (
                      <div className="flex items-center gap-2.5 min-w-0">
                        {config.agentAvatar ? (
                          <img
                            src={config.agentAvatar}
                            alt={config.agentName}
                            className="h-9 w-9 rounded-full border-2 border-white/60 object-cover shrink-0"
                          />
                        ) : (
                          <div className="grid h-9 w-9 place-items-center rounded-full bg-white/20 font-bold text-white shrink-0">
                            {config.agentName?.[0] || "A"}
                          </div>
                        )}
                        <div className="truncate">
                          <p className="truncate text-xs font-bold leading-none">{config.agentName}</p>
                          <p className="text-[10px] text-white/80 leading-tight mt-0.5">
                            {config.agentRole}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <WhatsAppIcon className="h-5 w-5" />
                        <span className="text-xs font-bold">WhatsApp Chat</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setPopupOpen(false)}
                      aria-label="Close chat popup"
                      className="rounded-full p-1 text-white/90 hover:bg-black/15 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Popup Body */}
                  <div className="bg-[#EFEAE2] p-3 text-slate-800 space-y-2.5">
                    {/* Welcome message bubble */}
                    <div className="relative rounded-xl rounded-tl-xs bg-white p-2.5 text-xs shadow-xs text-slate-800">
                      <p className="whitespace-pre-line leading-relaxed text-[12px]">
                        {config.welcomeMessage}
                      </p>
                      <span className="mt-1 block text-right text-[9px] text-slate-400">
                        10:30 AM
                      </span>
                    </div>

                    {/* Chat CTA Button */}
                    <button
                      type="button"
                      onClick={handlePreviewChatClick}
                      className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white shadow-sm transition-transform active:scale-98 hover:brightness-105"
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                      <span>{config.buttonText || "Chat on WhatsApp"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* FLOATING ACTION BUTTON (FAB) */}
              <button
                type="button"
                onClick={() => setPopupOpen((prev) => !prev)}
                aria-label="Toggle WhatsApp chat"
                className={cn(
                  "relative flex items-center justify-center rounded-full text-white shadow-lift transition-transform hover:scale-105 active:scale-95 cursor-pointer",
                  fabSizeClasses
                )}
                style={{ backgroundColor: config.primaryColor }}
              >
                {renderIcon()}

                {/* Notification Unread Badge */}
                {!popupOpen && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
                    1
                  </span>
                )}
              </button>
            </div>
            {/* ================= END FLOATING WIDGET ================= */}
          </div>
        </div>
      </div>
    </div>
  );
}
