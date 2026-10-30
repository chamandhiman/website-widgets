import { useState, useRef, type FC, type ChangeEvent } from "react";
import {
  Sparkles,
  LayoutTemplate,
  Type,
  Sliders,
  Upload,
  Trash2,
  RotateCcw,
  Copy,
  Check,
  Zap,
  ChevronDown,
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  Tag,
  Gift,
  Mail,
  HelpCircle,
  FileCode,
  Video,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import type {
  PopupWidgetConfig,
  PopupType,
  TriggerType,
  OverlayStyle,
  PopupPosition,
  PopupSize,
} from "@/lib/popup/types";
import { POPUP_TEMPLATES, type PopupTemplateDefinition } from "@/lib/popup/templates";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
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

interface PopupConfigTabsProps {
  config: PopupWidgetConfig;
  widgetId: string;
  updateConfig: <K extends keyof PopupWidgetConfig>(
    key: K,
    value: PopupWidgetConfig[K]
  ) => void;
  onSelectTemplate?: (template: PopupTemplateDefinition) => void;
  onResetDefaults: () => void;
  onTestTrigger?: () => void;
  errors?: Record<string, string>;
  defaultTab?: string;
}

export const PopupConfigTabs: FC<PopupConfigTabsProps> = ({
  config,
  widgetId,
  updateConfig,
  onSelectTemplate,
  onResetDefaults,
  onTestTrigger,
  errors = {},
  defaultTab = "designs",
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
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
    <div className="flex h-full flex-col rounded-2xl border bg-card shadow-soft overflow-hidden">
      {/* 3 Main Modern Tabs: Designs -> Content -> Preferences */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <div className="border-b px-3.5 pt-3 pb-2.5 bg-muted/20 shrink-0">
          <TabsList className="grid w-full grid-cols-3 bg-muted/60 p-1 rounded-xl">
            <TabsTrigger
              value="designs"
              className="flex items-center gap-1.5 text-xs font-semibold py-1.5"
            >
              <LayoutTemplate className="h-3.5 w-3.5" />
              Designs
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="flex items-center gap-1.5 text-xs font-semibold py-1.5"
            >
              <Type className="h-3.5 w-3.5" />
              Content
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="flex items-center gap-1.5 text-xs font-semibold py-1.5"
            >
              <Sliders className="h-3.5 w-3.5" />
              Preferences
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Scrollable Panels */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {/* ============================================================== */}
          {/* TAB 1: DESIGNS */}
          {/* ============================================================== */}
          <TabsContent value="designs" className="mt-0 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                  Select Popup Design
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Choose from 8+ distinct, high-converting layouts.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {POPUP_TEMPLATES.length} Designs
              </span>
            </div>

            {/* Design Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {POPUP_TEMPLATES.map((tmpl) => {
                const isSelected = config.templateId === tmpl.id;

                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => {
                      if (onSelectTemplate) {
                        onSelectTemplate(tmpl);
                      } else {
                        updateConfig("templateId", tmpl.id);
                      }
                    }}
                    className={cn(
                      "group relative flex flex-col items-center rounded-xl border p-2.5 text-left transition-all duration-150 focus:outline-hidden",
                      isSelected
                        ? "border-purple-600 bg-purple-500/5 ring-1.5 ring-purple-600 shadow-xs"
                        : "border-border/70 bg-card hover:border-border hover:bg-muted/40 hover:shadow-2xs"
                    )}
                    aria-pressed={isSelected}
                  >
                    {/* Selected Check Badge */}
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white shadow-xs animate-in zoom-in-75 duration-100">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                    )}

                    {/* Miniature Visual Mockup Frame */}
                    <div className="relative mb-2 flex h-24 w-full items-center justify-center overflow-hidden rounded-lg border border-border/50 bg-muted/30 p-1.5 transition-transform group-hover:scale-[1.02]">
                      <MiniatureDesignThumbnail id={tmpl.id} />
                      {tmpl.badge && (
                        <span className="absolute top-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[8px] font-semibold text-white backdrop-blur-xs">
                          {tmpl.badge}
                        </span>
                      )}
                    </div>

                    {/* Title & Caption */}
                    <div className="w-full text-left">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-foreground leading-tight truncate">
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
          </TabsContent>

          {/* ============================================================== */}
          {/* TAB 2: CONTENT */}
          {/* ============================================================== */}
          <TabsContent value="content" className="mt-0 space-y-4">
            {/* 1. Basic Content */}
            <div className="rounded-xl border border-border/70 p-3.5 space-y-3 bg-card">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Type className="h-3.5 w-3.5 text-purple-600" />
                Basic Content
              </h4>

              {config.templateId !== "custom-html" && (
                <>
                  {/* Title */}
                  <div className="space-y-1">
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
                      className={cn(
                        "h-8 text-xs",
                        errors.title && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {errors.title && (
                      <p className="text-[11px] text-destructive">{errors.title}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-foreground">
                        Description
                      </label>
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

                  {/* Optional Badge / Offer Label */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-foreground">
                        Badge / Offer Label
                      </label>
                      <Input
                        value={config.discountBadge || ""}
                        onChange={(e) => updateConfig("discountBadge", e.target.value)}
                        placeholder="e.g. 20% OFF or LIMITED SALE"
                        className="h-8 text-xs"
                      />
                    </div>

                    {/* Optional Coupon Code */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-foreground">
                        Coupon Code
                      </label>
                      <Input
                        value={config.couponCode || ""}
                        onChange={(e) => updateConfig("couponCode", e.target.value)}
                        placeholder="e.g. WELCOME20"
                        className="h-8 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Disclaimer / Footer Text */}
                  <div className="space-y-1 pt-1">
                    <label className="text-[11px] font-semibold text-foreground">
                      Disclaimer / Footer Text (Optional)
                    </label>
                    <Input
                      value={config.footerText || config.disclaimerText || ""}
                      onChange={(e) => {
                        updateConfig("footerText", e.target.value);
                        updateConfig("disclaimerText", e.target.value);
                      }}
                      placeholder="*Valid on orders over $50. Terms apply."
                      className="h-8 text-xs"
                    />
                  </div>
                </>
              )}

              {/* Custom HTML Content */}
              {config.templateId === "custom-html" && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <FileCode className="h-3.5 w-3.5" />
                    Custom HTML Content
                  </label>
                  <Textarea
                    rows={8}
                    value={config.customHtmlContent}
                    onChange={(e) => updateConfig("customHtmlContent", e.target.value)}
                    placeholder="<div>Your custom HTML snippet</div>"
                    className="font-mono text-xs resize-none bg-card"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Accepts standard HTML tags and inline styles. Scripts will be executed safely in preview.
                  </p>
                </div>
              )}
            </div>

            {/* 2. Image Settings */}
            {config.templateId !== "custom-html" && config.templateId !== "video" && (
              <div className="rounded-xl border border-border/70 p-3.5 space-y-3 bg-card">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-purple-600" />
                  Image Settings
                </h4>

                <div className="flex items-center gap-3 rounded-xl border border-border/70 p-2.5 bg-muted/20">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-border bg-white overflow-hidden shadow-2xs">
                    {config.imageUrl ? (
                      <img
                        src={config.imageUrl}
                        alt={config.imageAlt || "Popup thumbnail"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xl">🎁</span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5">
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
                    <span className="text-[10px] text-muted-foreground">
                      PNG, JPG, WebP, or GIF up to 2MB.
                    </span>
                  </div>
                </div>

                {/* Direct Image URL input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">
                    Or Image URL
                  </label>
                  <Input
                    value={config.imageUrl || ""}
                    onChange={(e) => updateConfig("imageUrl", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="h-8 text-xs font-mono"
                  />
                </div>

                {/* Alt text */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">
                    Image Alt Text
                  </label>
                  <Input
                    value={config.imageAlt || ""}
                    onChange={(e) => updateConfig("imageAlt", e.target.value)}
                    placeholder="Description of image for accessibility"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            )}

            {/* 3. Call to Action (CTA) */}
            {config.templateId !== "custom-html" &&
              config.templateId !== "age-verification" && (
                <div className="rounded-xl border border-border/70 p-3.5 space-y-3 bg-card">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5 text-purple-600" />
                    Call to Action (CTA)
                  </h4>

                  {/* Primary Button */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-foreground">
                        Button Text
                      </label>
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

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      Button Link / Destination URL
                    </label>
                    <Input
                      value={config.primaryButtonUrl}
                      onChange={(e) => updateConfig("primaryButtonUrl", e.target.value)}
                      placeholder="https://yourstore.com/sale"
                      className="h-8 text-xs font-mono"
                    />
                    <div className="flex items-center gap-2 pt-1">
                      <Checkbox
                        id="openInNewTabPopup"
                        checked={config.openInNewTab}
                        onCheckedChange={(checked) =>
                          updateConfig("openInNewTab", Boolean(checked))
                        }
                      />
                      <label
                        htmlFor="openInNewTabPopup"
                        className="text-xs text-foreground cursor-pointer select-none"
                      >
                        Open link in new tab
                      </label>
                    </div>
                  </div>

                  {/* Secondary Button Toggle */}
                  <div className="border-t border-border/70 pt-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-foreground">
                        Secondary Button
                      </label>
                      <Switch
                        checked={config.hasSecondaryButton}
                        onCheckedChange={(v) => updateConfig("hasSecondaryButton", v)}
                      />
                    </div>

                    {config.hasSecondaryButton && (
                      <div className="space-y-2 pt-1 bg-muted/20 p-2.5 rounded-lg border border-border/60">
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-foreground">
                            Secondary Button Text
                          </label>
                          <Input
                            value={config.secondaryButtonText}
                            onChange={(e) =>
                              updateConfig("secondaryButtonText", e.target.value)
                            }
                            placeholder="Maybe Later"
                            className="h-8 text-xs bg-card"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-foreground">
                            Secondary Button Link (or leave empty to dismiss)
                          </label>
                          <Input
                            value={config.secondaryButtonUrl}
                            onChange={(e) =>
                              updateConfig("secondaryButtonUrl", e.target.value)
                            }
                            placeholder="#"
                            className="h-8 text-xs font-mono bg-card"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* 4. Design-Specific Fields */}
            {/* Newsletter Specific Fields */}
            {config.templateId === "newsletter" && (
              <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-3.5 space-y-3">
                <h4 className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  Newsletter Configuration
                </h4>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-foreground">
                    Email Field Placeholder
                  </label>
                  <Input
                    value={config.emailPlaceholder}
                    onChange={(e) => updateConfig("emailPlaceholder", e.target.value)}
                    placeholder="Enter your email address..."
                    className="h-8 text-xs bg-card"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-foreground">
                    Submit Button Text
                  </label>
                  <Input
                    value={config.newsletterButtonText}
                    onChange={(e) => updateConfig("newsletterButtonText", e.target.value)}
                    placeholder="Subscribe Now"
                    className="h-8 text-xs bg-card"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-foreground">
                    Success Message
                  </label>
                  <Input
                    value={config.successMessage}
                    onChange={(e) => updateConfig("successMessage", e.target.value)}
                    placeholder="You're in! Check your inbox for confirmation."
                    className="h-8 text-xs bg-card"
                  />
                </div>
                <div className="border-t border-purple-500/20 pt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-foreground">
                      Require GDPR / Terms Consent
                    </label>
                    <Switch
                      checked={config.requireConsent}
                      onCheckedChange={(v) => updateConfig("requireConsent", v)}
                    />
                  </div>
                  {config.requireConsent && (
                    <div className="space-y-1 pt-1">
                      <label className="text-[10px] text-muted-foreground">Consent Label</label>
                      <Input
                        value={config.consentText}
                        onChange={(e) => updateConfig("consentText", e.target.value)}
                        placeholder="I agree to receive newsletters and promotional emails."
                        className="h-8 text-xs bg-card"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Video Specific Fields */}
            {config.templateId === "video" && (
              <div className="rounded-xl border border-border p-3.5 space-y-3 bg-muted/20">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Video className="h-3.5 w-3.5 text-purple-600" />
                  Video Settings
                </h4>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">Video URL</label>
                  <Input
                    value={config.videoUrl}
                    onChange={(e) => updateConfig("videoUrl", e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="h-8 text-xs font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Supports YouTube, Vimeo, or MP4 video links.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <label className="text-xs text-foreground">Autoplay Video</label>
                  <Switch
                    checked={config.autoplay}
                    onCheckedChange={(v) => updateConfig("autoplay", v)}
                  />
                </div>
              </div>
            )}

            {/* Age Verification Specific Fields */}
            {config.templateId === "age-verification" && (
              <div className="rounded-xl border border-border p-3.5 space-y-3 bg-muted/20">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
                  Age Verification Labels
                </h4>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">
                    Question Headline
                  </label>
                  <Input
                    value={config.ageQuestion}
                    onChange={(e) => updateConfig("ageQuestion", e.target.value)}
                    placeholder="Are You 18 or Older?"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-foreground">Confirm Button</label>
                    <Input
                      value={config.confirmText}
                      onChange={(e) => updateConfig("confirmText", e.target.value)}
                      placeholder="Yes, I am 18+"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-foreground">Decline Button</label>
                    <Input
                      value={config.declineText}
                      onChange={(e) => updateConfig("declineText", e.target.value)}
                      placeholder="No, I am under 18"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1 pt-1">
                  <label className="text-[11px] font-medium text-foreground">
                    Decline Action
                  </label>
                  <Select
                    value={config.declineAction}
                    onValueChange={(v: "message" | "redirect") =>
                      updateConfig("declineAction", v)
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="message">Show Access Denied Message</SelectItem>
                      <SelectItem value="redirect">Redirect to URL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {config.declineAction === "redirect" && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-foreground">Redirect URL</label>
                    <Input
                      value={config.declineUrl}
                      onChange={(e) => updateConfig("declineUrl", e.target.value)}
                      placeholder="https://google.com"
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* ============================================================== */}
          {/* TAB 3: PREFERENCES */}
          {/* ============================================================== */}
          <TabsContent value="preferences" className="mt-0 space-y-4">
            {/* 1. Position & Sizing */}
            <div className="rounded-xl border border-border/70 p-3.5 space-y-3 bg-card">
              <h4 className="text-xs font-bold text-foreground">Position & Sizing</h4>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground block">
                  Popup Position
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      "center",
                      "top",
                      "bottom",
                      "left",
                      "right",
                      "bottom-right",
                      "bottom-left",
                    ] as PopupPosition[]
                  ).map((pos) => {
                    const isSelected = config.position === pos;
                    return (
                      <Button
                        key={pos}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateConfig("position", pos)}
                        className="h-8 text-[11px] capitalize px-2"
                      >
                        {pos.replace("-", " ")}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Sizing Presets */}
              <div className="border-t border-border/70 pt-2.5 space-y-2">
                <label className="text-xs font-semibold text-foreground block">
                  Size Preset
                </label>
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

              {/* Corner Radius */}
              <div className="border-t border-border/70 pt-2.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Corner Radius
                  </label>
                  <span className="text-xs font-mono text-muted-foreground">
                    {config.borderRadius}px
                  </span>
                </div>
                <Slider
                  value={[config.borderRadius]}
                  min={0}
                  max={32}
                  step={2}
                  onValueChange={([val]) => updateConfig("borderRadius", val ?? 16)}
                />
              </div>

              {/* Card Padding */}
              <div className="border-t border-border/70 pt-2.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">Padding</label>
                  <span className="text-xs font-mono text-muted-foreground">
                    {config.padding}px
                  </span>
                </div>
                <Slider
                  value={[config.padding]}
                  min={12}
                  max={48}
                  step={4}
                  onValueChange={([val]) => updateConfig("padding", val ?? 24)}
                />
              </div>
            </div>

            {/* 2. Display Triggers */}
            <div className="rounded-xl border border-border/70 p-3.5 space-y-3 bg-card">
              <h4 className="text-xs font-bold text-foreground">Display Trigger</h4>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Trigger Event
                </label>
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
                    <SelectItem value="exit-intent">Exit Intent (Desktop Mouse-Out)</SelectItem>
                    <SelectItem value="click">On Click of Element</SelectItem>
                    <SelectItem value="time-on-page">Time on Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Specific Trigger Parameters */}
              {(config.triggerType === "load" || config.triggerType === "delay") && (
                <div className="space-y-1.5 rounded-xl border p-2.5 bg-muted/20">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">Delay (seconds):</span>
                    <span className="font-mono font-bold text-purple-600">
                      {config.delaySeconds}s
                    </span>
                  </div>
                  <Slider
                    value={[config.delaySeconds]}
                    min={0}
                    max={30}
                    step={1}
                    onValueChange={([val]) => updateConfig("delaySeconds", val ?? 0)}
                  />
                </div>
              )}

              {config.triggerType === "scroll" && (
                <div className="space-y-1.5 rounded-xl border p-2.5 bg-muted/20">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">Scroll Depth:</span>
                    <span className="font-mono font-bold text-purple-600">
                      {config.scrollPercentage}%
                    </span>
                  </div>
                  <Slider
                    value={[config.scrollPercentage]}
                    min={10}
                    max={100}
                    step={5}
                    onValueChange={([val]) => updateConfig("scrollPercentage", val ?? 50)}
                  />
                </div>
              )}

              {config.triggerType === "click" && (
                <div className="space-y-1.5 rounded-xl border p-2.5 bg-muted/20">
                  <label className="text-[11px] font-medium text-foreground">
                    Target Element CSS Selector
                  </label>
                  <Input
                    value={config.clickSelector}
                    onChange={(e) => updateConfig("clickSelector", e.target.value)}
                    placeholder=".open-popup-btn or #special-offer"
                    className="h-8 text-xs font-mono bg-card"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Popup triggers whenever visitors click elements matching this selector.
                  </p>
                </div>
              )}

              {/* Test Trigger Button */}
              <div className="pt-1">
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
            </div>

            {/* 3. Frequency & Device Targeting */}
            <div className="rounded-xl border border-border/70 p-3.5 space-y-3 bg-card">
              <h4 className="text-xs font-bold text-foreground">Frequency & Devices</h4>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Display Frequency
                </label>
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

              {/* Device Visibility */}
              <div className="border-t border-border/70 pt-2.5 space-y-2">
                <label className="text-xs font-semibold text-foreground block">
                  Device Visibility
                </label>
                <div className="flex items-center justify-between rounded-lg border p-2">
                  <span className="text-xs text-foreground flex items-center gap-1.5">
                    <Monitor className="h-3.5 w-3.5 text-muted-foreground" /> Desktop
                  </span>
                  <Switch
                    checked={config.showDesktop}
                    onCheckedChange={(v) => updateConfig("showDesktop", v)}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-2">
                  <span className="text-xs text-foreground flex items-center gap-1.5">
                    <Tablet className="h-3.5 w-3.5 text-muted-foreground" /> Tablet
                  </span>
                  <Switch
                    checked={config.showTablet}
                    onCheckedChange={(v) => updateConfig("showTablet", v)}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-2">
                  <span className="text-xs text-foreground flex items-center gap-1.5">
                    <Smartphone className="h-3.5 w-3.5 text-muted-foreground" /> Mobile
                  </span>
                  <Switch
                    checked={config.showMobile}
                    onCheckedChange={(v) => updateConfig("showMobile", v)}
                  />
                </div>
              </div>
            </div>

            {/* 4. Overlay & Appearance */}
            <div className="rounded-xl border border-border/70 p-3.5 space-y-3 bg-card">
              <h4 className="text-xs font-bold text-foreground">Appearance & Colors</h4>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">
                    Card Background
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.bgColor}
                      onChange={(e) => updateConfig("bgColor", e.target.value)}
                      className="h-7 w-7 cursor-pointer rounded-md border p-0.5"
                    />
                    <Input
                      value={config.bgColor}
                      onChange={(e) => updateConfig("bgColor", e.target.value)}
                      className="h-7 text-xs font-mono w-24"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">
                    Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.textColor}
                      onChange={(e) => updateConfig("textColor", e.target.value)}
                      className="h-7 w-7 cursor-pointer rounded-md border p-0.5"
                    />
                    <Input
                      value={config.textColor}
                      onChange={(e) => updateConfig("textColor", e.target.value)}
                      className="h-7 text-xs font-mono w-24"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-foreground block">
                  Primary Button Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.primaryButtonBg}
                    onChange={(e) => updateConfig("primaryButtonBg", e.target.value)}
                    className="h-7 w-7 cursor-pointer rounded-md border p-0.5"
                  />
                  <Input
                    value={config.primaryButtonBg}
                    onChange={(e) => updateConfig("primaryButtonBg", e.target.value)}
                    className="h-7 text-xs font-mono w-28"
                  />
                </div>
              </div>

              {/* Overlay Style */}
              <div className="border-t border-border/70 pt-2.5 space-y-2">
                <label className="text-xs font-semibold text-foreground block">
                  Overlay Style
                </label>
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

              {/* Entrance Animation */}
              <div className="border-t border-border/70 pt-2.5 space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">
                  Entrance Animation
                </label>
                <Select
                  value={config.entryAnimation}
                  onValueChange={(v: any) => updateConfig("entryAnimation", v)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fade">Fade In</SelectItem>
                    <SelectItem value="zoom">Zoom In</SelectItem>
                    <SelectItem value="slide-up">Slide Up</SelectItem>
                    <SelectItem value="slide-down">Slide Down</SelectItem>
                    <SelectItem value="bounce">Bounce</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dismissal Options */}
              <div className="border-t border-border/70 pt-2.5 space-y-2">
                <label className="text-xs font-semibold text-foreground block">
                  Dismissal Options
                </label>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="showCloseBtnPopup"
                    checked={config.showCloseButton}
                    onCheckedChange={(c) => updateConfig("showCloseButton", Boolean(c))}
                  />
                  <label
                    htmlFor="showCloseBtnPopup"
                    className="text-xs text-foreground cursor-pointer select-none"
                  >
                    Show close button
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="clickOutsideClosePopup"
                    checked={config.closeOnOverlayClick}
                    onCheckedChange={(c) =>
                      updateConfig("closeOnOverlayClick", Boolean(c))
                    }
                  />
                  <label
                    htmlFor="clickOutsideClosePopup"
                    className="text-xs text-foreground cursor-pointer select-none"
                  >
                    Click outside overlay to close
                  </label>
                </div>
              </div>
            </div>

            {/* 5. Advanced Options & Maintenance */}
            <div className="border-t border-border/70 pt-2">
              <button
                type="button"
                onClick={() => setShowAdvanced((prev) => !prev)}
                className="flex items-center justify-between w-full py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                <span className="flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5" />
                  Advanced Settings
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    showAdvanced && "rotate-180"
                  )}
                />
              </button>

              {showAdvanced && (
                <div className="mt-3 space-y-3 rounded-xl border bg-muted/20 p-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-foreground">
                      Custom CSS Class
                    </label>
                    <Input
                      value={config.customClass}
                      onChange={(e) => updateConfig("customClass", e.target.value)}
                      placeholder="e.g. my-custom-popup"
                      className="text-xs h-8 bg-card"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-foreground">
                      Widget Identifier
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={widgetId}
                        readOnly
                        className="font-mono text-xs h-8 bg-muted/40"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCopyId}
                        className="h-8 px-2.5 text-xs shrink-0"
                      >
                        {copiedId ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
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

// Miniature Design Thumbnails matching the real popup templates
function MiniatureDesignThumbnail({ id }: { id: PopupType }) {
  switch (id) {
    case "classic":
    case "center":
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-white dark:bg-slate-900 rounded shadow-2xs p-1 text-center">
          <div className="h-5 w-7 bg-purple-100 dark:bg-purple-950/60 rounded flex items-center justify-center text-[10px] mb-1">
            🎁
          </div>
          <span className="text-[7px] font-bold text-gray-800 dark:text-gray-200">
            Special Offer!
          </span>
          <div className="h-1.5 w-12 bg-purple-600 rounded-full mt-1" />
        </div>
      );

    case "hero-image":
    case "image":
      return (
        <div className="flex flex-col w-full h-full bg-white dark:bg-slate-900 rounded shadow-2xs overflow-hidden">
          <div className="h-9 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 relative flex items-center justify-center">
            <span className="text-[9px] font-bold text-white drop-shadow-xs">HERO BANNER</span>
          </div>
          <div className="p-1 flex flex-col items-center justify-center flex-1">
            <span className="text-[6px] font-bold text-gray-800 dark:text-gray-200">
              New Arrivals
            </span>
            <div className="h-1.5 w-12 bg-purple-600 rounded-full mt-0.5" />
          </div>
        </div>
      );

    case "split":
      return (
        <div className="flex w-full h-full bg-white dark:bg-slate-900 rounded shadow-2xs overflow-hidden">
          <div className="w-[45%] h-full bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center text-white text-xs">
            💎
          </div>
          <div className="w-[55%] p-1 flex flex-col justify-center">
            <span className="text-[5px] font-bold text-purple-600">VIP ACCESS</span>
            <span className="text-[6px] font-bold text-gray-800 dark:text-gray-200 leading-tight">
              Join Exclusive Club
            </span>
            <div className="h-1.5 w-10 bg-gray-900 dark:bg-white rounded-full mt-1" />
          </div>
        </div>
      );

    case "discount":
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-white dark:bg-slate-900 rounded shadow-2xs p-1 text-center">
          <span className="px-1 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 text-[5px] font-bold">
            25% OFF
          </span>
          <span className="text-[6px] font-bold text-gray-800 dark:text-gray-200 mt-0.5">
            Flash Sale
          </span>
          <div className="border border-dashed border-amber-500/60 bg-amber-50/50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded-xs mt-0.5 font-mono text-[5px] font-bold text-amber-700 dark:text-amber-300">
            SAVE25
          </div>
          <div className="h-1.5 w-10 bg-amber-500 rounded-full mt-0.5" />
        </div>
      );

    case "minimal":
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded shadow-2xs p-1 text-center">
          <span className="text-[5px] uppercase tracking-widest text-stone-500">Preview</span>
          <span className="text-[7px] font-serif font-semibold text-stone-800 dark:text-stone-200 mt-0.5">
            Private Collection
          </span>
          <div className="h-1 w-11 bg-stone-800 dark:bg-stone-300 rounded-xs mt-1" />
        </div>
      );

    case "newsletter":
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-white dark:bg-slate-900 rounded shadow-2xs p-1 text-center">
          <span className="text-xs">✉️</span>
          <span className="text-[6px] font-bold text-gray-800 dark:text-gray-200 mt-0.5">
            Join Newsletter
          </span>
          <div className="h-2 w-full max-w-[56px] border border-gray-300 dark:border-gray-700 rounded-xs bg-gray-50 dark:bg-slate-800 mt-0.5" />
          <div className="h-1.5 w-10 bg-purple-600 rounded-full mt-0.5" />
        </div>
      );

    case "slide-in":
    case "bottom-small":
      return (
        <div className="flex items-end justify-end w-full h-full p-0.5">
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border-l-2 border-purple-600 shadow-xs rounded px-1 py-1 w-[90%]">
            <span className="text-[10px]">👋</span>
            <div className="flex flex-col">
              <span className="text-[6px] font-bold text-gray-800 dark:text-gray-200 leading-tight">
                Need Help?
              </span>
              <div className="h-1 w-8 bg-purple-600 rounded-full mt-0.5" />
            </div>
          </div>
        </div>
      );

    case "announcement":
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-white dark:bg-slate-900 rounded shadow-2xs p-1 text-center">
          <span className="text-xs">📢</span>
          <span className="text-[6px] font-bold text-gray-800 dark:text-gray-200 mt-0.5">
            Important Update
          </span>
          <span className="text-[5px] text-muted-foreground">New release is live</span>
          <div className="h-1.5 w-11 bg-blue-600 rounded-full mt-1" />
        </div>
      );

    case "video":
      return (
        <div className="relative flex flex-col items-center justify-center w-full h-full bg-slate-900 rounded shadow-2xs overflow-hidden">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-xs">
            <div className="w-0 h-0 border-y-[3px] border-y-transparent border-l-[5px] border-l-slate-900 ml-0.5" />
          </div>
          <span className="text-[5px] font-semibold text-white/90 mt-1">Product Demo</span>
        </div>
      );

    case "age-verification":
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-white dark:bg-slate-900 rounded shadow-2xs p-1 text-center">
          <div className="flex h-4 w-4 items-center justify-center rounded-full border border-rose-600 text-rose-600 font-bold text-[6px]">
            18+
          </div>
          <span className="text-[6px] font-bold text-gray-800 dark:text-gray-200 mt-0.5">
            Are You 18 or Older?
          </span>
          <div className="flex gap-1 mt-0.5">
            <span className="px-1 py-0.2 bg-purple-600 text-white rounded-xs text-[5px]">Yes</span>
            <span className="px-1 py-0.2 bg-gray-200 text-gray-700 rounded-xs text-[5px]">No</span>
          </div>
        </div>
      );

    case "custom-html":
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded shadow-2xs p-1 text-center font-mono">
          <span className="text-xs text-purple-600 font-bold">&lt;/&gt;</span>
          <span className="text-[6px] font-bold text-gray-800 dark:text-gray-200 mt-0.5">
            Custom HTML
          </span>
        </div>
      );

    default:
      return null;
  }
}
