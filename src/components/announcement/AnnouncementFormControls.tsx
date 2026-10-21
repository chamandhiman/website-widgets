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
  X as XIcon,
  HelpCircle,
} from "lucide-react";
import type {
  AnnouncementBarConfig,
  AnnouncementIcon,
  AnnouncementPosition,
} from "@/lib/announcement/types";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface AnnouncementFormControlsProps {
  config: AnnouncementBarConfig;
  onChange: <K extends keyof AnnouncementBarConfig>(
    key: K,
    value: AnnouncementBarConfig[K]
  ) => void;
  errors?: Record<string, string>;
}

const ICONS: { id: AnnouncementIcon; label: string; component: React.ReactNode }[] = [
  { id: "megaphone", label: "Megaphone", component: <Megaphone className="h-4 w-4" /> },
  { id: "gift", label: "Gift", component: <Gift className="h-4 w-4" /> },
  { id: "info", label: "Info", component: <Info className="h-4 w-4" /> },
  { id: "tag", label: "Tag", component: <Tag className="h-4 w-4" /> },
  { id: "bell", label: "Bell", component: <Bell className="h-4 w-4" /> },
  { id: "star", label: "Star", component: <Star className="h-4 w-4" /> },
  { id: "flame", label: "Flame", component: <Flame className="h-4 w-4" /> },
  { id: "check", label: "Checkmark", component: <Check className="h-4 w-4" /> },
  { id: "none", label: "None", component: <XIcon className="h-4 w-4" /> },
];

const BG_SWATCHES = [
  { label: "Dark Navy", value: "#0F172A" },
  { label: "Purple", value: "#8B5CF6" },
  { label: "Blue", value: "#2563EB" },
  { label: "Green", value: "#16A34A" },
  { label: "Orange", value: "#F59E0B" },
  { label: "Red", value: "#EF4444" },
  { label: "Gradient", value: "linear-gradient(135deg, #6366F1, #EC4899)" },
];

const TEXT_SWATCHES = [
  { label: "White", value: "#FFFFFF" },
  { label: "Black", value: "#000000" },
  { label: "Yellow", value: "#FACC15" },
];

const BUTTON_SWATCHES = [
  { label: "Yellow", value: "#FACC15" },
  { label: "Black", value: "#000000" },
  { label: "Red", value: "#EF4444" },
  { label: "Pink", value: "#EC4899" },
  { label: "White", value: "#FFFFFF" },
];

export function AnnouncementFormControls({
  config,
  onChange,
  errors = {},
}: AnnouncementFormControlsProps) {
  return (
    <div className="space-y-6">
      {/* ================= 1. CONTENT ================= */}
      <div className="rounded-2xl border bg-card p-5 shadow-soft space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shrink-0">
            1
          </span>
          <div>
            <h3 className="text-sm font-bold text-foreground">Content</h3>
            <p className="text-xs text-muted-foreground">
              Set the message and icon for your announcement bar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-start">
          {/* Announcement Text */}
          <div className="lg:col-span-8 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">
                Announcement Text <span className="text-destructive">*</span>
              </label>
              <span className="text-[11px] font-mono text-muted-foreground">
                {config.text.length}/200
              </span>
            </div>
            <Input
              value={config.text}
              maxLength={200}
              onChange={(e) => onChange("text", e.target.value)}
              placeholder="e.g. 2027 Winter and Spring Schedules are now open!"
              className={cn("text-xs h-9", errors.text && "border-destructive focus-visible:ring-destructive")}
            />
            {errors.text && (
              <p className="text-[11px] text-destructive font-medium">{errors.text}</p>
            )}
          </div>

          {/* Icon Selector */}
          <div className="lg:col-span-4 space-y-1.5">
            <label className="text-xs font-bold text-foreground block">Icon (Optional)</label>
            <div className="flex flex-wrap gap-1.5">
              {ICONS.map((ico) => {
                const isSelected = config.icon === ico.id;
                return (
                  <button
                    key={ico.id}
                    type="button"
                    title={ico.label}
                    onClick={() => onChange("icon", ico.id)}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg border transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {ico.component}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Multi-line extras if template is multi-line */}
        {config.templateId === "multi-line" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2 border-t">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Headline (Optional)</label>
              <Input
                value={config.headline || ""}
                onChange={(e) => onChange("headline", e.target.value)}
                placeholder="e.g. Special Announcement"
                className="text-xs h-8"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Secondary Text (Optional)</label>
              <Input
                value={config.secondaryText || ""}
                onChange={(e) => onChange("secondaryText", e.target.value)}
                placeholder="e.g. Available for limited time"
                className="text-xs h-8"
              />
            </div>
          </div>
        )}
      </div>

      {/* ================= 2. ACTION (OPTIONAL) ================= */}
      <div className="rounded-2xl border bg-card p-5 shadow-soft space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shrink-0">
            2
          </span>
          <div>
            <h3 className="text-sm font-bold text-foreground">Action (Optional)</h3>
            <p className="text-xs text-muted-foreground">
              Add a button and link to drive more engagement.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Button Text */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Button Text</label>
            <Input
              value={config.buttonText}
              onChange={(e) => {
                onChange("buttonText", e.target.value);
                if (e.target.value.trim() && !config.hasButton) {
                  onChange("hasButton", true);
                }
              }}
              placeholder="e.g. Learn More"
              className="text-xs h-9"
            />
          </div>

          {/* Button Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Button Link</label>
            <Input
              value={config.buttonLink}
              onChange={(e) => onChange("buttonLink", e.target.value)}
              placeholder="https://"
              className={cn("text-xs h-9", errors.buttonLink && "border-destructive")}
            />
            {errors.buttonLink && (
              <p className="text-[11px] text-destructive font-medium">{errors.buttonLink}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-1">
          <Checkbox
            id="open-in-new-tab"
            checked={config.openInNewTab}
            onCheckedChange={(checked) => onChange("openInNewTab", Boolean(checked))}
          />
          <label
            htmlFor="open-in-new-tab"
            className="text-xs font-medium text-foreground cursor-pointer select-none"
          >
            Open in new tab
          </label>
        </div>
      </div>

      {/* ================= 3. STYLE ================= */}
      <div className="rounded-2xl border bg-card p-5 shadow-soft space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shrink-0">
            3
          </span>
          <div>
            <h3 className="text-sm font-bold text-foreground">Style</h3>
            <p className="text-xs text-muted-foreground">
              Customize colors and text appearance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
          {/* Background Color */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground block">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.bgColor.startsWith("#") ? config.bgColor : "#0F172A"}
                onChange={(e) => onChange("bgColor", e.target.value)}
                className="h-8 w-10 cursor-pointer rounded-md border bg-transparent p-0.5"
                title="Custom color picker"
              />
              <div className="flex flex-wrap gap-1">
                {BG_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.label}
                    type="button"
                    title={swatch.label}
                    onClick={() => onChange("bgColor", swatch.value)}
                    className={cn(
                      "h-6 w-6 rounded-full border transition-transform hover:scale-110",
                      config.bgColor === swatch.value && "ring-2 ring-primary ring-offset-1"
                    )}
                    style={{ background: swatch.value }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Text Color */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground block">Text Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.textColor.startsWith("#") ? config.textColor : "#FFFFFF"}
                onChange={(e) => onChange("textColor", e.target.value)}
                className="h-8 w-10 cursor-pointer rounded-md border bg-transparent p-0.5"
                title="Custom text color"
              />
              <div className="flex gap-1.5">
                {TEXT_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.label}
                    type="button"
                    title={swatch.label}
                    onClick={() => onChange("textColor", swatch.value)}
                    className={cn(
                      "h-6 w-6 rounded-full border transition-transform hover:scale-110",
                      config.textColor === swatch.value && "ring-2 ring-primary ring-offset-1"
                    )}
                    style={{ backgroundColor: swatch.value }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Button Color */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground block">Button Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.buttonBgColor.startsWith("#") ? config.buttonBgColor : "#FACC15"}
                onChange={(e) => onChange("buttonBgColor", e.target.value)}
                className="h-8 w-10 cursor-pointer rounded-md border bg-transparent p-0.5"
                title="Custom button color"
              />
              <div className="flex gap-1.5">
                {BUTTON_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.label}
                    type="button"
                    title={swatch.label}
                    onClick={() => onChange("buttonBgColor", swatch.value)}
                    className={cn(
                      "h-6 w-6 rounded-full border transition-transform hover:scale-110",
                      config.buttonBgColor === swatch.value && "ring-2 ring-primary ring-offset-1"
                    )}
                    style={{ backgroundColor: swatch.value }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground block">Font Size</label>
            <Select value={config.fontSize} onValueChange={(v) => onChange("fontSize", v)}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["12px", "13px", "14px", "15px", "16px", "18px"].map((sz) => (
                  <SelectItem key={sz} value={sz}>
                    {sz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Height / Vertical Padding Slider */}
        <div className="space-y-1.5 pt-2 border-t">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-foreground">Bar Padding (Vertical Spacing)</span>
            <span className="font-mono text-muted-foreground">{config.padding}px</span>
          </div>
          <Slider
            min={6}
            max={24}
            step={2}
            value={[config.padding]}
            onValueChange={(val) => onChange("padding", val[0] ?? 12)}
          />
        </div>
      </div>

      {/* ================= 4, 5, 6 GRID ================= */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* 4. POSITION */}
        <div className="rounded-2xl border bg-card p-5 shadow-soft space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shrink-0">
              4
            </span>
            <h4 className="text-xs font-bold text-foreground">Position</h4>
          </div>
          <p className="text-[11px] text-muted-foreground">Choose where to show the bar.</p>

          <div className="space-y-2 pt-1">
            <label
              onClick={() => onChange("position", "top")}
              className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer"
            >
              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full border",
                  config.position === "top"
                    ? "border-primary bg-primary text-white"
                    : "border-muted-foreground/40"
                )}
              >
                {config.position === "top" && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </span>
              Top of Website
            </label>

            <label
              onClick={() => onChange("position", "bottom")}
              className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer"
            >
              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full border",
                  config.position === "bottom"
                    ? "border-primary bg-primary text-white"
                    : "border-muted-foreground/40"
                )}
              >
                {config.position === "bottom" && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </span>
              Bottom of Website
            </label>
          </div>

          <div className="pt-2 border-t flex items-center space-x-2">
            <Checkbox
              id="sticky-toggle"
              checked={config.isSticky}
              onCheckedChange={(checked) => onChange("isSticky", Boolean(checked))}
            />
            <label htmlFor="sticky-toggle" className="text-[11px] font-medium text-muted-foreground cursor-pointer select-none">
              Sticky (Fixed to Viewport)
            </label>
          </div>
        </div>

        {/* 5. VISIBILITY */}
        <div className="rounded-2xl border bg-card p-5 shadow-soft space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shrink-0">
              5
            </span>
            <h4 className="text-xs font-bold text-foreground">Visibility</h4>
          </div>
          <p className="text-[11px] text-muted-foreground">Show on which pages.</p>

          <Select
            value={config.pageTarget}
            onValueChange={(v) => onChange("pageTarget", v as typeof config.pageTarget)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pages</SelectItem>
              <SelectItem value="homepage">Homepage Only</SelectItem>
              <SelectItem value="custom">Specific Paths</SelectItem>
            </SelectContent>
          </Select>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-desktop"
                checked={config.showDesktop}
                onCheckedChange={(c) => onChange("showDesktop", Boolean(c))}
              />
              <label htmlFor="show-desktop" className="text-[11px] font-medium text-foreground cursor-pointer select-none">
                Show on Desktop
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-tablet"
                checked={config.showTablet}
                onCheckedChange={(c) => onChange("showTablet", Boolean(c))}
              />
              <label htmlFor="show-tablet" className="text-[11px] font-medium text-foreground cursor-pointer select-none">
                Show on Tablet
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-mobile"
                checked={config.showMobile}
                onCheckedChange={(c) => onChange("showMobile", Boolean(c))}
              />
              <label htmlFor="show-mobile" className="text-[11px] font-medium text-foreground cursor-pointer select-none">
                Show on Mobile
              </label>
            </div>
          </div>
        </div>

        {/* 6. DISPLAY OPTIONS */}
        <div className="rounded-2xl border bg-card p-5 shadow-soft space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shrink-0">
              6
            </span>
            <h4 className="text-xs font-bold text-foreground">Display Options</h4>
          </div>
          <p className="text-[11px] text-muted-foreground">Dismissal & animation rules.</p>

          <div className="space-y-2 pt-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-close"
                checked={config.showCloseButton}
                onCheckedChange={(c) => onChange("showCloseButton", Boolean(c))}
              />
              <label htmlFor="show-close" className="text-[11px] font-medium text-foreground cursor-pointer select-none">
                Show Close Button
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allow-dismiss"
                checked={config.allowDismiss}
                onCheckedChange={(c) => onChange("allowDismiss", Boolean(c))}
              />
              <label htmlFor="allow-dismiss" className="text-[11px] font-medium text-foreground cursor-pointer select-none">
                Allow Dismiss ({config.dismissDays} days)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="animate-slide"
                checked={config.animateSlideDown}
                onCheckedChange={(c) => onChange("animateSlideDown", Boolean(c))}
              />
              <label htmlFor="animate-slide" className="text-[11px] font-medium text-foreground cursor-pointer select-none">
                Animate Slide Down
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ================= COUNTDOWN TIMER SETTINGS (WHEN APPLICABLE) ================= */}
      {config.hasCountdown && (
        <div className="rounded-2xl border bg-card p-5 shadow-soft space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <div>
              <h4 className="text-sm font-bold text-foreground">Countdown Timer Settings</h4>
              <p className="text-xs text-muted-foreground">
                Configure the end timestamp and expiration behavior.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Target Date & Time</label>
              <Input
                type="datetime-local"
                value={config.countdownTarget.slice(0, 16)}
                onChange={(e) => onChange("countdownTarget", e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Timezone Strategy</label>
              <Select
                value={config.countdownTimezone}
                onValueChange={(v) => onChange("countdownTimezone", v as "local" | "UTC")}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Visitor's Local Time</SelectItem>
                  <SelectItem value="UTC">UTC (Universal Coordinated Time)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">When Timer Ends</label>
              <Select
                value={config.countdownExpireAction}
                onValueChange={(v) => onChange("countdownExpireAction", v as typeof config.countdownExpireAction)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="message">Display Custom Message</SelectItem>
                  <SelectItem value="hide">Hide Announcement Bar</SelectItem>
                  <SelectItem value="keep">Keep Bar at 00:00:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
