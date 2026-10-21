import {
  Megaphone,
  Gift,
  Info,
  Check,
  Flame,
  Tag,
  Clock,
  Star,
  Bell,
  X,
} from "lucide-react";
import { ANNOUNCEMENT_TEMPLATES, type TemplateDefinition } from "@/lib/announcement/templates";
import type { AnnouncementTemplateId } from "@/lib/announcement/types";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface AnnouncementTemplateGalleryProps {
  selectedTemplateId: AnnouncementTemplateId;
  onSelectTemplate: (template: TemplateDefinition) => void;
}

export function AnnouncementTemplateGallery({
  selectedTemplateId,
  onSelectTemplate,
}: AnnouncementTemplateGalleryProps) {
  const renderTemplateIcon = (iconName?: string) => {
    switch (iconName) {
      case "gift":
        return <Gift className="h-4 w-4 text-amber-500 shrink-0" />;
      case "info":
        return <Info className="h-4 w-4 text-white shrink-0" />;
      case "check":
        return <Check className="h-4 w-4 text-white shrink-0" />;
      case "flame":
        return <Flame className="h-4 w-4 text-amber-950 shrink-0" />;
      case "tag":
        return <Tag className="h-4 w-4 text-white shrink-0" />;
      case "clock":
        return <Clock className="h-4 w-4 text-amber-400 shrink-0" />;
      case "star":
        return <Star className="h-4 w-4 text-amber-300 shrink-0" />;
      case "bell":
        return <Bell className="h-4 w-4 text-amber-400 shrink-0" />;
      case "megaphone":
      default:
        return <Megaphone className="h-4 w-4 text-white shrink-0" />;
    }
  };

  return (
    <div className="space-y-3.5">
      <div>
        <h2 className="text-base font-bold text-foreground tracking-tight">Choose a Design Template</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Select a pre-designed template or start with a blank style.
        </p>
      </div>

      <div className="space-y-3 max-h-[calc(100vh-210px)] overflow-y-auto pr-1">
        {ANNOUNCEMENT_TEMPLATES.map((tmpl) => {
          const isSelected = selectedTemplateId === tmpl.id;
          const d = tmpl.defaults;

          return (
            <div
              key={tmpl.id}
              onClick={() => onSelectTemplate(tmpl)}
              className={cn(
                "group flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border p-3.5 transition-all cursor-pointer bg-card hover:bg-muted/40",
                isSelected
                  ? "border-amber-400 bg-amber-400/5 ring-2 ring-amber-400/25 shadow-sm"
                  : "border-border/80"
              )}
            >
              {/* Switch & Title */}
              <div className="flex items-center gap-3 sm:w-36 shrink-0">
                <Switch
                  checked={isSelected}
                  onCheckedChange={() => onSelectTemplate(tmpl)}
                  aria-label={`Select ${tmpl.name}`}
                  className="data-[state=checked]:bg-amber-400"
                />
                <span className="text-xs font-bold text-foreground">
                  {tmpl.name}
                </span>
              </div>

              {/* Large, Prominent Banner Preview matching mockup */}
              <div
                className="relative flex flex-1 items-center justify-between gap-3 overflow-hidden rounded-xl px-4 py-3 min-h-[52px] text-xs font-medium shadow-xs select-none transition-transform group-hover:scale-[1.01]"
                style={{
                  background: d.bgColor,
                  color: d.textColor,
                  border: d.templateId === "minimal" ? "1px solid #cbd5e1" : "none",
                }}
              >
                {/* Banner Content (Icon & Text) */}
                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  {renderTemplateIcon(d.icon)}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold leading-snug line-clamp-2">
                      {d.text}
                    </p>
                  </div>
                </div>

                {/* Banner Action Controls & Close */}
                <div className="flex items-center gap-2.5 shrink-0">
                  {/* Countdown Blocks for Countdown template */}
                  {d.hasCountdown && (
                    <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] font-bold">
                      <span className="rounded bg-black/40 px-1.5 py-0.5 text-white">12d</span>
                      <span className="rounded bg-black/40 px-1.5 py-0.5 text-white">05h</span>
                      <span className="rounded bg-black/40 px-1.5 py-0.5 text-white">30m</span>
                      <span className="rounded bg-black/40 px-1.5 py-0.5 text-white">20s</span>
                    </div>
                  )}

                  {/* CTA Button */}
                  {d.hasButton && (
                    <span
                      className="rounded-lg px-2.5 py-1 text-[11px] font-bold shadow-xs whitespace-nowrap"
                      style={{
                        backgroundColor: d.buttonBgColor,
                        color: d.buttonTextColor,
                      }}
                    >
                      {d.buttonText || "Learn More"}
                    </span>
                  )}

                  {/* Inline Link Preview */}
                  {d.hasLink && (
                    <span className="text-[11px] font-bold underline whitespace-nowrap opacity-90">
                      {d.linkText || "See Dates →"}
                    </span>
                  )}

                  <X className="h-3.5 w-3.5 opacity-60 hover:opacity-100" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
