import { useState, useRef, type FC, type ChangeEvent } from "react";
import {
  FileText,
  Zap,
  Monitor,
  Palette,
  Sparkles,
  Settings2,
  Upload,
  Trash2,
  RotateCcw,
  Copy,
  Check,
  AlertTriangle,
  ExternalLink,
  Info,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import type {
  PopupWidgetConfig,
  TriggerType,
  OverlayStyle,
  PopupPosition,
  PopupSize,
} from "@/lib/popup/types";
import { POPUP_TEMPLATES, type PopupTemplateDefinition } from "@/lib/popup/templates";
import { isSafeUrl, parseVideoUrl } from "@/lib/popup/validation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PopupConfigTabsProps {
  config: PopupWidgetConfig;
  widgetId: string;
  updateConfig: <K extends keyof PopupWidgetConfig>(key: K, value: PopupWidgetConfig[K]) => void;
  onSelectTemplate?: (template: PopupTemplateDefinition) => void;
  onResetDefaults: () => void;
  onTestTrigger?: () => void;
  errors?: Record<string, string>;
}

const COLOR_SWATCHES = [
  "#FFFFFF",
  "#F8FAFC",
  "#111827",
  "#8B5CF6",
  "#6366F1",
  "#EC4899",
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#06B6D4",
];

export const PopupConfigTabs: FC<PopupConfigTabsProps> = ({
  config,
  widgetId,
  updateConfig,
  onSelectTemplate,
  onResetDefaults,
  onTestTrigger,
  errors = {},
}) => {
  const [activeTab, setActiveTab] = useState<string>("setup");
  const [copiedId, setCopiedId] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopyId = () => {
    navigator.clipboard.writeText(widgetId);
    setCopiedId(true);
    toast.success("Widget ID copied to clipboard");
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image file is too large (max 2MB).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        updateConfig("imageUrl", event.target.result);
        toast.success("Image uploaded successfully");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex h-full flex-col bg-card border-r border-border/80 overflow-hidden">
      {/* 4 Clean Configuration Tabs: Setup, Style, Position, Trigger */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-full flex-col">
        <div className="border-b border-border/60 p-2.5 bg-muted/20">
          <TabsList className="grid w-full grid-cols-4 bg-muted/60 p-1 rounded-xl">
            <TabsTrigger value="setup" className="text-xs py-1.5 font-semibold">
              Setup
            </TabsTrigger>
            <TabsTrigger value="style" className="text-xs py-1.5 font-semibold">
              Style
            </TabsTrigger>
            <TabsTrigger value="position" className="text-xs py-1.5 font-semibold">
              Position
            </TabsTrigger>
            <TabsTrigger value="trigger" className="text-xs py-1.5 font-semibold">
              Trigger
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Panels */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 1: SETUP */}
          {/* ───────────────────────────────────────────────────────────── */}
          <TabsContent value="setup" className="m-0 space-y-4">
            {/* Popup Type / Style Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Popup Style</label>
              <Select
                value={config.templateId}
                onValueChange={(val: any) => {
                  const tmpl = POPUP_TEMPLATES.find((t) => t.id === val);
                  if (tmpl && onSelectTemplate) onSelectTemplate(tmpl);
                }}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POPUP_TEMPLATES.map((tmpl) => (
                    <SelectItem key={tmpl.id} value={tmpl.id} className="text-xs">
                      {tmpl.number}. {tmpl.name} — {tmpl.subtitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title Input */}
            {config.templateId !== "custom-html" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">Title</label>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {config.title.length}/100
                  </span>
                </div>
                <Input
                  value={config.title}
                  maxLength={100}
                  onChange={(e) => updateConfig("title", e.target.value)}
                  placeholder="Special Offer! 🎉"
                  className={cn("h-9 text-xs", errors.title && "border-destructive focus-visible:ring-destructive")}
                />
                {errors.title && <p className="text-[11px] text-destructive">{errors.title}</p>}
              </div>
            )}

            {/* Description Input */}
            {config.templateId !== "custom-html" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">Description</label>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {config.description.length}/300
                  </span>
                </div>
                <Textarea
                  rows={2}
                  maxLength={300}
                  value={config.description}
                  onChange={(e) => updateConfig("description", e.target.value)}
                  placeholder="Get 20% off on your first order. Use code WELCOME20 at checkout."
                  className="text-xs resize-none"
                />
              </div>
            )}

            {/* Image (Optional) */}
            {config.templateId !== "custom-html" && config.templateId !== "video" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Image (Optional)</label>
                <div className="flex items-center gap-3 rounded-xl border border-border/70 p-2.5 bg-muted/20">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-white overflow-hidden shadow-2xs">
                    {config.imageUrl ? (
                      <img
                        src={config.imageUrl}
                        alt={config.imageAlt || "Popup thumbnail"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-lg">🎁</span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-7 text-xs px-2.5 rounded-lg border-border/80"
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        Change Image
                      </Button>
                      {config.imageUrl && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => updateConfig("imageUrl", "")}
                          className="h-7 text-xs px-2 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Primary Button */}
            {config.templateId !== "custom-html" && config.templateId !== "age-verification" && (
              <>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground">Button Text</label>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {config.primaryButtonText.length}/30
                    </span>
                  </div>
                  <Input
                    value={config.primaryButtonText}
                    maxLength={30}
                    onChange={(e) => updateConfig("primaryButtonText", e.target.value)}
                    placeholder="Shop Now"
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Button Link</label>
                  <Input
                    value={config.primaryButtonUrl}
                    onChange={(e) => updateConfig("primaryButtonUrl", e.target.value)}
                    placeholder="https://yourstore.com/sale"
                    className="h-8 text-xs font-mono"
                  />
                  <div className="flex items-center gap-2 pt-0.5">
                    <Checkbox
                      id="openInNewTabPopup"
                      checked={config.openInNewTab}
                      onCheckedChange={(checked) => updateConfig("openInNewTab", Boolean(checked))}
                    />
                    <label htmlFor="openInNewTabPopup" className="text-xs text-foreground cursor-pointer select-none">
                      Open in new tab
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Template Specific: Newsletter */}
            {config.templateId === "newsletter" && (
              <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-3 space-y-2">
                <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                  Newsletter Settings
                </span>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-foreground">Email Placeholder</label>
                  <Input
                    value={config.emailPlaceholder}
                    onChange={(e) => updateConfig("emailPlaceholder", e.target.value)}
                    className="h-8 text-xs bg-card"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <label className="text-[11px] font-medium text-foreground">Consent Checkbox</label>
                  <Switch
                    checked={config.requireConsent}
                    onCheckedChange={(v) => updateConfig("requireConsent", v)}
                  />
                </div>
              </div>
            )}

            {/* Template Specific: Video */}
            {config.templateId === "video" && (
              <div className="rounded-xl border border-border p-3 space-y-2 bg-muted/20">
                <span className="text-xs font-bold text-foreground">Video URL</span>
                <Input
                  value={config.videoUrl}
                  onChange={(e) => updateConfig("videoUrl", e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="h-8 text-xs font-mono"
                />
              </div>
            )}

            {/* Template Specific: Age Verification */}
            {config.templateId === "age-verification" && (
              <div className="rounded-xl border border-border p-3 space-y-2 bg-muted/20">
                <span className="text-xs font-bold text-foreground">Age Verification Labels</span>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={config.confirmText}
                    onChange={(e) => updateConfig("confirmText", e.target.value)}
                    placeholder="Yes"
                    className="h-8 text-xs"
                  />
                  <Input
                    value={config.declineText}
                    onChange={(e) => updateConfig("declineText", e.target.value)}
                    placeholder="No"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            )}

            {/* Template Specific: Custom HTML */}
            {config.templateId === "custom-html" && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 space-y-2">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Custom HTML</span>
                <Textarea
                  rows={5}
                  value={config.customHtmlContent}
                  onChange={(e) => updateConfig("customHtmlContent", e.target.value)}
                  className="font-mono text-xs resize-none bg-card"
                />
              </div>
            )}

            {/* Close Button Settings */}
            <div className="border-t border-border/70 pt-3 space-y-2">
              <label className="text-xs font-bold text-foreground block">Dismissal Options</label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="showCloseBtnPopup"
                  checked={config.showCloseButton}
                  onCheckedChange={(c) => updateConfig("showCloseButton", Boolean(c))}
                />
                <label htmlFor="showCloseBtnPopup" className="text-xs text-foreground cursor-pointer select-none">
                  Show close button
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="clickOutsideClosePopup"
                  checked={config.closeOnOverlayClick}
                  onCheckedChange={(c) => updateConfig("closeOnOverlayClick", Boolean(c))}
                />
                <label htmlFor="clickOutsideClosePopup" className="text-xs text-foreground cursor-pointer select-none">
                  Click outside to close
                </label>
              </div>
            </div>
          </TabsContent>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 2: STYLE */}
          {/* ───────────────────────────────────────────────────────────── */}
          <TabsContent value="style" className="m-0 space-y-4">
            {/* Colors */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground block">Popup Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.bgColor}
                  onChange={(e) => updateConfig("bgColor", e.target.value)}
                  className="h-8 w-8 cursor-pointer rounded-lg border p-0.5"
                />
                <Input
                  value={config.bgColor}
                  onChange={(e) => updateConfig("bgColor", e.target.value)}
                  className="h-8 text-xs font-mono w-28"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground block">Primary Button Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.primaryButtonBg}
                  onChange={(e) => updateConfig("primaryButtonBg", e.target.value)}
                  className="h-8 w-8 cursor-pointer rounded-lg border p-0.5"
                />
                <Input
                  value={config.primaryButtonBg}
                  onChange={(e) => updateConfig("primaryButtonBg", e.target.value)}
                  className="h-8 text-xs font-mono w-28"
                />
              </div>
            </div>

            {/* Popup Size (Moved here from bottom of preview!) */}
            <div className="border-t border-border/70 pt-3 space-y-2">
              <label className="text-xs font-bold text-foreground block">Popup Size</label>
              <div className="grid grid-cols-3 gap-2">
                {(["small", "medium", "large"] as PopupSize[]).map((s) => (
                  <Button
                    key={s}
                    type="button"
                    variant={config.size === s ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateConfig("size", s)}
                    className="h-8 text-xs capitalize"
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>

            {/* Overlay Style (Moved here from bottom of preview!) */}
            <div className="border-t border-border/70 pt-3 space-y-2">
              <label className="text-xs font-bold text-foreground block">Overlay Style</label>
              <div className="grid grid-cols-3 gap-2">
                {(["dark", "light", "blur"] as OverlayStyle[]).map((ov) => (
                  <Button
                    key={ov}
                    type="button"
                    variant={config.overlayStyle === ov ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateConfig("overlayStyle", ov)}
                    className="h-8 text-xs capitalize"
                  >
                    {ov}
                  </Button>
                ))}
              </div>
            </div>

            {/* Border Radius */}
            <div className="border-t border-border/70 pt-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">Corner Radius</label>
                <span className="text-xs font-mono text-muted-foreground">{config.borderRadius}px</span>
              </div>
              <Slider
                value={[config.borderRadius]}
                min={0}
                max={32}
                step={2}
                onValueChange={([val]) => updateConfig("borderRadius", val)}
              />
            </div>
          </TabsContent>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 3: POSITION */}
          {/* ───────────────────────────────────────────────────────────── */}
          <TabsContent value="position" className="m-0 space-y-4">
            {/* Popup Position (Moved here from bottom of preview!) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground block">Popup Position</label>
              <div className="grid grid-cols-3 gap-2">
                {(["center", "top", "bottom", "left", "right"] as PopupPosition[]).map((pos) => {
                  const isSelected = config.position === pos;
                  return (
                    <Button
                      key={pos}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateConfig("position", pos)}
                      className="h-8 text-xs capitalize"
                    >
                      {pos}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Device Visibility */}
            <div className="border-t border-border/70 pt-3 space-y-2.5">
              <label className="text-xs font-bold text-foreground block">Device Visibility</label>
              <div className="flex items-center justify-between rounded-xl border p-2.5">
                <span className="text-xs text-foreground">Desktop Screens</span>
                <Switch
                  checked={config.showDesktop}
                  onCheckedChange={(v) => updateConfig("showDesktop", v)}
                />
              </div>
              <div className="flex items-center justify-between rounded-xl border p-2.5">
                <span className="text-xs text-foreground">Tablet Screens</span>
                <Switch
                  checked={config.showTablet}
                  onCheckedChange={(v) => updateConfig("showTablet", v)}
                />
              </div>
              <div className="flex items-center justify-between rounded-xl border p-2.5">
                <span className="text-xs text-foreground">Mobile Screens</span>
                <Switch
                  checked={config.showMobile}
                  onCheckedChange={(v) => updateConfig("showMobile", v)}
                />
              </div>
            </div>

            {/* Frequency Rules */}
            <div className="border-t border-border/70 pt-3 space-y-1.5">
              <label className="text-xs font-bold text-foreground block">Frequency</label>
              <Select
                value={config.frequency}
                onValueChange={(v: any) => updateConfig("frequency", v)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="always">Every Page Load</SelectItem>
                  <SelectItem value="session">Once Per Session</SelectItem>
                  <SelectItem value="daily">Once Per Day</SelectItem>
                  <SelectItem value="weekly">Once Every 7 Days</SelectItem>
                  <SelectItem value="once">Once Per Visitor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 4: TRIGGER */}
          {/* ───────────────────────────────────────────────────────────── */}
          <TabsContent value="trigger" className="m-0 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Trigger Event</label>
              <Select
                value={config.triggerType}
                onValueChange={(v: TriggerType) => updateConfig("triggerType", v)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="load">On Page Load</SelectItem>
                  <SelectItem value="delay">After Delay</SelectItem>
                  <SelectItem value="scroll">On Scroll Percentage</SelectItem>
                  <SelectItem value="click">On Click of Element</SelectItem>
                  <SelectItem value="exit-intent">Exit Intent (Desktop)</SelectItem>
                  <SelectItem value="time-on-page">Time on Page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Specific trigger delay / scroll controls */}
            {(config.triggerType === "load" || config.triggerType === "delay") && (
              <div className="space-y-1.5 rounded-xl border p-2.5 bg-muted/20">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">Delay (seconds):</span>
                  <span className="font-mono font-bold text-purple-600">{config.delaySeconds}s</span>
                </div>
                <Slider
                  value={[config.delaySeconds]}
                  min={0}
                  max={30}
                  step={1}
                  onValueChange={([val]) => updateConfig("delaySeconds", val)}
                />
              </div>
            )}

            {config.triggerType === "scroll" && (
              <div className="space-y-1.5 rounded-xl border p-2.5 bg-muted/20">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">Scroll Depth:</span>
                  <span className="font-mono font-bold text-purple-600">{config.scrollPercentage}%</span>
                </div>
                <Slider
                  value={[config.scrollPercentage]}
                  min={10}
                  max={100}
                  step={5}
                  onValueChange={([val]) => updateConfig("scrollPercentage", val)}
                />
              </div>
            )}

            {/* Test Trigger Button */}
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onTestTrigger}
                className="w-full h-8 text-xs text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800"
              >
                <Zap className="h-3.5 w-3.5 mr-1.5" /> Test Trigger in Preview
              </Button>
            </div>

            {/* Collapsible "More options" */}
            <div className="border-t border-border/70 pt-2">
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
                <div className="mt-3 space-y-3 rounded-xl border bg-muted/20 p-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-foreground">Custom CSS Class</label>
                    <Input
                      value={config.customClass}
                      onChange={(e) => updateConfig("customClass", e.target.value)}
                      placeholder="e.g. my-popup"
                      className="text-xs h-8 bg-card"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-foreground">Widget Identifier</label>
                    <Input value={widgetId} readOnly className="font-mono text-xs h-8 bg-muted/40" />
                  </div>
                  <div className="pt-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onResetDefaults}
                      className="text-xs text-destructive hover:bg-destructive/10 h-7 px-2"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Reset to defaults
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
