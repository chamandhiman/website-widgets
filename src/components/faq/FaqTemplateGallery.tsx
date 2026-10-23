import type { FC } from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { FAQ_TEMPLATES, type FaqTemplateDefinition } from "@/lib/faq/templates";
import type { FaqTemplateId } from "@/lib/faq/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FaqTemplateGalleryProps {
  selectedTemplate: FaqTemplateId;
  onSelectTemplate: (template: FaqTemplateDefinition) => void;
  onConfirmTemplate?: (template: FaqTemplateDefinition) => void;
  className?: string;
}

export const FaqTemplateGallery: FC<FaqTemplateGalleryProps> = ({
  selectedTemplate,
  onSelectTemplate,
  onConfirmTemplate,
  className,
}) => {
  const activeTmpl =
    FAQ_TEMPLATES.find((t) => t.id === selectedTemplate) || FAQ_TEMPLATES[0];

  return (
    <div className={cn("flex h-full flex-col bg-card", className)}>
      {/* Header */}
      <div className="border-b border-border/60 p-4 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">Choose a Design Template</h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:text-purple-300">
            <Sparkles className="h-2.5 w-2.5 text-purple-600" />
            10 Layouts
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Select a layout preset. Your questions and custom styling will be preserved.
        </p>
      </div>

      {/* Gallery Cards Grid */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 scrollbar-thin">
        <div className="grid grid-cols-2 gap-2.5">
          {FAQ_TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplate === tmpl.id;

            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => onSelectTemplate(tmpl)}
                className={cn(
                  "group relative flex flex-col items-center rounded-xl border p-2 text-left transition-all duration-150 focus:outline-hidden",
                  isSelected
                    ? "border-purple-600 bg-purple-500/5 ring-1 ring-purple-600 shadow-xs"
                    : "border-border/70 bg-card hover:border-border hover:bg-muted/40 hover:shadow-2xs"
                )}
                aria-pressed={isSelected}
              >
                {/* Selected Check Badge */}
                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 z-10 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-purple-600 text-white shadow-xs animate-in zoom-in-75 duration-100">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </span>
                )}

                {/* Miniature Visual Mockup Frame */}
                <div className="relative mb-2 flex h-24 w-full items-center justify-center overflow-hidden rounded-lg border border-border/50 bg-muted/30 p-1.5 transition-transform group-hover:scale-[1.02]">
                  <TemplateMiniaturePreview id={tmpl.id} />
                </div>

                {/* Title & Tag */}
                <div className="w-full text-left">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-bold text-foreground leading-tight truncate">
                      {tmpl.number}. {tmpl.name}
                    </span>
                    <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">
                      {tmpl.tag}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-1 leading-tight">
                    {tmpl.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Action Bar with Use This Template Button */}
      {activeTmpl && (
        <div className="sticky bottom-0 border-t border-border/80 bg-card/95 backdrop-blur-xs p-3 flex items-center justify-between gap-3 shadow-sm shrink-0">
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
              Selected Template
            </p>
            <p className="text-xs font-bold text-foreground truncate">
              {activeTmpl.name}
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              if (onConfirmTemplate) {
                onConfirmTemplate(activeTmpl);
              } else {
                onSelectTemplate(activeTmpl);
              }
            }}
            className="h-8 px-4 text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <span>Use This Template</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
};

/**
 * Miniature visual thumbnail representing the unique visual structure of each template.
 */
function TemplateMiniaturePreview({ id }: { id: FaqTemplateId }) {
  switch (id) {
    case "classic":
      return (
        <div className="w-full h-full bg-white rounded p-1.5 flex flex-col justify-between shadow-2xs border border-slate-200">
          <div className="h-1.5 w-1/2 bg-slate-800 rounded-full mb-1" />
          <div className="flex-1 flex flex-col justify-around py-0.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
              <div className="h-1 w-3/4 bg-slate-700 rounded-full" />
              <div className="h-1 w-1 bg-purple-600 rounded-full" />
            </div>
            <div className="pl-1 py-0.5">
              <div className="h-0.5 w-full bg-slate-300 rounded-full" />
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
              <div className="h-1 w-2/3 bg-slate-600 rounded-full" />
              <div className="h-1 w-1 bg-purple-600 rounded-full" />
            </div>
          </div>
        </div>
      );

    case "minimal":
      return (
        <div className="w-full h-full bg-slate-50/80 rounded p-1.5 flex flex-col justify-around">
          <div className="h-1 w-1/3 bg-slate-700 rounded-full" />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="h-1 w-3/5 bg-slate-600 rounded-full" />
              <div className="text-[8px] font-bold text-slate-400 leading-none">+</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-1 w-4/5 bg-slate-600 rounded-full" />
              <div className="text-[8px] font-bold text-slate-400 leading-none">+</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-1 w-1/2 bg-slate-600 rounded-full" />
              <div className="text-[8px] font-bold text-slate-400 leading-none">+</div>
            </div>
          </div>
        </div>
      );

    case "card":
      return (
        <div className="w-full h-full rounded p-1 flex flex-col justify-around gap-1 bg-slate-100/70">
          <div className="bg-white rounded-md p-1 border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div className="h-1 w-3/4 bg-slate-800 rounded-full" />
            <div className="h-1 w-1 bg-purple-600 rounded-full" />
          </div>
          <div className="bg-white rounded-md p-1 border border-slate-200/80 shadow-2xs flex flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <div className="h-1 w-2/3 bg-slate-800 rounded-full" />
              <div className="h-1 w-1 bg-purple-600 rounded-full" />
            </div>
            <div className="h-0.5 w-full bg-slate-300 rounded-full" />
          </div>
          <div className="bg-white rounded-md p-1 border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div className="h-1 w-1/2 bg-slate-800 rounded-full" />
            <div className="h-1 w-1 bg-purple-600 rounded-full" />
          </div>
        </div>
      );

    case "bordered":
      return (
        <div className="w-full h-full bg-white rounded-md p-1.5 border-2 border-slate-300 flex flex-col justify-between">
          <div className="h-1.5 w-1/2 bg-blue-600 rounded-full mb-1" />
          <div className="space-y-1">
            <div className="border border-slate-300 rounded p-0.5 flex items-center justify-between">
              <div className="h-1 w-3/4 bg-slate-700 rounded-full" />
              <div className="h-1 w-1 bg-blue-600 rounded-full" />
            </div>
            <div className="border border-slate-300 rounded p-0.5 flex items-center justify-between">
              <div className="h-1 w-2/3 bg-slate-700 rounded-full" />
              <div className="h-1 w-1 bg-blue-600 rounded-full" />
            </div>
          </div>
        </div>
      );

    case "two-column":
      return (
        <div className="w-full h-full bg-white rounded p-1 flex flex-col justify-between border border-slate-200">
          <div className="h-1 w-1/3 bg-slate-800 rounded-full mb-1" />
          <div className="grid grid-cols-2 gap-1 flex-1 items-start">
            <div className="bg-slate-50 border border-slate-200 rounded p-1 space-y-0.5">
              <div className="h-1 w-3/4 bg-slate-700 rounded-full" />
              <div className="h-0.5 w-full bg-slate-300 rounded-full" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded p-1 space-y-0.5">
              <div className="h-1 w-3/4 bg-slate-700 rounded-full" />
              <div className="h-0.5 w-full bg-slate-300 rounded-full" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded p-1">
              <div className="h-1 w-2/3 bg-slate-700 rounded-full" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded p-1">
              <div className="h-1 w-2/3 bg-slate-700 rounded-full" />
            </div>
          </div>
        </div>
      );

    case "help-center":
      return (
        <div className="w-full h-full bg-white rounded p-1.5 flex flex-col justify-between border border-sky-200 shadow-2xs">
          <div className="text-center space-y-0.5">
            <div className="h-1.5 w-1/2 bg-sky-700 rounded-full mx-auto" />
            <div className="h-2 w-full bg-sky-50 border border-sky-300 rounded-full flex items-center px-1">
              <div className="h-1 w-1/3 bg-sky-300 rounded-full" />
            </div>
          </div>
          <div className="flex gap-1 justify-center my-0.5">
            <div className="h-1.5 w-5 bg-sky-500 rounded-full" />
            <div className="h-1.5 w-5 bg-slate-200 rounded-full" />
            <div className="h-1.5 w-5 bg-slate-200 rounded-full" />
          </div>
          <div className="border border-slate-100 rounded p-0.5 flex items-center justify-between">
            <div className="h-1 w-3/4 bg-slate-700 rounded-full" />
            <div className="h-1 w-1 bg-sky-500 rounded-full" />
          </div>
        </div>
      );

    case "category-based":
      return (
        <div className="w-full h-full bg-white rounded p-1.5 flex flex-col justify-between border border-emerald-200">
          <div className="flex gap-1 border-b border-slate-200 pb-1">
            <div className="h-2 w-6 bg-emerald-500 rounded text-[6px] text-white text-center font-bold">All</div>
            <div className="h-2 w-6 bg-slate-100 rounded" />
            <div className="h-2 w-6 bg-slate-100 rounded" />
          </div>
          <div className="space-y-1">
            <div className="bg-emerald-50/60 border border-emerald-100 rounded p-0.5 flex items-center justify-between">
              <div className="h-1 w-3/4 bg-slate-800 rounded-full" />
              <div className="h-1 w-1 bg-emerald-500 rounded-full" />
            </div>
            <div className="bg-emerald-50/60 border border-emerald-100 rounded p-0.5 flex items-center justify-between">
              <div className="h-1 w-2/3 bg-slate-800 rounded-full" />
              <div className="h-1 w-1 bg-emerald-500 rounded-full" />
            </div>
          </div>
        </div>
      );

    case "compact":
      return (
        <div className="w-full h-full bg-white rounded p-1 border border-slate-200 flex flex-col justify-around">
          <div className="h-1 w-1/2 bg-slate-800 rounded-full mb-0.5" />
          <div className="space-y-0.5">
            <div className="flex items-center justify-between border-b border-slate-100 py-0.5">
              <div className="h-0.5 w-3/4 bg-slate-600 rounded-full" />
              <div className="h-0.5 w-1 bg-purple-500 rounded-full" />
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 py-0.5">
              <div className="h-0.5 w-2/3 bg-slate-600 rounded-full" />
              <div className="h-0.5 w-1 bg-purple-500 rounded-full" />
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 py-0.5">
              <div className="h-0.5 w-4/5 bg-slate-600 rounded-full" />
              <div className="h-0.5 w-1 bg-purple-500 rounded-full" />
            </div>
            <div className="flex items-center justify-between py-0.5">
              <div className="h-0.5 w-1/2 bg-slate-600 rounded-full" />
              <div className="h-0.5 w-1 bg-purple-500 rounded-full" />
            </div>
          </div>
        </div>
      );

    case "highlighted":
      return (
        <div className="w-full h-full bg-white rounded p-1 flex flex-col justify-around gap-1">
          <div className="border-l-2 border-amber-500 bg-amber-50/50 rounded-r p-1 flex items-center justify-between">
            <div className="h-1 w-2/3 bg-amber-900 rounded-full" />
            <div className="h-1.5 w-3 bg-amber-200 rounded text-[5px] text-amber-800 text-center font-bold">★</div>
          </div>
          <div className="border-l-2 border-slate-300 bg-slate-50 rounded-r p-1 flex items-center justify-between">
            <div className="h-1 w-3/4 bg-slate-700 rounded-full" />
            <div className="h-1 w-1 bg-slate-400 rounded-full" />
          </div>
          <div className="border-l-2 border-slate-300 bg-slate-50 rounded-r p-1 flex items-center justify-between">
            <div className="h-1 w-1/2 bg-slate-700 rounded-full" />
            <div className="h-1 w-1 bg-slate-400 rounded-full" />
          </div>
        </div>
      );

    case "dark":
      return (
        <div className="w-full h-full bg-slate-900 rounded p-1.5 flex flex-col justify-between border border-slate-800 shadow-md">
          <div className="h-1.5 w-1/2 bg-white rounded-full mb-1" />
          <div className="space-y-1">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded p-1 flex items-center justify-between">
              <div className="h-1 w-3/4 bg-slate-200 rounded-full" />
              <div className="h-1 w-1 bg-purple-400 rounded-full shadow-[0_0_6px_#a855f7]" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded p-1 flex items-center justify-between">
              <div className="h-1 w-2/3 bg-slate-200 rounded-full" />
              <div className="h-1 w-1 bg-purple-400 rounded-full shadow-[0_0_6px_#a855f7]" />
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
