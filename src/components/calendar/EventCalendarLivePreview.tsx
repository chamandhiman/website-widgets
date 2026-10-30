import { useState } from "react";
import { Monitor, Tablet, Smartphone, RotateCcw, Calendar } from "lucide-react";
import { toast } from "sonner";
import type { EventCalendarConfig } from "@/lib/calendar/types";
import { EventCalendarRenderer } from "./EventCalendarRenderer";
import { cn } from "@/lib/utils";

interface EventCalendarLivePreviewProps {
  config: EventCalendarConfig;
  viewport?: "desktop" | "tablet" | "mobile";
  onViewportChange?: (viewport: "desktop" | "tablet" | "mobile") => void;
}

export function EventCalendarLivePreview({
  config,
  viewport: externalViewport,
  onViewportChange,
}: EventCalendarLivePreviewProps) {
  const [internalViewport, setInternalViewport] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );
  const activeViewport = externalViewport || internalViewport;

  const handleViewportChange = (vp: "desktop" | "tablet" | "mobile") => {
    if (onViewportChange) {
      onViewportChange(vp);
    } else {
      setInternalViewport(vp);
    }
  };

  const handleRefresh = () => {
    toast.info("Preview refreshed");
  };

  const viewportWidthClass = {
    desktop: "max-w-4xl",
    tablet: "max-w-[680px]",
    mobile: "max-w-[360px]",
  }[activeViewport];

  return (
    <div className="flex h-full flex-col rounded-2xl border bg-card shadow-soft overflow-hidden">
      {/* Top Preview Controls Bar */}
      <div className="flex items-center justify-between border-b px-4 py-2.5 bg-muted/20 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <span className="text-xs font-semibold text-muted-foreground ml-2">Live Preview</span>
        </div>

        {/* Viewport Toggles (Desktop, Tablet, Mobile) */}
        <div className="flex items-center gap-1 rounded-xl border bg-background/80 p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => handleViewportChange("desktop")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
              activeViewport === "desktop"
                ? "bg-purple-600 text-white font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Desktop view"
            aria-label="Desktop view"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => handleViewportChange("tablet")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
              activeViewport === "tablet"
                ? "bg-purple-600 text-white font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Tablet view"
            aria-label="Tablet view"
          >
            <Tablet className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => handleViewportChange("mobile")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
              activeViewport === "mobile"
                ? "bg-purple-600 text-white font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Mobile view"
            aria-label="Mobile view"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Refresh Preview */}
        <button
          type="button"
          onClick={handleRefresh}
          className="grid h-8 w-8 place-items-center rounded-lg border border-border/80 bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-2xs"
          title="Refresh Preview"
          aria-label="Refresh Preview"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Preview Canvas */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-100/70 dark:bg-slate-950/60 flex items-start justify-center min-h-[520px]">
        <div
          className={cn(
            "w-full transition-all duration-300 rounded-2xl border border-slate-200 dark:border-slate-800 bg-background p-6 md:p-8 shadow-sm",
            viewportWidthClass
          )}
        >
          <EventCalendarRenderer config={config} isInteractive={true} />
        </div>
      </div>
    </div>
  );
}
