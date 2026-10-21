import { useState, type FC } from "react";
import {
  Sparkles,
  Sliders,
  Megaphone,
  Gift,
  Info,
  Check,
  Flame,
  Tag,
  Bell,
  Star,
  X as XIcon,
  ChevronDown,
  Settings2,
} from "lucide-react";
import type {
  AnnouncementBarConfig,
  AnnouncementIcon,
  AnnouncementPosition,
} from "@/lib/announcement/types";
import { ANNOUNCEMENT_TEMPLATES, type TemplateDefinition } from "@/lib/announcement/templates";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface AnnouncementConfigTabsProps {
  config: AnnouncementBarConfig;
  onChange: <K extends keyof AnnouncementBarConfig>(
    key: K,
    value: AnnouncementBarConfig[K]
  ) => void;
  onSelectTemplate: (template: TemplateDefinition) => void;
  errors?: Record<string, string>;
  onPublish?: () => void;
  isPublishing?: boolean;
  onCancel?: () => void;
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
  { label: "Dark Burgundy", value: "#4A1525" },
  { label: "Dark Navy", value: "#0F172A" },
  { label: "Red", value: "#EF4444" },
  { label: "Blue", value: "#2563EB" },
  { label: "Teal", value: "#0D9488" },
  { label: "Orange", value: "#F59E0B" },
  { label: "Purple", value: "#8B5CF6" },
  { label: "Dark Slate", value: "#1E293B" },
  { label: "White", value: "#FFFFFF" },
  { label: "Gradient", value: "linear-gradient(135deg, #6366F1, #EC4899)" },
];

const TEXT_SWATCHES = [
  { label: "White", value: "#FFFFFF" },
  { label: "Yellow", value: "#FACC15" },
  { label: "Green", value: "#22C55E" },
  { label: "Black", value: "#000000" },
];

const BUTTON_SWATCHES = [
  { label: "Yellow", value: "#FACC15" },
  { label: "White", value: "#FFFFFF" },
  { label: "Black", value: "#000000" },
  { label: "Red", value: "#EF4444" },
  { label: "Pink", value: "#EC4899" },
];

export const AnnouncementConfigTabs: FC<AnnouncementConfigTabsProps> = ({
  config,
  onChange,
  onSelectTemplate,
  errors = {},
  onPublish,
  isPublishing = false,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState("design");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const renderTemplateIcon = (iconName?: string) => {
    switch (iconName) {
      case "gift":
        return <Gift className="h-3 w-3 text-amber-500 shrink-0" />;
      case "info":
        return <Info className="h-3 w-3 text-white shrink-0" />;
      case "check":
        return <Check className="h-3 w-3 text-white shrink-0" />;
      case "flame":
        return <Flame className="h-3 w-3 text-amber-950 shrink-0" />;
      case "tag":
        return <Tag className="h-3 w-3 text-white shrink-0" />;
      case "clock":
        return <Bell className="h-3 w-3 text-amber-400 shrink-0" />;
      case "star":
        return <Star className="h-3 w-3 text-amber-300 shrink-0" />;
      case "bell":
        return <Bell className="h-3 w-3 text-amber-400 shrink-0" />;
      case "megaphone":
      default:
        return <Megaphone className="h-3 w-3 text-white shrink-0" />;
    }
  };

  return (
    <div className="flex h-full flex-col bg-card rounded-2xl border p-4 sm:p-5 shadow-xs overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col min-h-0">
        {/* Two Main Tabs: Design & Preferences */}
        <div className="pb-3 border-b border-border/60">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-xl h-11">
            <TabsTrigger
              value="design"
              className="flex items-center justify-center gap-2 rounded-lg text-xs py-2 font-bold transition-all data-[state=active]:bg-amber-400 data-[state=active]:text-amber-950 data-[state=active]:shadow-xs"
            >
              <Sparkles className="h-4 w-4" />
              <span>Design</span>
              <span className="rounded-full bg-black/15 dark:bg-black/30 px-1.5 py-0.5 text-[10px] font-black">
                {ANNOUNCEMENT_TEMPLATES.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="flex items-center justify-center gap-2 rounded-lg text-xs py-2 font-bold transition-all data-[state=active]:bg-amber-400 data-[state=active]:text-amber-950 data-[state=active]:shadow-xs"
            >
              <Sliders className="h-4 w-4" />
              <span>Preferences</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ================= TAB 1: DESIGN ================= */}
        <TabsContent value="design" className="m-0 flex-1 overflow-y-auto pt-3 space-y-3 scrollbar-thin">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Select Template Preset
            </h3>
            <span className="text-[11px] text-muted-foreground">
              {ANNOUNCEMENT_TEMPLATES.length} templates
            </span>
          </div>

          <div className="space-y-2.5 pb-2">
            {ANNOUNCEMENT_TEMPLATES.map((tmpl) => {
              const isSelected = config.templateId === tmpl.id;
              const d = tmpl.defaults;

              return (
                <div
                  key={tmpl.id}
                  onClick={() => onSelectTemplate(tmpl)}
                  className={cn(
                    "group flex items-center justify-between gap-3 rounded-xl border p-2.5 sm:p-3 transition-all cursor-pointer bg-card hover:bg-muted/40",
                    isSelected
                      ? "border-amber-400 ring-2 ring-amber-400/30 bg-amber-400/5 shadow-xs"
                      : "border-border/70"
                  )}
                >
                  {/* Switch & Template Name */}
                  <div className="flex items-center gap-3 shrink-0">
                    <Switch
                      checked={isSelected}
                      onCheckedChange={() => onSelectTemplate(tmpl)}
                      aria-label={`Select ${tmpl.name}`}
                      className="data-[state=checked]:bg-amber-400 data-[state=checked]:border-amber-500"
                    />
                    <span className="text-xs font-bold text-foreground">
                      {tmpl.name}
                    </span>
                  </div>

                  {/* Template Banner Preview Badge */}
                  <div
                    className="relative flex flex-1 items-center justify-between gap-2 overflow-hidden rounded-lg px-3 py-2 text-[11px] font-medium shadow-xs select-none max-w-[270px] transition-transform group-hover:scale-[1.01]"
                    style={{
                      background: d.bgColor,
                      color: d.textColor,
                      border: d.templateId === "minimal" ? "1px solid #cbd5e1" : "none",
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-1 truncate">
                      {renderTemplateIcon(d.icon)}
                      <span className="truncate font-semibold text-[11px]">
                        {d.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {d.hasButton && (
                        <span
                          className="rounded px-1.5 py-0.5 text-[10px] font-bold shadow-2xs whitespace-nowrap"
                          style={{
                            backgroundColor: d.buttonBgColor,
                            color: d.buttonTextColor,
                          }}
                        >
                          {d.buttonText || "Learn More"}
                        </span>
                      )}
                      <XIcon className="h-3 w-3 opacity-60 shrink-0" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* ================= TAB 2: PREFERENCES ================= */}
        <TabsContent value="preferences" className="m-0 flex-1 overflow-y-auto pt-3 space-y-4 scrollbar-thin pr-1">
          {/* 1. CONTENT */}
          <div className="rounded-xl border bg-card p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Content
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">Text & Icons</span>
            </div>

            {/* Announcement Text */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Announcement Text <span className="text-destructive">*</span>
                </label>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {config.text.length}/200
                </span>
              </div>
              <Input
                value={config.text}
                maxLength={200}
                onChange={(e) => onChange("text", e.target.value)}
                placeholder="2027 Winter and Spring Schedules are now open for enrollment!"
                className={cn("h-9 text-xs", errors.text && "border-destructive")}
              />
              {errors.text && <p className="text-[11px] text-destructive">{errors.text}</p>}
            </div>

            {/* Icon Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block">
                Icon (Optional)
              </label>
              <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5 pt-1">
                {ICONS.map((item) => {
                  const isSelected = config.icon === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onChange("icon", item.id)}
                      className={cn(
                        "flex h-9 w-full items-center justify-center rounded-lg border text-xs transition-all",
                        isSelected
                          ? "border-amber-400 bg-amber-400/15 text-amber-600 dark:text-amber-400 ring-1 ring-amber-400/40 font-bold"
                          : "border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                      title={item.label}
                    >
                      {item.component}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. APPEARANCE */}
          <div className="rounded-xl border bg-card p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Appearance
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">Colors & Theme</span>
            </div>

            {/* Background Color */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">Background Color</label>
                <span className="text-[11px] font-mono text-muted-foreground">{config.bgColor}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.bgColor.startsWith("#") ? config.bgColor : "#4A1525"}
                  onChange={(e) => onChange("bgColor", e.target.value)}
                  className="h-8 w-8 cursor-pointer rounded-lg border p-0.5 shrink-0"
                />
                <Input
                  value={config.bgColor}
                  onChange={(e) => onChange("bgColor", e.target.value)}
                  className="h-8 text-xs font-mono w-28"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {BG_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.value}
                    type="button"
                    onClick={() => onChange("bgColor", swatch.value)}
                    className={cn(
                      "h-6 w-6 rounded-md border shadow-2xs transition-transform hover:scale-105",
                      config.bgColor === swatch.value && "ring-2 ring-amber-400 ring-offset-1"
                    )}
                    style={{ background: swatch.value }}
                    title={swatch.label}
                  />
                ))}
              </div>
            </div>

            {/* Text Color */}
            <div className="space-y-2 pt-2 border-t border-border/50">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">Text Color</label>
                <span className="text-[11px] font-mono text-muted-foreground">{config.textColor}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.textColor.startsWith("#") ? config.textColor : "#FFFFFF"}
                  onChange={(e) => onChange("textColor", e.target.value)}
                  className="h-8 w-8 cursor-pointer rounded-lg border p-0.5 shrink-0"
                />
                <Input
                  value={config.textColor}
                  onChange={(e) => onChange("textColor", e.target.value)}
                  className="h-8 text-xs font-mono w-28"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {TEXT_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.value}
                    type="button"
                    onClick={() => onChange("textColor", swatch.value)}
                    className={cn(
                      "h-6 w-6 rounded-md border shadow-2xs transition-transform hover:scale-105",
                      config.textColor === swatch.value && "ring-2 ring-amber-400 ring-offset-1"
                    )}
                    style={{ backgroundColor: swatch.value }}
                    title={swatch.label}
                  />
                ))}
              </div>
            </div>

            {/* Font Size & Bar Padding */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Font Size</label>
                <Select
                  value={config.fontSize}
                  onValueChange={(val) => onChange("fontSize", val)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12px" className="text-xs">12px (Small)</SelectItem>
                    <SelectItem value="14px" className="text-xs">14px (Medium)</SelectItem>
                    <SelectItem value="16px" className="text-xs">16px (Large)</SelectItem>
                    <SelectItem value="18px" className="text-xs">18px (XL)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">Padding</label>
                  <span className="text-[11px] font-mono text-muted-foreground">{config.padding}px</span>
                </div>
                <Slider
                  min={8}
                  max={24}
                  step={2}
                  value={[config.padding]}
                  onValueChange={([val]) => onChange("padding", val)}
                  className="pt-2"
                />
              </div>
            </div>
          </div>

          {/* 3. ACTION (OPTIONAL) */}
          <div className="rounded-xl border bg-card p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Action Button
                </span>
                <span className="text-[10px] text-muted-foreground block">Optional CTA link</span>
              </div>
              <Switch
                checked={config.hasButton}
                onCheckedChange={(val) => onChange("hasButton", val)}
                aria-label="Toggle action button"
              />
            </div>

            {config.hasButton && (
              <div className="space-y-3 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Button Text</label>
                  <Input
                    value={config.buttonText}
                    onChange={(e) => onChange("buttonText", e.target.value)}
                    placeholder="Learn More"
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Button Link</label>
                  <Input
                    value={config.buttonLink}
                    onChange={(e) => onChange("buttonLink", e.target.value)}
                    placeholder="https://example.com/enroll"
                    className="h-8 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Button Color</label>
                  <div className="flex flex-wrap gap-1.5">
                    {BUTTON_SWATCHES.map((swatch) => (
                      <button
                        key={swatch.value}
                        type="button"
                        onClick={() => onChange("buttonBgColor", swatch.value)}
                        className={cn(
                          "h-6 w-6 rounded-md border shadow-2xs transition-transform hover:scale-105",
                          config.buttonBgColor === swatch.value && "ring-2 ring-amber-400 ring-offset-1"
                        )}
                        style={{ backgroundColor: swatch.value }}
                        title={swatch.label}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-foreground font-medium">Open in new tab</span>
                  <Switch
                    checked={config.openInNewTab}
                    onCheckedChange={(val) => onChange("openInNewTab", val)}
                    aria-label="Open link in new tab"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 4. POSITION */}
          <div className="rounded-xl border bg-card p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Position
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">Placement</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => onChange("position", "top")}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg border p-2.5 text-xs font-semibold transition-all",
                  config.position === "top"
                    ? "border-amber-400 bg-amber-400/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/30"
                    : "border-border/70 hover:bg-muted text-muted-foreground"
                )}
              >
                Top of Website
              </button>
              <button
                type="button"
                onClick={() => onChange("position", "bottom")}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg border p-2.5 text-xs font-semibold transition-all",
                  config.position === "bottom"
                    ? "border-amber-400 bg-amber-400/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/30"
                    : "border-border/70 hover:bg-muted text-muted-foreground"
                )}
              >
                Bottom of Website
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div>
                <p className="text-xs font-semibold text-foreground">Sticky (Fixed to Viewport)</p>
                <p className="text-[11px] text-muted-foreground">Bar stays visible while scrolling</p>
              </div>
              <Switch
                checked={config.isSticky}
                onCheckedChange={(val) => onChange("isSticky", val)}
                aria-label="Toggle sticky position"
              />
            </div>
          </div>

          {/* 5. VISIBILITY */}
          <div className="rounded-xl border bg-card p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Visibility
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">Pages & Devices</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Show on which pages</label>
              <Select
                value={config.targetPages}
                onValueChange={(val: any) => onChange("targetPages", val)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">All Pages</SelectItem>
                  <SelectItem value="homepage" className="text-xs">Homepage Only</SelectItem>
                  <SelectItem value="specific" className="text-xs">Specific URLs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground font-medium">Show on Desktop</span>
                <Switch
                  checked={config.showOnDesktop}
                  onCheckedChange={(val) => onChange("showOnDesktop", val)}
                  aria-label="Show on Desktop"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground font-medium">Show on Tablet</span>
                <Switch
                  checked={config.showOnTablet}
                  onCheckedChange={(val) => onChange("showOnTablet", val)}
                  aria-label="Show on Tablet"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground font-medium">Show on Mobile</span>
                <Switch
                  checked={config.showOnMobile}
                  onCheckedChange={(val) => onChange("showOnMobile", val)}
                  aria-label="Show on Mobile"
                />
              </div>
            </div>
          </div>

          {/* 6. DISPLAY OPTIONS */}
          <div className="rounded-xl border bg-card p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Display Options
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">Dismissal & Animation</span>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-foreground">Show Close Button</p>
                  <p className="text-[11px] text-muted-foreground">Allows visitors to hide the bar</p>
                </div>
                <Switch
                  checked={config.showCloseButton}
                  onCheckedChange={(val) => onChange("showCloseButton", val)}
                  aria-label="Show Close Button"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-foreground">Allow Dismiss (7 days)</p>
                  <p className="text-[11px] text-muted-foreground">Keep bar closed for 7 days</p>
                </div>
                <Switch
                  checked={config.allowDismiss}
                  onCheckedChange={(val) => onChange("allowDismiss", val)}
                  aria-label="Allow Dismiss"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-foreground">Animate Slide Down</p>
                  <p className="text-[11px] text-muted-foreground">Smooth entrance animation on load</p>
                </div>
                <Switch
                  checked={config.animateSlideDown}
                  onCheckedChange={(val) => onChange("animateSlideDown", val)}
                  aria-label="Animate Slide Down"
                />
              </div>
            </div>
          </div>

          {/* Collapsible More Options */}
          <div className="border-t border-border/70 pt-2 pb-1">
            <button
              type="button"
              onClick={() => setShowAdvanced((prev) => !prev)}
              className="flex items-center justify-between w-full py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <span className="flex items-center gap-1.5">
                <Settings2 className="h-3.5 w-3.5" />
                More options
              </span>
              <ChevronDown
                className={cn("h-3.5 w-3.5 transition-transform", showAdvanced && "rotate-180")}
              />
            </button>

            {showAdvanced && (
              <div className="mt-2 space-y-2 rounded-xl border bg-muted/20 p-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-foreground">Custom CSS Class</label>
                  <Input
                    value={config.customCssClass}
                    onChange={(e) => onChange("customCssClass", e.target.value)}
                    placeholder="e.g. my-promo-banner"
                    className="text-xs h-8 bg-card"
                  />
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer Actions matching Screenshot 2 */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-border/60">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="text-xs h-8 px-4 rounded-lg"
        >
          Cancel
        </Button>

        {onPublish && (
          <Button
            type="button"
            size="sm"
            onClick={onPublish}
            disabled={isPublishing}
            className="text-xs h-8 px-4 font-bold rounded-lg bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-xs"
          >
            {isPublishing ? "Saving..." : "Save Plugin"}
          </Button>
        )}
      </div>
    </div>
  );
};
