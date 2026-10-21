import { useRef } from "react";
import { Check, Upload, Image as ImageIcon, MessageCircle, MessageSquare, Phone } from "lucide-react";
import { toast } from "sonner";
import type { ButtonIconType, WidgetPosition, WidgetSize } from "@/lib/whatsapp/types";
import { WhatsAppIcon } from "./WhatsAppLivePreview";
import { cn } from "@/lib/utils";

interface WhatsAppControlsProps {
  position: WidgetPosition;
  onPositionChange: (pos: WidgetPosition) => void;
  buttonSize: WidgetSize;
  onButtonSizeChange: (size: WidgetSize) => void;
  buttonIcon: ButtonIconType;
  onButtonIconChange: (icon: ButtonIconType) => void;
  customIconUrl: string;
  onCustomIconChange: (url: string) => void;
}

export function WhatsAppControls({
  position,
  onPositionChange,
  buttonSize,
  onButtonSizeChange,
  buttonIcon,
  onButtonIconChange,
  customIconUrl,
  onCustomIconChange,
}: WhatsAppControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type: PNG or SVG
    const validTypes = ["image/png", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Only PNG and SVG icons are supported.",
      });
      return;
    }

    // Validate size: max 200KB (204,800 bytes)
    const MAX_SIZE_BYTES = 200 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("File is too large", {
        description: `Max icon size is 200KB. Your file is ${(file.size / 1024).toFixed(1)}KB.`,
      });
      return;
    }

    // Read and convert to data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onCustomIconChange(result);
      onButtonIconChange("custom");
      toast.success("Custom icon uploaded successfully");
    };
    reader.onerror = () => {
      toast.error("Failed to read icon file");
    };
    reader.readAsDataURL(file);
  };

  const positions: { id: WidgetPosition; label: string; dotClass: string }[] = [
    { id: "bottom-left", label: "Bottom Left", dotClass: "bottom-2 left-2" },
    { id: "bottom-right", label: "Bottom Right", dotClass: "bottom-2 right-2" },
    { id: "top-left", label: "Top Left", dotClass: "top-2 left-2" },
    { id: "top-right", label: "Top Right", dotClass: "top-2 right-2" },
  ];

  const icons: { id: ButtonIconType; label: string; component: React.ReactNode }[] = [
    { id: "whatsapp", label: "WhatsApp", component: <WhatsAppIcon className="h-5 w-5 text-emerald-500" /> },
    { id: "message-circle", label: "Message Circle", component: <MessageCircle className="h-5 w-5 text-foreground" /> },
    { id: "speech-bubble", label: "Speech Bubble", component: <MessageSquare className="h-5 w-5 text-foreground" /> },
    { id: "phone", label: "Phone", component: <Phone className="h-5 w-5 text-foreground" /> },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {/* POSITION CONTROL CARD */}
      <div className="rounded-2xl border bg-card p-5 shadow-soft">
        <h3 className="text-sm font-bold text-foreground">Position</h3>
        <p className="text-xs text-muted-foreground mb-4">Choose where to show the chat button.</p>

        <div className="grid grid-cols-2 gap-3">
          {positions.map((p) => {
            const isSelected = position === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onPositionChange(p.id)}
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-xl border p-3 transition-all hover:bg-muted/40 text-center",
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                    : "border-border/80"
                )}
                aria-pressed={isSelected}
              >
                {/* Active checkmark badge */}
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </span>
                )}

                {/* Miniature website wireframe */}
                <div className="relative mb-2 h-14 w-20 rounded-md border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
                  <div className="h-2 border-b border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800" />
                  <span
                    className={cn(
                      "absolute h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-xs",
                      p.dotClass
                    )}
                  />
                </div>
                <span className="text-xs font-semibold text-foreground">{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SIZE, ICON & CUSTOM UPLOAD CARD */}
      <div className="rounded-2xl border bg-card p-5 shadow-soft space-y-4">
        {/* Widget Size */}
        <div>
          <h3 className="text-sm font-bold text-foreground">Widget Size</h3>
          <p className="text-xs text-muted-foreground mb-2.5">Adjust the size of the chat button.</p>
          <div className="grid grid-cols-3 gap-2">
            {(["small", "medium", "large"] as WidgetSize[]).map((sz) => {
              const active = buttonSize === sz;
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onButtonSizeChange(sz)}
                  className={cn(
                    "rounded-xl border py-2 text-xs font-semibold capitalize transition-all",
                    active
                      ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                      : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>

        {/* Button Icon Selector */}
        <div>
          <h4 className="text-xs font-bold text-foreground mb-2">Button Icon</h4>
          <div className="flex flex-wrap gap-2.5">
            {icons.map((item) => {
              const active = buttonIcon === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onButtonIconChange(item.id)}
                  title={item.label}
                  aria-label={item.label}
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all",
                    active
                      ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                      : "border-border hover:bg-muted"
                  )}
                >
                  {item.component}
                  {active && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-white">
                      <Check className="h-2 w-2 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Icon Upload */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-foreground">Custom Icon (Optional)</span>
            {customIconUrl && (
              <button
                type="button"
                onClick={() => {
                  onCustomIconChange("");
                  onButtonIconChange("whatsapp");
                }}
                className="text-[11px] font-medium text-destructive hover:underline"
              >
                Remove
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.svg,image/png,image/svg+xml"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex w-full items-center justify-center gap-3 rounded-xl border border-dashed py-3 px-4 text-xs font-medium transition-all hover:bg-muted/40",
              buttonIcon === "custom" && customIconUrl
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground"
            )}
          >
            {customIconUrl ? (
              <img
                src={customIconUrl}
                alt="Uploaded Icon"
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            )}
            <div className="text-left">
              <span className="font-semibold block text-foreground">
                {customIconUrl ? "Custom Icon Applied" : "Upload Icon"}
              </span>
              <span className="text-[10px] text-muted-foreground block">
                PNG, SVG (max 200KB)
              </span>
            </div>
            <Upload className="ml-auto h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
