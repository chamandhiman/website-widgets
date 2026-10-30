import { useState } from "react";
import {
  Calendar,
  Clock,
  Palette,
  Sliders,
  Type,
  Globe,
  Sparkles,
  Check,
  LayoutTemplate,
  Link as LinkIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COUNTDOWN_DESIGNS,
  type CountdownConfig,
  type CountdownDesignDefinition,
} from "@/lib/countdown/types";
import { cn } from "@/lib/utils";

interface CountdownConfigTabsProps {
  config: CountdownConfig;
  onChange: <K extends keyof CountdownConfig>(key: K, value: CountdownConfig[K]) => void;
  onSelectDesign: (design: CountdownDesignDefinition) => void;
}

export function CountdownConfigTabs({
  config,
  onChange,
  onSelectDesign,
}: CountdownConfigTabsProps) {
  const [activeTab, setActiveTab] = useState("designs");

  return (
    <div className="flex h-full flex-col rounded-2xl border bg-card shadow-soft overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col overflow-hidden">
        {/* Tab Switcher: Designs -> Content -> Preferences */}
        <div className="border-b px-4 pt-3 pb-2 bg-muted/20 shrink-0">
          <TabsList className="grid w-full grid-cols-3 bg-muted/60 p-1">
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
        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
          {/* ================= TAB 1: DESIGNS ================= */}
          <TabsContent value="designs" className="mt-0 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                  Select Countdown Design
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Choose from 6 unique, professionally crafted layouts.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                6 Templates
              </span>
            </div>

            {/* Design Selection Cards */}
            <div className="space-y-3">
              {COUNTDOWN_DESIGNS.map((design) => {
                const isSelected = config.designId === design.id;

                return (
                  <div
                    key={design.id}
                    onClick={() => onSelectDesign(design)}
                    className={cn(
                      "group relative flex flex-col gap-2.5 rounded-xl border p-3.5 transition-all cursor-pointer bg-card hover:bg-muted/30",
                      isSelected
                        ? "border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/10 shadow-xs"
                        : "border-border/80 hover:border-border"
                    )}
                  >
                    {/* Top Row: Switch, Name, Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Switch
                          checked={isSelected}
                          onCheckedChange={() => onSelectDesign(design)}
                          aria-label={`Select ${design.name}`}
                          className="data-[state=checked]:bg-purple-600"
                        />
                        <span className="text-xs font-bold text-foreground">
                          {design.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                        {design.badgeLabel}
                      </span>
                    </div>

                    {/* Miniature Visual Preview of the Design */}
                    <div className="mt-1 rounded-lg border bg-slate-50 dark:bg-slate-900/50 p-2.5 overflow-hidden select-none">
                      {design.id === "cards" && (
                        <div className="flex items-center justify-center gap-2">
                          {["02", "14", "09", "45"].map((num, i) => (
                            <div
                              key={i}
                              className="h-9 w-10 rounded-md bg-purple-600 flex flex-col items-center justify-center text-white shadow-2xs"
                            >
                              <span className="text-xs font-black leading-none">{num}</span>
                              <span className="text-[7px] font-bold opacity-80 uppercase mt-0.5">
                                {["D", "H", "M", "S"][i]}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {design.id === "minimal" && (
                        <div className="flex items-center justify-center gap-4 py-1">
                          {["02", "14", "09", "45"].map((num, i) => (
                            <div key={i} className="flex flex-col items-center">
                              <span className="text-sm font-extrabold text-foreground tracking-tight leading-none">
                                {num}
                              </span>
                              <span className="text-[8px] font-medium text-muted-foreground uppercase mt-0.5">
                                {["Days", "Hours", "Min", "Sec"][i]}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {design.id === "circular" && (
                        <div className="flex items-center justify-center gap-2.5 py-0.5">
                          {["02", "14", "09", "45"].map((num, i) => (
                            <div
                              key={i}
                              className="h-10 w-10 rounded-full border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/40 flex flex-col items-center justify-center shadow-2xs"
                            >
                              <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 leading-none">
                                {num}
                              </span>
                              <span className="text-[6px] font-bold text-blue-500 uppercase">
                                {["D", "H", "M", "S"][i]}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {design.id === "flip" && (
                        <div className="flex items-center justify-center gap-2">
                          {["02", "14", "09", "45"].map((num, i) => (
                            <div
                              key={i}
                              className="relative h-9 w-10 rounded bg-zinc-800 border border-zinc-700 flex flex-col items-center justify-center text-amber-400 shadow-2xs overflow-hidden"
                            >
                              <div className="absolute inset-x-0 top-1/2 h-px bg-zinc-950 z-10" />
                              <span className="text-xs font-mono font-black">{num}</span>
                              <span className="text-[7px] font-mono text-zinc-400 uppercase">
                                {["D", "H", "M", "S"][i]}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {design.id === "banner" && (
                        <div className="flex items-center justify-between gap-2 rounded-md bg-slate-900 px-3 py-1.5 text-white">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="rounded bg-amber-500 px-1 py-0.5 text-[8px] font-bold text-slate-950">
                              DEAL
                            </span>
                            <span className="text-[10px] font-semibold truncate">Limited Offer:</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {["02", "14", "09"].map((num, i) => (
                              <span
                                key={i}
                                className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono font-bold text-amber-400"
                              >
                                {num}
                              </span>
                            ))}
                          </div>
                          <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[8px] font-bold text-slate-950 shrink-0">
                            Claim
                          </span>
                        </div>
                      )}

                      {design.id === "elegant" && (
                        <div className="flex items-center justify-center gap-3 py-1 font-serif border-y border-amber-900/15">
                          {["02", "14", "09", "45"].map((num, i) => (
                            <div key={i} className="flex flex-col items-center px-1">
                              <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                                {num}
                              </span>
                              <span className="text-[7px] tracking-widest uppercase text-stone-500 font-sans mt-0.5">
                                {["Days", "Hours", "Min", "Sec"][i]}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                      {design.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* ================= TAB 2: CONTENT ================= */}
          <TabsContent value="content" className="mt-0 space-y-6">
            {/* Headline */}
            <div className="space-y-2">
              <Label htmlFor="countdown-title" className="text-xs font-semibold text-foreground">
                Headline / Title
              </Label>
              <Input
                id="countdown-title"
                value={config.title}
                onChange={(e) => onChange("title", e.target.value)}
                placeholder="e.g. Summer Sale Ends In"
                className="h-10 text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                Headline displayed prominently with the countdown.
              </p>
            </div>

            {/* Target Date & Time */}
            <div className="space-y-2">
              <Label
                htmlFor="countdown-target"
                className="text-xs font-semibold text-foreground flex items-center gap-1.5"
              >
                <Calendar className="h-3.5 w-3.5 text-primary" />
                Target Date & Time
              </Label>
              <Input
                id="countdown-target"
                type="datetime-local"
                value={
                  config.target.includes("T")
                    ? config.target.slice(0, 16)
                    : `${config.target}T23:59`
                }
                onChange={(e) => onChange("target", e.target.value)}
                className="h-10 text-sm font-mono"
              />
              <p className="text-[11px] text-muted-foreground">
                The exact date and time the countdown timer will count down to.
              </p>
            </div>

            {/* Timezone */}
            <div className="space-y-2">
              <Label
                htmlFor="countdown-timezone"
                className="text-xs font-semibold text-foreground flex items-center gap-1.5"
              >
                <Globe className="h-3.5 w-3.5 text-primary" />
                Timezone
              </Label>
              <Select
                value={config.timezone || "Local"}
                onValueChange={(val) => onChange("timezone", val as "Local" | "UTC")}
              >
                <SelectTrigger id="countdown-timezone" className="h-10 text-sm">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Local">Visitor's Local Timezone (Browser)</SelectItem>
                  <SelectItem value="UTC">Coordinated Universal Time (UTC)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">
                Calculate remaining time using local device time or universal UTC.
              </p>
            </div>

            {/* Completion Message */}
            <div className="space-y-2">
              <Label
                htmlFor="countdown-expiry"
                className="text-xs font-semibold text-foreground flex items-center gap-1.5"
              >
                <Clock className="h-3.5 w-3.5 text-primary" />
                Completion Message
              </Label>
              <Input
                id="countdown-expiry"
                value={config.expiryMessage}
                onChange={(e) => onChange("expiryMessage", e.target.value)}
                placeholder="e.g. This offer has ended."
                className="h-10 text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                Message shown when time reaches zero or for past dates.
              </p>
            </div>

            {/* Banner Specific Settings (if Banner design selected) */}
            {config.designId === "banner" && (
              <div className="space-y-3 pt-3 border-t">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <LinkIcon className="h-3.5 w-3.5 text-primary" />
                  Banner Button & Badge
                </Label>
                <div className="space-y-2">
                  <span className="text-xs text-muted-foreground">CTA Button Label</span>
                  <Input
                    value={config.bannerCtaText || "Claim Offer"}
                    onChange={(e) => onChange("bannerCtaText", e.target.value)}
                    placeholder="e.g. Claim Offer"
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-xs text-muted-foreground">CTA Button Link</span>
                  <Input
                    value={config.bannerCtaLink || ""}
                    onChange={(e) => onChange("bannerCtaLink", e.target.value)}
                    placeholder="https://example.com/deal"
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            )}
          </TabsContent>

          {/* ================= TAB 3: PREFERENCES ================= */}
          <TabsContent value="preferences" className="mt-0 space-y-6">
            {/* Units Display */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-foreground">Visible Units</Label>
              <div className="space-y-2.5 rounded-xl border bg-muted/20 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground font-medium">Show Days</span>
                  <Switch
                    checked={config.showDays}
                    onCheckedChange={(val) => onChange("showDays", val)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground font-medium">Show Hours</span>
                  <Switch
                    checked={config.showHours}
                    onCheckedChange={(val) => onChange("showHours", val)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground font-medium">Show Minutes</span>
                  <Switch
                    checked={config.showMinutes}
                    onCheckedChange={(val) => onChange("showMinutes", val)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground font-medium">Show Seconds</span>
                  <Switch
                    checked={config.showSeconds}
                    onCheckedChange={(val) => onChange("showSeconds", val)}
                  />
                </div>
              </div>
            </div>

            {/* Expiration Behavior */}
            <div className="space-y-2">
              <Label htmlFor="countdown-expire-action" className="text-xs font-semibold text-foreground">
                Action When Countdown Ends
              </Label>
              <Select
                value={config.expireAction || "message"}
                onValueChange={(val) => onChange("expireAction", val as "message" | "hide")}
              >
                <SelectTrigger id="countdown-expire-action" className="h-10 text-sm">
                  <SelectValue placeholder="Expiration action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="message">Display completion message</SelectItem>
                  <SelectItem value="hide">Hide widget completely</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Styling & Colors */}
            <div className="space-y-3.5 pt-2 border-t">
              <Label className="text-xs font-semibold text-foreground">Custom Colors</Label>

              {/* Accent / Number Color */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-foreground">Accent / Numbers</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.accent || "#7c3aed"}
                    onChange={(e) => onChange("accent", e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded-lg border bg-transparent p-0.5"
                  />
                  <Input
                    value={config.accent || "#7c3aed"}
                    onChange={(e) => onChange("accent", e.target.value)}
                    className="h-8 w-24 font-mono text-xs uppercase"
                  />
                </div>
              </div>

              {/* Box / Badge Background */}
              {config.style !== "Minimal" && (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-foreground">Unit Background</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.boxBg || config.accent || "#7c3aed"}
                      onChange={(e) => onChange("boxBg", e.target.value)}
                      className="h-8 w-10 cursor-pointer rounded-lg border bg-transparent p-0.5"
                    />
                    <Input
                      value={config.boxBg || config.accent || "#7c3aed"}
                      onChange={(e) => onChange("boxBg", e.target.value)}
                      className="h-8 w-24 font-mono text-xs uppercase"
                    />
                  </div>
                </div>
              )}

              {/* Headline Color */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-foreground">Headline Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.text || "#0f172a"}
                    onChange={(e) => onChange("text", e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded-lg border bg-transparent p-0.5"
                  />
                  <Input
                    value={config.text || "#0f172a"}
                    onChange={(e) => onChange("text", e.target.value)}
                    className="h-8 w-24 font-mono text-xs uppercase"
                  />
                </div>
              </div>

              {/* Card Background */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-foreground">Container Background</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.bg || "#ffffff"}
                    onChange={(e) => onChange("bg", e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded-lg border bg-transparent p-0.5"
                  />
                  <Input
                    value={config.bg || "#ffffff"}
                    onChange={(e) => onChange("bg", e.target.value)}
                    className="h-8 w-24 font-mono text-xs uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Sizing & Geometry */}
            <div className="space-y-4 pt-2 border-t">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-foreground">Border Radius</span>
                  <span className="text-muted-foreground font-mono">{config.radius}px</span>
                </div>
                <Slider
                  min={0}
                  max={32}
                  step={2}
                  value={[config.radius]}
                  onValueChange={(val) => onChange("radius", val[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-foreground">Container Padding</span>
                  <span className="text-muted-foreground font-mono">{config.padding}px</span>
                </div>
                <Slider
                  min={8}
                  max={48}
                  step={4}
                  value={[config.padding]}
                  onValueChange={(val) => onChange("padding", val[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-foreground">Max Width</span>
                  <span className="text-muted-foreground font-mono">{config.width}px</span>
                </div>
                <Slider
                  min={320}
                  max={1100}
                  step={20}
                  value={[config.width]}
                  onValueChange={(val) => onChange("width", val[0])}
                />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
