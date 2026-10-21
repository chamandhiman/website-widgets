import { useState, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  HelpCircle,
  Copy,
  Check,
  ShieldAlert,
  ChevronDown,
  Upload,
  MessageCircle,
  MessageSquare,
  Phone,
  Sliders,
  Settings2,
} from "lucide-react";
import { toast } from "sonner";
import { WhatsAppIcon, WhatsAppLivePreview } from "./WhatsAppLivePreview";
import { PhoneInput } from "./PhoneInput";
import { WhatsAppInstallModal } from "./WhatsAppInstallModal";
import { WidgetEditorHeader } from "@/components/editor/WidgetEditorHeader";
import type {
  WhatsAppWidgetConfig,
  WidgetPosition,
  WidgetSize,
  ButtonIconType,
} from "@/lib/whatsapp/types";
import { validatePhoneNumber, generateWhatsAppLink } from "@/lib/whatsapp/phone";
import { saveWidget } from "@/lib/widgets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const COLOR_SWATCHES = [
  { name: "WhatsApp Green", value: "#25D366" },
  { name: "Forest Green", value: "#128C7E" },
  { name: "Teal Dark", value: "#075E54" },
  { name: "Ocean Blue", value: "#0088CC" },
  { name: "Studio Purple", value: "#8B5CF6" },
  { name: "Dark Slate", value: "#1F2937" },
];

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
];

interface WhatsAppEditorProps {
  initialConfig: WhatsAppWidgetConfig;
  widgetId: string;
  widgetName: string;
  isExisting: boolean;
}

export function WhatsAppEditor({
  initialConfig,
  widgetId,
  widgetName: initialWidgetName,
  isExisting,
}: WhatsAppEditorProps) {
  const navigate = useNavigate();
  const [config, setConfig] = useState<WhatsAppWidgetConfig>(initialConfig);
  const [widgetName, setWidgetName] = useState(initialWidgetName || "WhatsApp Chat");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<string>("setup");
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [showPhoneErrorAlways, setShowPhoneErrorAlways] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to update config properties
  const updateConfig = <K extends keyof WhatsAppWidgetConfig>(
    key: K,
    value: WhatsAppWidgetConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  // Validate phone number
  const phoneValidation = validatePhoneNumber(config.phone, config.countryCode);

  // Generated WhatsApp Link
  const generatedWhatsAppUrl = generateWhatsAppLink(
    config.phone,
    config.countryCode,
    config.prefilledMessage
  );

  // Custom icon upload handler
  const handleCustomIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Only PNG and SVG icons are supported.",
      });
      return;
    }

    if (file.size > 200 * 1024) {
      toast.error("File is too large", {
        description: `Max icon size is 200KB. Your file is ${(file.size / 1024).toFixed(1)}KB.`,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      updateConfig("customIconUrl", result);
      updateConfig("buttonIcon", "custom");
      toast.success("Custom icon uploaded successfully");
    };
    reader.readAsDataURL(file);
  };

  // Publish handler with validation and duplicate prevention
  const handlePublish = async () => {
    if (isPublishing) return;

    if (!phoneValidation.isValid) {
      setShowPhoneErrorAlways(true);
      setActiveTab("setup");
      toast.error("Invalid WhatsApp Phone Number", {
        description: phoneValidation.error || "Please enter a valid WhatsApp number.",
      });
      return;
    }

    setIsPublishing(true);
    try {
      saveWidget({
        id: widgetId,
        type: "whatsapp-chat",
        name: widgetName || "WhatsApp Chat",
        config: config as any,
        updatedAt: Date.now(),
      });

      if (typeof window !== "undefined") {
        (window as any).WTO_WHATSAPP_CONFIGS = (window as any).WTO_WHATSAPP_CONFIGS || {};
        (window as any).WTO_WHATSAPP_CONFIGS[widgetId] = config;
      }

      await new Promise((r) => setTimeout(r, 400));
      toast.success("WhatsApp widget published successfully!", {
        description: "Your widget configuration is live and ready to install.",
      });

      if (!isExisting) {
        navigate({
          to: "/editor/$type",
          params: { type: "whatsapp-chat" },
          search: { id: widgetId },
          replace: true,
        });
      }
    } catch (err) {
      toast.error("Failed to publish widget", {
        description: err instanceof Error ? err.message : "An unexpected error occurred.",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Install handler with validation
  const handleInstallClick = () => {
    if (!phoneValidation.isValid) {
      setShowPhoneErrorAlways(true);
      setActiveTab("setup");
      toast.error("Validation required", {
        description: phoneValidation.error || "Please enter a valid WhatsApp phone number before installing.",
      });
      return;
    }
    setInstallModalOpen(true);
  };

  const copyWhatsAppLink = async () => {
    if (!generatedWhatsAppUrl) return;
    try {
      await navigator.clipboard.writeText(generatedWhatsAppUrl);
      setCopiedLink(true);
      toast.success("WhatsApp link copied!");
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const positionOptions: { id: WidgetPosition; label: string }[] = [
    { id: "bottom-left", label: "Bottom Left" },
    { id: "bottom-right", label: "Bottom Right" },
    { id: "top-left", label: "Top Left" },
    { id: "top-right", label: "Top Right" },
  ];

  const iconOptions: { id: ButtonIconType; label: string; component: React.ReactNode }[] = [
    { id: "whatsapp", label: "WhatsApp", component: <WhatsAppIcon className="h-4 w-4 text-emerald-500" /> },
    { id: "message-circle", label: "Circle", component: <MessageCircle className="h-4 w-4" /> },
    { id: "speech-bubble", label: "Bubble", component: <MessageSquare className="h-4 w-4" /> },
    { id: "phone", label: "Phone", component: <Phone className="h-4 w-4" /> },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ================= TOP HEADER ================= */}
      <WidgetEditorHeader
        backTo="/widgets"
        backTooltip="Back to widgets"
        icon={<WhatsAppIcon className="h-5 w-5" />}
        iconBgClass="bg-purple-600"
        title="WhatsApp Chat"
        subtitle="Floating chat button that opens WhatsApp and lets your visitors contact you directly."
        statusText="Ready"
        isPublishing={isPublishing}
        onInstall={handleInstallClick}
        onPublish={handlePublish}
      />

      {/* ================= MAIN TWO-COLUMN LAYOUT ================= */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* ================= LEFT COLUMN: CONFIGURATION PANEL ================= */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border bg-card p-5 shadow-xs">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* 4 Clean Tabs: Setup, Style, Position, Behavior */}
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
                  <TabsTrigger value="behavior" className="text-xs py-1.5 font-semibold">
                    Behavior
                  </TabsTrigger>
                </TabsList>

                {/* ───────────────────────────────────────────────────────────── */}
                {/* TAB 1: SETUP */}
                {/* ───────────────────────────────────────────────────────────── */}
                <TabsContent value="setup" className="mt-5 space-y-4">
                  {/* WhatsApp Number with Country Selector */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs font-bold text-foreground">
                        WhatsApp Number
                      </label>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <PhoneInput
                      countryCode={config.countryCode}
                      nationalNumber={config.phone}
                      onCountryChange={(c) => {
                        updateConfig("countryCode", c.code);
                        updateConfig("callingCode", c.callingCode);
                      }}
                      onNumberChange={(num) => {
                        updateConfig("phone", num);
                      }}
                      showErrorAlways={showPhoneErrorAlways}
                    />
                  </div>

                  {/* Chat Message */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-foreground">Chat Message</label>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {config.chatMessage.length}/200
                      </span>
                    </div>
                    <Textarea
                      rows={2}
                      maxLength={200}
                      value={config.chatMessage}
                      onChange={(e) => updateConfig("chatMessage", e.target.value)}
                      placeholder="Hello! How can we help you?"
                      className="resize-none text-xs"
                    />
                  </div>

                  {/* Button Text */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-foreground">Button Text</label>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {config.buttonText.length}/30
                      </span>
                    </div>
                    <Input
                      maxLength={30}
                      value={config.buttonText}
                      onChange={(e) => updateConfig("buttonText", e.target.value)}
                      placeholder="Chat with us"
                      className="text-xs h-9"
                    />
                  </div>

                  {/* Agent Information (Optional) */}
                  <div className="space-y-3 rounded-xl border bg-muted/20 p-3.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-foreground">Agent Information</label>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="show-agent-avatar"
                          checked={config.showAgent}
                          onCheckedChange={(checked) => updateConfig("showAgent", Boolean(checked))}
                        />
                        <label
                          htmlFor="show-agent-avatar"
                          className="text-xs font-medium text-foreground cursor-pointer select-none"
                        >
                          Show
                        </label>
                      </div>
                    </div>

                    {config.showAgent && (
                      <div className="space-y-3 pt-1 border-t border-border/60">
                        <div className="flex items-center gap-3">
                          <img
                            src={config.agentAvatar}
                            alt={config.agentName}
                            className="h-10 w-10 rounded-full border border-border object-cover shadow-xs shrink-0"
                          />
                          <div className="flex-1 space-y-1">
                            <label className="text-[11px] font-medium text-muted-foreground">
                              Agent Name
                            </label>
                            <Input
                              value={config.agentName}
                              onChange={(e) => updateConfig("agentName", e.target.value)}
                              placeholder="e.g. Priya Sharma"
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <label className="text-[11px] font-medium text-muted-foreground">
                              Role
                            </label>
                            <Input
                              value={config.agentRole}
                              onChange={(e) => updateConfig("agentRole", e.target.value)}
                              placeholder="e.g. Support Team"
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>

                        {/* Quick Avatar Presets */}
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[10px] text-muted-foreground">Avatar presets:</span>
                          <div className="flex gap-1.5">
                            {PRESET_AVATARS.map((url, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => updateConfig("agentAvatar", url)}
                                className={cn(
                                  "h-6 w-6 rounded-full overflow-hidden border transition-all",
                                  config.agentAvatar === url
                                    ? "ring-2 ring-primary border-transparent scale-110"
                                    : "opacity-70 hover:opacity-100"
                                )}
                              >
                                <img src={url} alt={`Preset ${idx + 1}`} className="h-full w-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Welcome Message */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-foreground">Welcome Message</label>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {config.welcomeMessage.length}/200
                      </span>
                    </div>
                    <Textarea
                      rows={2}
                      maxLength={200}
                      value={config.welcomeMessage}
                      onChange={(e) => updateConfig("welcomeMessage", e.target.value)}
                      placeholder="Hi there! 👋&#10;How can we help you today?"
                      className="resize-none text-xs"
                    />
                  </div>

                  {/* Pre-filled Message (Optional) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-foreground">
                        Pre-filled Message (Optional)
                      </label>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {config.prefilledMessage.length}/200
                      </span>
                    </div>
                    <Input
                      maxLength={200}
                      value={config.prefilledMessage}
                      onChange={(e) => updateConfig("prefilledMessage", e.target.value)}
                      placeholder="I would like to know more about your services."
                      className="text-xs h-9"
                    />
                  </div>
                </TabsContent>

                {/* ───────────────────────────────────────────────────────────── */}
                {/* TAB 2: STYLE */}
                {/* ───────────────────────────────────────────────────────────── */}
                <TabsContent value="style" className="mt-5 space-y-4">
                  {/* Primary Color Picker */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground block">Primary Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => updateConfig("primaryColor", e.target.value)}
                        className="h-9 w-10 cursor-pointer rounded-lg border bg-transparent p-0.5"
                      />
                      <Input
                        value={config.primaryColor}
                        onChange={(e) => updateConfig("primaryColor", e.target.value)}
                        className="h-9 font-mono text-xs w-32"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {COLOR_SWATCHES.map((swatch) => (
                        <button
                          key={swatch.value}
                          type="button"
                          onClick={() => updateConfig("primaryColor", swatch.value)}
                          className={cn(
                            "h-6 w-6 rounded-md border shadow-2xs transition-transform hover:scale-105",
                            config.primaryColor === swatch.value && "ring-2 ring-primary ring-offset-1"
                          )}
                          style={{ backgroundColor: swatch.value }}
                          title={swatch.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Button Size */}
                  <div className="border-t border-border/70 pt-3.5 space-y-2">
                    <label className="text-xs font-bold text-foreground block">Button Size</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["small", "medium", "large"] as WidgetSize[]).map((sz) => (
                        <Button
                          key={sz}
                          type="button"
                          variant={config.buttonSize === sz ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateConfig("buttonSize", sz)}
                          className="h-8 text-xs capitalize"
                        >
                          {sz}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Button Icon Selection */}
                  <div className="border-t border-border/70 pt-3.5 space-y-2">
                    <label className="text-xs font-bold text-foreground block">Button Icon</label>
                    <div className="grid grid-cols-4 gap-2">
                      {iconOptions.map((ico) => {
                        const isSelected = config.buttonIcon === ico.id;
                        return (
                          <button
                            key={ico.id}
                            type="button"
                            onClick={() => updateConfig("buttonIcon", ico.id)}
                            className={cn(
                              "flex flex-col items-center justify-center rounded-xl border p-2 text-xs transition",
                              isSelected
                                ? "border-primary bg-primary/10 ring-1 ring-primary font-bold text-primary"
                                : "border-border/70 hover:bg-muted/40 text-muted-foreground"
                            )}
                          >
                            <div className="mb-1">{ico.component}</div>
                            <span className="text-[10px] truncate">{ico.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Optional Custom Icon Upload */}
                    <div className="pt-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleCustomIconUpload}
                        accept="image/png,image/svg+xml"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-7 text-xs w-full"
                      >
                        <Upload className="h-3 w-3 mr-1.5" />
                        {config.customIconUrl ? "Replace Custom Icon" : "Upload Custom Icon (PNG/SVG)"}
                      </Button>
                      {config.customIconUrl && (
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1.5 px-1">
                          <span>Custom icon active</span>
                          <button
                            type="button"
                            onClick={() => {
                              updateConfig("customIconUrl", "");
                              updateConfig("buttonIcon", "whatsapp");
                            }}
                            className="text-destructive hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Border Radius */}
                  <div className="border-t border-border/70 pt-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-foreground">Corner Radius</label>
                      <span className="text-xs font-mono text-muted-foreground">{config.borderRadius}px</span>
                    </div>
                    <Slider
                      min={0}
                      max={28}
                      step={2}
                      value={[config.borderRadius]}
                      onValueChange={(val) => updateConfig("borderRadius", val[0] ?? 16)}
                    />
                  </div>
                </TabsContent>

                {/* ───────────────────────────────────────────────────────────── */}
                {/* TAB 3: POSITION */}
                {/* ───────────────────────────────────────────────────────────── */}
                <TabsContent value="position" className="mt-5 space-y-4">
                  {/* Floating Position */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground block">
                      Screen Position
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {positionOptions.map((p) => {
                        const isSelected = config.position === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => updateConfig("position", p.id)}
                            className={cn(
                              "relative flex flex-col items-center justify-center rounded-xl border p-3 text-xs transition",
                              isSelected
                                ? "border-primary bg-primary/10 ring-1 ring-primary font-bold text-primary shadow-xs"
                                : "border-border/70 hover:bg-muted/40 text-muted-foreground"
                            )}
                          >
                            {isSelected && (
                              <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-white">
                                <Check className="h-2 w-2 stroke-[3]" />
                              </span>
                            )}
                            {/* Miniature Position Diagram */}
                            <div className="h-7 w-12 rounded border border-border/80 bg-muted/40 mb-1.5 relative overflow-hidden">
                              <span
                                className={cn(
                                  "absolute h-2 w-2 rounded-full",
                                  isSelected ? "bg-primary" : "bg-muted-foreground/60",
                                  p.id === "bottom-left" && "bottom-1 left-1",
                                  p.id === "bottom-right" && "bottom-1 right-1",
                                  p.id === "top-left" && "top-1 left-1",
                                  p.id === "top-right" && "top-1 right-1"
                                )}
                              />
                            </div>
                            <span>{p.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Spacing from edge */}
                  <div className="border-t border-border/70 pt-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-foreground">Edge Spacing</label>
                      <span className="text-xs font-mono text-muted-foreground">{config.spacing}px</span>
                    </div>
                    <Slider
                      min={10}
                      max={36}
                      step={2}
                      value={[config.spacing]}
                      onValueChange={(val) => updateConfig("spacing", val[0] ?? 20)}
                    />
                  </div>

                  {/* Device Visibility */}
                  <div className="border-t border-border/70 pt-3.5 space-y-2.5">
                    <label className="text-xs font-bold text-foreground block">
                      Device Visibility
                    </label>
                    <div className="flex items-center justify-between rounded-xl border p-3">
                      <div>
                        <p className="text-xs font-semibold text-foreground">Visible on Desktop</p>
                        <p className="text-[11px] text-muted-foreground">Show button on desktop screens</p>
                      </div>
                      <Switch
                        checked={config.visibilityDesktop}
                        onCheckedChange={(v) => updateConfig("visibilityDesktop", v)}
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border p-3">
                      <div>
                        <p className="text-xs font-semibold text-foreground">Visible on Mobile</p>
                        <p className="text-[11px] text-muted-foreground">Show button on mobile & tablets</p>
                      </div>
                      <Switch
                        checked={config.visibilityMobile}
                        onCheckedChange={(v) => updateConfig("visibilityMobile", v)}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* ───────────────────────────────────────────────────────────── */}
                {/* TAB 4: BEHAVIOR */}
                {/* ───────────────────────────────────────────────────────────── */}
                <TabsContent value="behavior" className="mt-5 space-y-4">
                  {/* Show Chat Popup by default */}
                  <div className="flex items-center justify-between rounded-xl border p-3">
                    <div>
                      <p className="text-xs font-semibold text-foreground">Show Chat Popup by Default</p>
                      <p className="text-[11px] text-muted-foreground">Open the welcome chat bubble on page load</p>
                    </div>
                    <Switch
                      checked={config.showChatPopup}
                      onCheckedChange={(v) => updateConfig("showChatPopup", v)}
                    />
                  </div>

                  {/* Open in New Tab */}
                  <div className="flex items-center justify-between rounded-xl border p-3">
                    <div>
                      <p className="text-xs font-semibold text-foreground">Open WhatsApp in New Tab</p>
                      <p className="text-[11px] text-muted-foreground">Keep visitors on your website when launching chat</p>
                    </div>
                    <Switch
                      checked={config.openInNewTab}
                      onCheckedChange={(v) => updateConfig("openInNewTab", v)}
                    />
                  </div>

                  {/* Auto-open Greeting */}
                  <div className="space-y-3 rounded-xl border p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-foreground">Auto-Open Greeting</p>
                        <p className="text-[11px] text-muted-foreground">Automatically expand greeting bubble after delay</p>
                      </div>
                      <Switch
                        checked={config.autoOpenGreeting}
                        onCheckedChange={(v) => updateConfig("autoOpenGreeting", v)}
                      />
                    </div>
                    {config.autoOpenGreeting && (
                      <div className="pt-2 border-t space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-muted-foreground">Greeting Delay:</span>
                          <span className="font-mono font-bold text-primary">{config.greetingDelay}s</span>
                        </div>
                        <Slider
                          min={1}
                          max={20}
                          step={1}
                          value={[config.greetingDelay]}
                          onValueChange={(val) => updateConfig("greetingDelay", val[0] ?? 3)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Generated WhatsApp Link Preview */}
                  <div className="rounded-xl border bg-muted/30 p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Generated WhatsApp Link</span>
                      {generatedWhatsAppUrl && (
                        <button
                          type="button"
                          onClick={copyWhatsAppLink}
                          className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                        >
                          {copiedLink ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          {copiedLink ? "Copied" : "Copy Link"}
                        </button>
                      )}
                    </div>
                    {generatedWhatsAppUrl ? (
                      <p className="font-mono text-[11px] break-all bg-background p-2 rounded-lg border text-muted-foreground">
                        {generatedWhatsAppUrl}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <ShieldAlert className="h-3.5 w-3.5 text-muted-foreground" />
                        Enter a phone number in Setup to preview link.
                      </p>
                    )}
                  </div>

                  {/* Expandable "More options" (Minimal, unobtrusive) */}
                  <div className="border-t border-border/70 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAdvancedOptions((prev) => !prev)}
                      className="flex items-center justify-between w-full py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                    >
                      <span className="flex items-center gap-1.5">
                        <Settings2 className="h-3.5 w-3.5" />
                        More options
                      </span>
                      <ChevronDown
                        className={cn("h-3.5 w-3.5 transition-transform", showAdvancedOptions && "rotate-180")}
                      />
                    </button>

                    {showAdvancedOptions && (
                      <div className="mt-3 space-y-3 rounded-xl border bg-muted/20 p-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-foreground">Custom CSS Class</label>
                          <Input
                            value={config.customCssClass}
                            onChange={(e) => updateConfig("customCssClass", e.target.value)}
                            placeholder="e.g. my-whatsapp-button"
                            className="text-xs h-8 bg-card"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-foreground">Widget Identifier</label>
                          <Input value={widgetId} readOnly className="font-mono text-xs h-8 bg-muted/40" />
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: LIVE PREVIEW ONLY ================= */}
          <div className="lg:col-span-7">
            <WhatsAppLivePreview
              config={config}
              viewport={viewport}
              onViewportChange={setViewport}
            />
          </div>
        </div>
      </main>

      {/* ================= INSTALL WIDGET DIALOG ================= */}
      <WhatsAppInstallModal
        open={installModalOpen}
        onOpenChange={setInstallModalOpen}
        widgetId={widgetId}
        config={config}
      />
    </div>
  );
}
