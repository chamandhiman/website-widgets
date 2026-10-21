import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Code2, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface WidgetEditorHeaderProps {
  /** Target link for back arrow, defaults to "/widgets" */
  backTo?: string;
  /** Optional click handler for back navigation instead of link */
  onBack?: () => void;
  /** Back button tooltip text */
  backTooltip?: string;
  /** Icon displayed in the square tile */
  icon: ReactNode;
  /** Icon tile background color class or hex, e.g. "bg-purple-600" */
  iconBgClass?: string;
  /** Widget title, e.g. "Announcement Bar" or "WhatsApp Chat" */
  title: string;
  /** Subtitle text displayed on desktop */
  subtitle?: string;
  /** Status text, e.g. "Ready" */
  statusText?: string;
  /** Whether the publish action is currently processing */
  isPublishing?: boolean;
  /** Callback when Install Widget button is clicked */
  onInstall: () => void;
  /** Callback when Publish button is clicked */
  onPublish: () => void | Promise<void>;
  /** Optional custom action buttons or children to append */
  extraActions?: ReactNode;
}

export function WidgetEditorHeader({
  backTo = "/widgets",
  onBack,
  backTooltip = "Back to widgets",
  icon,
  iconBgClass = "bg-purple-600",
  title,
  subtitle,
  statusText = "Ready",
  isPublishing = false,
  onInstall,
  onPublish,
  extraActions,
}: WidgetEditorHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex w-full items-center justify-between border-b bg-card/95 px-4 py-3 backdrop-blur-md shadow-xs md:px-6">
      {/* Left: Back Arrow Icon + Divider + Widget Icon + Title + Status + Subtitle */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Back Arrow with Tooltip */}
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              {onBack ? (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={onBack}
                  aria-label={backTooltip}
                  className="h-9 w-9 rounded-xl border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground shrink-0 transition-colors shadow-2xs"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-xl border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground shrink-0 transition-colors shadow-2xs"
                >
                  <Link to={backTo} aria-label={backTooltip}>
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6}>
              <p>{backTooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-border/80 shrink-0 hidden sm:block" />

        {/* Widget Icon Tile */}
        <span
          className={cn(
            "grid h-9 w-9 place-items-center rounded-xl text-white shadow-xs shrink-0",
            iconBgClass
          )}
        >
          {icon}
        </span>

        {/* Title, Status Badge & Desktop Subtitle */}
        <div className="min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base font-bold tracking-tight text-foreground sm:text-lg leading-tight truncate">
              {title}
            </h1>
            {statusText && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {statusText}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="hidden text-xs text-muted-foreground sm:block truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Flexible Empty Space */}
      <div className="flex-1 min-w-2" />

      {/* Right: Outlined Install Widget + Primary Purple Publish Button */}
      <div className="flex items-center gap-2.5 shrink-0">
        {extraActions}

        {/* Outlined Install Widget Button */}
        <Button
          type="button"
          variant="outline"
          onClick={onInstall}
          className="h-9 gap-1.5 rounded-xl border-border/80 font-medium text-foreground hover:bg-muted text-xs sm:text-sm shadow-2xs"
        >
          <Code2 className="h-4 w-4" />
          <span>Install Widget</span>
        </Button>

        {/* Primary Purple Publish Button */}
        <Button
          type="button"
          onClick={onPublish}
          disabled={isPublishing}
          className="h-9 gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-xs text-xs sm:text-sm transition-all disabled:opacity-70 active:scale-[0.98]"
        >
          {isPublishing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{isPublishing ? "Publishing..." : "Publish"}</span>
        </Button>
      </div>
    </header>
  );
}
