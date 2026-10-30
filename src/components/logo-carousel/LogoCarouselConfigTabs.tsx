import { useState, useRef, type FC, type ChangeEvent } from "react";
import {
  Sparkles,
  LayoutTemplate,
  Type,
  Sliders,
  Plus,
  Trash2,
  Upload,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Layers,
  Grid,
  Shield,
  Activity,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import type {
  LogoCarouselConfig,
  LogoItem,
  LogoDesignDefinition,
  LogoDesignId,
} from "@/lib/logo-carousel/types";
import { LOGO_DESIGNS, DEFAULT_LOGO_CAROUSEL_CONFIG } from "@/lib/logo-carousel/types";
import { isSafeUrl, getLogoFallbackSvg } from "@/lib/logo-carousel/logoCarouselUtils";
import { MiniatureLogoPreview } from "./MiniatureLogoPreview";
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

interface LogoCarouselConfigTabsProps {
  config: LogoCarouselConfig;
  updateConfig: <K extends keyof LogoCarouselConfig>(
    key: K,
    value: LogoCarouselConfig[K]
  ) => void;
  onSelectDesign?: (design: LogoDesignDefinition) => void;
  onResetDefaults: () => void;
  defaultTab?: string;
}

export const LogoCarouselConfigTabs: FC<LogoCarouselConfigTabsProps> = ({
  config,
  updateConfig,
  onSelectDesign,
  onResetDefaults,
  defaultTab = "designs",
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [activeUploadIndex, setActiveUploadIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Logo items management
  const handleAddLogo = () => {
    const newId = `logo-${Date.now()}`;
    const newLogo: LogoItem = {
      id: newId,
      name: `Partner ${config.logos.length + 1}`,
      imageUrl: getLogoFallbackSvg(`Partner ${config.logos.length + 1}`),
      altText: `Partner ${config.logos.length + 1} logo`,
      websiteUrl: "https://example.com",
      openInNewTab: true,
      enabled: true,
    };
    updateConfig("logos", [...config.logos, newLogo]);
    toast.success("Added new logo slot");
  };

  const handleUpdateLogo = (index: number, patch: Partial<LogoItem>) => {
    const nextLogos = [...config.logos];
    const target = nextLogos[index];
    if (!target) return;
    nextLogos[index] = { ...target, ...patch };
    updateConfig("logos", nextLogos);
  };

  const handleRemoveLogo = (index: number) => {
    if (config.logos.length <= 1) {
      toast.error("You must retain at least one logo.");
      return;
    }
    const removedName = config.logos[index]?.name || "Logo";
    const nextLogos = config.logos.filter((_, i) => i !== index);
    updateConfig("logos", nextLogos);
    toast.info(`Removed ${removedName}`);
  };

  const handleMoveLogo = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= config.logos.length) return;
    const nextLogos = [...config.logos];
    const [moved] = nextLogos.splice(fromIndex, 1);
    if (!moved) return;
    nextLogos.splice(toIndex, 0, moved);
    updateConfig("logos", nextLogos);
  };

  const triggerFileUpload = (index: number) => {
    setActiveUploadIndex(index);
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeUploadIndex === null) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image file is too large (max 2MB).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        handleUpdateLogo(activeUploadIndex, { imageUrl: event.target.result });
        toast.success("Logo uploaded successfully");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const isGrid = config.designId === "logo-grid";

  return (
    <div className="flex h-full flex-col rounded-2xl border bg-card shadow-soft overflow-hidden">
      {/* Hidden File Input for Image Uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/png, image/jpeg, image/svg+xml, image/webp"
        className="hidden"
      />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-1 flex-col overflow-hidden"
      >
        {/* Modern 3 Primary Tabs Header */}
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
                  Select Carousel Design
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Choose from 8 distinct, production-ready layouts.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                8 Templates
              </span>
            </div>

            {/* 8 Design Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LOGO_DESIGNS.map((design) => {
                const isSelected = config.designId === design.id;

                return (
                  <button
                    key={design.id}
                    type="button"
                    onClick={() => {
                      if (onSelectDesign) {
                        onSelectDesign(design);
                      } else {
                        updateConfig("designId", design.id);
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
                    {/* Selected Badge */}
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white shadow-xs animate-in zoom-in-75 duration-100">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                    )}

                    {/* Miniature Preview Frame */}
                    <div className="relative mb-2 flex h-24 w-full items-center justify-center overflow-hidden rounded-lg border border-border/50 bg-muted/30 p-1.5 transition-transform group-hover:scale-[1.02]">
                      <MiniatureLogoPreview id={design.id} />
                      <span className="absolute top-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[8px] font-semibold text-white backdrop-blur-xs">
                        {design.badge}
                      </span>
                    </div>

                    {/* Text Details */}
                    <div className="w-full text-left">
                      <span className="text-xs font-bold text-foreground leading-tight truncate block">
                        {design.name}
                      </span>
                      <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                        {design.subtitle}
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
            {/* 1. Header Section */}
            <div className="rounded-xl border border-border/70 p-3.5 space-y-3 bg-card">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Type className="h-3.5 w-3.5 text-purple-600" />
                  Section Heading
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">Show Heading</span>
                  <Switch
                    checked={config.showHeading}
                    onCheckedChange={(v) => updateConfig("showHeading", v)}
                  />
                </div>
              </div>

              {config.showHeading && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Title</label>
                    <Input
                      value={config.title || ""}
                      maxLength={120}
                      onChange={(e) => updateConfig("title", e.target.value)}
                      placeholder="Trusted by Leading Brands"
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Description</label>
                    <Textarea
                      rows={2}
                      maxLength={250}
                      value={config.description || ""}
                      onChange={(e) => updateConfig("description", e.target.value)}
                      placeholder="Partnering with the world's most innovative organizations."
                      className="text-xs resize-none"
                    />
                  </div>
                </>
              )}
            </div>

            {/* 2. Logo Items List Manager */}
            <div className="rounded-xl border border-border/70 p-3.5 space-y-3 bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-purple-600" />
                    Manage Logos
                  </h4>
                  <p className="text-[10px] text-muted-foreground">
                    Upload, configure, and reorder your brand partners.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddLogo}
                  className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Logo
                </Button>
              </div>

              {/* Logos List */}
              <div className="space-y-2.5 pt-1">
                {config.logos.map((logo, index) => {
                  const hasValidUrl = logo.websiteUrl && isSafeUrl(logo.websiteUrl);

                  return (
                    <div
                      key={logo.id}
                      className={cn(
                        "rounded-xl border p-3 space-y-2.5 transition-all bg-muted/15",
                        logo.enabled === false && "opacity-60 bg-muted/40"
                      )}
                    >
                      {/* Top Bar of item: Thumbnail, Name, Controls */}
                      <div className="flex items-center justify-between gap-2">
                        {/* Thumbnail */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative flex h-10 w-16 shrink-0 items-center justify-center rounded-lg border border-border bg-white overflow-hidden p-1 shadow-2xs">
                            <img
                              src={logo.imageUrl || getLogoFallbackSvg(logo.name)}
                              alt={logo.name}
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-foreground truncate block">
                              {logo.name || `Logo ${index + 1}`}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {logo.enabled !== false ? "Active" : "Disabled"}
                            </span>
                          </div>
                        </div>

                        {/* Actions: Move Up, Move Down, Toggle Enable, Delete */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveLogo(index, index - 1)}
                            className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 rounded hover:bg-muted"
                            title="Move Up"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === config.logos.length - 1}
                            onClick={() => handleMoveLogo(index, index + 1)}
                            className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 rounded hover:bg-muted"
                            title="Move Down"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateLogo(index, { enabled: logo.enabled === false })
                            }
                            className="p-1 text-muted-foreground hover:text-foreground rounded hover:bg-muted"
                            title={logo.enabled !== false ? "Disable" : "Enable"}
                          >
                            {logo.enabled !== false ? (
                              <Eye className="h-3.5 w-3.5" />
                            ) : (
                              <EyeOff className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveLogo(index)}
                            className="p-1 text-destructive hover:bg-destructive/10 rounded"
                            title="Remove Logo"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-border/60">
                        {/* Name */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-foreground">
                            Brand Name
                          </label>
                          <Input
                            value={logo.name}
                            onChange={(e) =>
                              handleUpdateLogo(index, { name: e.target.value })
                            }
                            placeholder="e.g. Acme Corp"
                            className="h-7 text-xs bg-card"
                          />
                        </div>

                        {/* Alt Text */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-foreground">
                            Alt Text
                          </label>
                          <Input
                            value={logo.altText || ""}
                            onChange={(e) =>
                              handleUpdateLogo(index, { altText: e.target.value })
                            }
                            placeholder="Alt description"
                            className="h-7 text-xs bg-card"
                          />
                        </div>
                      </div>

                      {/* Image Source & Upload Button */}
                      <div className="flex items-center gap-2">
                        <Input
                          value={logo.imageUrl}
                          onChange={(e) =>
                            handleUpdateLogo(index, { imageUrl: e.target.value })
                          }
                          placeholder="Image URL (SVG, PNG, WebP)"
                          className="h-7 text-xs font-mono bg-card flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => triggerFileUpload(index)}
                          className="h-7 text-xs px-2.5 rounded-lg shrink-0 border-border/80"
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          Upload
                        </Button>
                      </div>

                      {/* Destination URL & Open New Tab */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                        <div className="sm:col-span-8 space-y-1">
                          <Input
                            value={logo.websiteUrl || ""}
                            onChange={(e) =>
                              handleUpdateLogo(index, { websiteUrl: e.target.value })
                            }
                            placeholder="Destination URL: https://partner.com"
                            className="h-7 text-xs font-mono bg-card"
                          />
                        </div>
                        <div className="sm:col-span-4 flex items-center gap-1.5 pt-0.5">
                          <Checkbox
                            id={`newTab-${logo.id}`}
                            checked={logo.openInNewTab !== false}
                            onCheckedChange={(c) =>
                              handleUpdateLogo(index, { openInNewTab: Boolean(c) })
                            }
                          />
                          <label
                            htmlFor={`newTab-${logo.id}`}
                            className="text-[11px] text-foreground cursor-pointer select-none"
                          >
                            New tab
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* ============================================================== */}
          {/* TAB 3: PREFERENCES */}
          {/* ============================================================== */}
          <TabsContent value="preferences" className="mt-0 space-y-4">
            {/* 1. Layout & Sizing */}
            <div className="rounded-xl border border-border/70 p-3.5 space-y-3 bg-card">
              <h4 className="text-xs font-bold text-foreground">Layout & Sizing</h4>

              {/* Grid Columns (shown when logo-grid is selected) */}
              {isGrid ? (
                <div className="space-y-1.5 rounded-xl border p-2.5 bg-purple-500/5 border-purple-500/20">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-purple-700 dark:text-purple-300">
                      Grid Columns
                    </span>
                    <span className="font-mono font-bold text-purple-600">
                      {config.gridColumns} Columns
                    </span>
                  </div>
                  <Slider
                    value={[config.gridColumns]}
                    min={2}
                    max={6}
                    step={1}
                    onValueChange={([val]) => updateConfig("gridColumns", val ?? 4)}
                  />
                </div>
              ) : (
                /* Visible logos desktop slider */
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">
                      Visible Logos (Desktop)
                    </span>
                    <span className="font-mono font-bold text-purple-600">
                      {config.visibleLogosDesktop} Logos
                    </span>
                  </div>
                  <Slider
                    value={[config.visibleLogosDesktop]}
                    min={2}
                    max={8}
                    step={1}
                    onValueChange={([val]) => updateConfig("visibleLogosDesktop", val ?? 5)}
                  />
                </div>
              )}

              {/* Logo Height */}
              <div className="border-t border-border/70 pt-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Logo Height</span>
                  <span className="font-mono font-bold text-muted-foreground">
                    {config.logoHeight}px
                  </span>
                </div>
                <Slider
                  value={[config.logoHeight]}
                  min={20}
                  max={80}
                  step={2}
                  onValueChange={([val]) => updateConfig("logoHeight", val ?? 38)}
                />
              </div>

              {/* Max Logo Width */}
              <div className="border-t border-border/70 pt-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Max Logo Width</span>
                  <span className="font-mono font-bold text-muted-foreground">
                    {config.maxLogoWidth}px
                  </span>
                </div>
                <Slider
                  value={[config.maxLogoWidth]}
                  min={60}
                  max={220}
                  step={5}
                  onValueChange={([val]) => updateConfig("maxLogoWidth", val ?? 150)}
                />
              </div>

              {/* Gap / Spacing */}
              <div className="border-t border-border/70 pt-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Horizontal Gap</span>
                  <span className="font-mono font-bold text-muted-foreground">
                    {config.gap}px
                  </span>
                </div>
                <Slider
                  value={[config.gap]}
                  min={12}
                  max={64}
                  step={4}
                  onValueChange={([val]) => updateConfig("gap", val ?? 36)}
                />
              </div>

              {/* Section Padding */}
              <div className="border-t border-border/70 pt-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Section Padding</span>
                  <span className="font-mono font-bold text-muted-foreground">
                    {config.paddingY}px
                  </span>
                </div>
                <Slider
                  value={[config.paddingY]}
                  min={12}
                  max={64}
                  step={4}
                  onValueChange={([val]) => updateConfig("paddingY", val ?? 36)}
                />
              </div>
            </div>

            {/* 2. Carousel Behavior (Hidden when in static Logo Grid design!) */}
            {!isGrid && (
              <div className="rounded-xl border border-border/70 p-3.5 space-y-3 bg-card">
                <h4 className="text-xs font-bold text-foreground">Carousel Behavior</h4>

                {/* Autoplay Switch */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-foreground block">
                      Autoplay
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Advance logos automatically
                    </span>
                  </div>
                  <Switch
                    checked={config.autoplay}
                    onCheckedChange={(v) => updateConfig("autoplay", v)}
                  />
                </div>

                {/* Speed / Interval */}
                <div className="border-t border-border/70 pt-2.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">
                      {config.designId === "infinite-marquee"
                        ? "Scroll Speed"
                        : "Autoplay Interval"}
                    </span>
                    <span className="font-mono font-bold text-purple-600">
                      {config.speed}s
                    </span>
                  </div>
                  <Slider
                    value={[config.speed]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={([val]) => updateConfig("speed", val ?? 4)}
                  />
                </div>

                {/* Direction */}
                <div className="border-t border-border/70 pt-2.5 space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">
                    Direction
                  </label>
                  <Select
                    value={config.direction}
                    onValueChange={(v: "left" | "right") => updateConfig("direction", v)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left (Right to Left)</SelectItem>
                      <SelectItem value="right">Right (Left to Right)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Pause on hover & focus */}
                <div className="border-t border-border/70 pt-2.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-foreground">Pause on hover</span>
                    <Switch
                      checked={config.pauseOnHover}
                      onCheckedChange={(v) => updateConfig("pauseOnHover", v)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-foreground">Pause on keyboard focus</span>
                    <Switch
                      checked={config.pauseOnFocus}
                      onCheckedChange={(v) => updateConfig("pauseOnFocus", v)}
                    />
                  </div>
                </div>

                {/* Navigation arrows & dots (only for step carousel) */}
                {config.designId !== "infinite-marquee" && (
                  <div className="border-t border-border/70 pt-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-foreground">Navigation arrows</span>
                      <Switch
                        checked={config.showArrows}
                        onCheckedChange={(v) => updateConfig("showArrows", v)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-foreground">Pagination dots</span>
                      <Switch
                        checked={config.showDots}
                        onCheckedChange={(v) => updateConfig("showDots", v)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. Appearance & Colors */}
            <div className="rounded-xl border border-border/70 p-3.5 space-y-3 bg-card">
              <h4 className="text-xs font-bold text-foreground">Appearance & Styling</h4>

              {/* Background & Text Color */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">
                    Background
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.bgColor === "transparent" ? "#ffffff" : config.bgColor}
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
                    Heading Color
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

              {/* Logo Opacity */}
              <div className="border-t border-border/70 pt-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Logo Opacity</span>
                  <span className="font-mono font-bold text-muted-foreground">
                    {config.logoOpacity}%
                  </span>
                </div>
                <Slider
                  value={[config.logoOpacity]}
                  min={20}
                  max={100}
                  step={5}
                  onValueChange={([val]) => updateConfig("logoOpacity", val ?? 85)}
                />
              </div>

              {/* Grayscale Mode */}
              <div className="border-t border-border/70 pt-2.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground">Grayscale logos</span>
                  <Switch
                    checked={config.grayscale || config.designId === "grayscale-color"}
                    onCheckedChange={(v) => updateConfig("grayscale", v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground">Reveal colors on hover</span>
                  <Switch
                    checked={config.hoverColor}
                    onCheckedChange={(v) => updateConfig("hoverColor", v)}
                  />
                </div>
              </div>

              {/* Premium Cards Options */}
              {config.designId === "premium-cards" && (
                <div className="border-t border-border/70 pt-2.5 space-y-2 bg-muted/20 p-2.5 rounded-lg">
                  <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 block">
                    Card Container Styles
                  </span>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span>Card Radius</span>
                      <span className="font-mono">{config.cardRadius}px</span>
                    </div>
                    <Slider
                      value={[config.cardRadius]}
                      min={0}
                      max={24}
                      step={2}
                      onValueChange={([val]) => updateConfig("cardRadius", val ?? 12)}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-foreground">Card Border</span>
                    <Switch
                      checked={config.showCardBorder}
                      onCheckedChange={(v) => updateConfig("showCardBorder", v)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-foreground">Card Shadow</span>
                    <Switch
                      checked={config.showCardShadow}
                      onCheckedChange={(v) => updateConfig("showCardShadow", v)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Reset to defaults */}
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onResetDefaults}
                className="w-full h-8 text-xs text-destructive hover:bg-destructive/10 border-destructive/30"
              >
                <RotateCcw className="h-3 w-3 mr-1.5" />
                Reset Carousel to Defaults
              </Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

