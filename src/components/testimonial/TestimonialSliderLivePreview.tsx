import { useState } from "react";
import { Monitor, Tablet, Smartphone, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestimonialSliderRenderer } from "./TestimonialSliderRenderer";
import type { TestimonialSliderConfig } from "@/lib/testimonial/types";
import { cn } from "@/lib/utils";

interface TestimonialSliderLivePreviewProps {
  config: TestimonialSliderConfig;
  viewport?: "desktop" | "tablet" | "mobile";
  onViewportChange?: (viewport: "desktop" | "tablet" | "mobile") => void;
  className?: string;
}

export function TestimonialSliderLivePreview({
  config,
  viewport: controlledViewport,
  onViewportChange,
  className,
}: TestimonialSliderLivePreviewProps) {
  const [internalViewport, setInternalViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [refreshKey, setRefreshKey] = useState(0);

  const activeViewport = controlledViewport ?? internalViewport;

  const handleViewportChange = (vp: "desktop" | "tablet" | "mobile") => {
    if (onViewportChange) {
      onViewportChange(vp);
    } else {
      setInternalViewport(vp);
    }
  };

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-border dark:bg-card overflow-hidden",
        className
      )}
    >
      {/* Top Preview Controls Bar */}
      <div className="flex items-center justify-between border-b border-slate-200/80 px-4 py-3 bg-slate-50/60 dark:border-border dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Live Preview
          </span>
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900">
            Interactive
          </span>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5 dark:border-border dark:bg-card">
          <button
            type="button"
            onClick={() => handleViewportChange("desktop")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              activeViewport === "desktop"
                ? "bg-purple-100 text-purple-700 font-semibold dark:bg-purple-950 dark:text-purple-300"
                : "text-slate-500 hover:text-slate-800"
            )}
            title="Desktop view"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => handleViewportChange("tablet")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              activeViewport === "tablet"
                ? "bg-purple-100 text-purple-700 font-semibold dark:bg-purple-950 dark:text-purple-300"
                : "text-slate-500 hover:text-slate-800"
            )}
            title="Tablet view"
          >
            <Tablet className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => handleViewportChange("mobile")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              activeViewport === "mobile"
                ? "bg-purple-100 text-purple-700 font-semibold dark:bg-purple-950 dark:text-purple-300"
                : "text-slate-500 hover:text-slate-800"
            )}
            title="Mobile view"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1 dark:bg-slate-700" />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="h-7 w-7 text-slate-500 hover:text-slate-800"
            title="Reset preview animation"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Preview Canvas */}
      <div className="relative min-h-[460px] flex-1 overflow-x-hidden overflow-y-auto bg-slate-100/70 p-6 flex items-center justify-center dark:bg-slate-950/60">
        <div
          className={cn(
            "w-full transition-all duration-300 ease-in-out p-6 rounded-2xl shadow-soft",
            config.designId === "dark"
              ? "bg-slate-950 border border-slate-800"
              : "bg-white border border-slate-200/80",
            activeViewport === "desktop" && "max-w-4xl",
            activeViewport === "tablet" && "max-w-2xl",
            activeViewport === "mobile" && "max-w-[380px]"
          )}
        >
          <TestimonialSliderRenderer
            key={refreshKey}
            config={config}
            viewport={activeViewport}
          />
        </div>
      </div>
    </div>
  );
}
