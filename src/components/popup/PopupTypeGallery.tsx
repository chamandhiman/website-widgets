import type { FC } from "react";
import { Check } from "lucide-react";
import { POPUP_TEMPLATES, type PopupTemplateDefinition } from "@/lib/popup/templates";
import type { PopupType } from "@/lib/popup/types";
import { cn } from "@/lib/utils";

interface PopupTypeGalleryProps {
  selectedTemplate: PopupType;
  onSelectTemplate: (template: PopupTemplateDefinition) => void;
}

export const PopupTypeGallery: FC<PopupTypeGalleryProps> = ({
  selectedTemplate,
  onSelectTemplate,
}) => {
  return (
    <div className="flex h-full flex-col bg-card border-r border-border/80">
      {/* Header */}
      <div className="border-b border-border/60 p-4">
        <h2 className="text-sm font-bold text-foreground">Choose a Popup Type</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Select a popup style to get started. You can customize it later.
        </p>
      </div>

      {/* Gallery Cards Grid */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 scrollbar-thin">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2">
          {POPUP_TEMPLATES.map((tmpl) => {
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

                {/* Title & Caption */}
                <div className="w-full text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-bold text-foreground leading-tight truncate">
                      {tmpl.number}. {tmpl.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                    {tmpl.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Realistic miniature illustrations matching mockup designs
function TemplateMiniaturePreview({ id }: { id: PopupType }) {
  switch (id) {
    case "center":
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-white rounded shadow-2xs p-1">
          {/* Gift Box with Ribbon & Confetti */}
          <div className="relative flex items-center justify-center">
            <span className="text-xl">🎁</span>
            <span className="absolute -top-1 -right-2 text-[8px]">✨</span>
            <span className="absolute -bottom-1 -left-2 text-[8px] text-purple-500">🎉</span>
          </div>
          <span className="text-[7px] font-bold text-gray-800 mt-0.5">Special Offer!</span>
          <div className="h-1.5 w-12 bg-purple-600 rounded-full mt-1" />
        </div>
      );

    case "newsletter":
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-white rounded shadow-2xs p-1.5">
          <span className="text-xs">✉️</span>
          <span className="text-[7px] font-bold text-gray-800 mt-0.5">Join Our Newsletter</span>
          <div className="h-2 w-full max-w-[56px] border border-gray-300 rounded-xs bg-gray-50 mt-1" />
          <div className="h-1.5 w-10 bg-purple-600 rounded-full mt-0.5" />
        </div>
      );

    case "image":
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-amber-100 to-orange-200 rounded shadow-2xs p-1 relative overflow-hidden">
          <div className="absolute top-1 left-1.5">
            <span className="text-[7px] font-black text-rose-600 leading-none">BIG SALE</span>
          </div>
          <span className="text-2xl mt-1">🛍️</span>
          <div className="h-1.5 w-10 bg-rose-600 rounded-full mt-0.5" />
        </div>
      );

    case "bottom-small":
      return (
        <div className="flex items-end justify-end w-full h-full p-1">
          <div className="flex items-center gap-1 bg-white border border-border shadow-xs rounded px-1.5 py-1 w-full max-w-[68px]">
            <span className="text-xs">🔔</span>
            <div className="flex flex-col">
              <span className="text-[6px] font-bold text-gray-800 leading-tight">Don't miss out!</span>
              <span className="text-[5px] text-muted-foreground">1.2k viewing</span>
            </div>
          </div>
        </div>
      );

    case "slide-in":
      return (
        <div className="flex items-center justify-end w-full h-full p-0.5">
          <div className="flex flex-col items-center bg-white border-l-2 border-purple-600 shadow-xs rounded-l px-1 py-1 h-[80%] w-[54px]">
            <span className="text-[6px] font-bold text-gray-800">Get 20% Off!</span>
            <span className="text-[5px] text-muted-foreground mt-0.5">Claim promo</span>
            <div className="h-1.5 w-8 bg-purple-600 rounded-full mt-auto" />
          </div>
        </div>
      );

    case "exit-intent":
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-white rounded shadow-2xs p-1">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <span className="text-xs">🛑</span>
          </div>
          <span className="text-[6px] font-bold text-gray-800 mt-1">Wait Before You Go...</span>
          <div className="h-1.5 w-10 bg-rose-600 rounded-full mt-1" />
        </div>
      );

    case "announcement":
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-white rounded shadow-2xs p-1.5">
          <span className="text-base">📢</span>
          <span className="text-[7px] font-bold text-gray-800 mt-0.5">Important Update</span>
          <span className="text-[5px] text-muted-foreground text-center">New release is live</span>
          <div className="h-1.5 w-11 bg-purple-600 rounded-full mt-1" />
        </div>
      );

    case "video":
      return (
        <div className="relative flex flex-col items-center justify-center w-full h-full bg-slate-900 rounded shadow-2xs overflow-hidden">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-xs">
            <div className="w-0 h-0 border-y-[3.5px] border-y-transparent border-l-[6px] border-l-slate-900 ml-0.5" />
          </div>
          <span className="text-[6px] font-semibold text-white/90 mt-1">Product Demo</span>
        </div>
      );

    case "age-verification":
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-white rounded shadow-2xs p-1">
          <div className="flex h-5 w-5 items-center justify-center rounded-full border-1.5 border-rose-600 text-rose-600 font-bold text-[7px]">
            18+
          </div>
          <span className="text-[6px] font-bold text-gray-800 mt-0.5">Are You 18 or Older?</span>
          <div className="flex gap-1 mt-1">
            <span className="px-1 py-0.5 text-[5px] bg-purple-600 text-white rounded-xs">Yes</span>
            <span className="px-1 py-0.5 text-[5px] bg-gray-200 text-gray-700 rounded-xs">No</span>
          </div>
        </div>
      );

    case "custom-html":
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-slate-50 border border-slate-200 rounded shadow-2xs p-1.5 font-mono">
          <span className="text-base text-purple-600 font-bold">&lt;/&gt;</span>
          <span className="text-[7px] font-bold text-gray-800 mt-0.5">Custom HTML</span>
          <span className="text-[5px] text-muted-foreground">Embed snippets</span>
        </div>
      );

    default:
      return null;
  }
}
