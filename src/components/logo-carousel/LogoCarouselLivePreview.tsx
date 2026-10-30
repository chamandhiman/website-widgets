import { useState, type FC } from "react";
import { Monitor, Tablet, Smartphone, RotateCw } from "lucide-react";
import { toast } from "sonner";
import type { LogoCarouselConfig } from "@/lib/logo-carousel/types";
import { LogoCarouselRenderer } from "./LogoCarouselRenderer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LogoCarouselLivePreviewProps {
  config: LogoCarouselConfig;
  viewport: "desktop" | "tablet" | "mobile";
  onViewportChange: (vp: "desktop" | "tablet" | "mobile") => void;
  resetKey?: number;
}

export const LogoCarouselLivePreview: FC<LogoCarouselLivePreviewProps> = ({
  config,
  viewport,
  onViewportChange,
  resetKey = 0,
}) => {
  const [refreshSeed, setRefreshSeed] = useState(0);

  const handleRefresh = () => {
    setRefreshSeed((s) => s + 1);
    toast.info("Preview refreshed");
  };

  return (
    <div className="flex flex-col gap-3">
      {/* 1. TOP CONTROLS BAR: Title, Active Design Badge, Viewport toggles, Refresh */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border bg-card p-3 shadow-soft">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-foreground">Live Preview</span>
          <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-purple-600 dark:text-purple-400 capitalize">
            {config.designId.replace("-", " ")}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Viewport switchers */}
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

      {/* 2. SIMULATED BROWSER / WEBSITE FRAME */}
      <div className="relative flex justify-center w-full rounded-2xl border bg-muted/15 p-2 sm:p-4 min-h-[440px]">
        <div
          className={cn(
            "relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl transition-all duration-300 w-full",
            viewport === "mobile" && "max-w-[375px]",
            viewport === "tablet" && "max-w-[768px]"
          )}
        >
          {/* Browser Chrome Header */}
          <div className="flex items-center gap-2 border-b border-border/80 bg-muted/40 px-3.5 py-2 select-none">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
            </div>
            <div className="mx-auto flex h-5 w-44 items-center justify-center rounded-md bg-background/80 px-2 text-[10px] text-muted-foreground font-mono">
              example.com/partners
            </div>
          </div>

          {/* Website Content Area with Logo Carousel */}
          <div className="relative flex-1 bg-background flex flex-col justify-center">
            <LogoCarouselRenderer
              key={`${resetKey}-${refreshSeed}`}
              config={config}
              viewport={viewport}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
