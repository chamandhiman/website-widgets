import { useState, type FC } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Layers } from "lucide-react";
import { toast } from "sonner";
import { LogoCarouselConfigTabs } from "./LogoCarouselConfigTabs";
import { LogoCarouselLivePreview } from "./LogoCarouselLivePreview";
import { LogoCarouselInstallModal } from "./LogoCarouselInstallModal";
import { WidgetEditorHeader } from "@/components/editor/WidgetEditorHeader";
import type {
  LogoCarouselConfig,
  LogoDesignDefinition,
} from "@/lib/logo-carousel/types";
import { saveWidget } from "@/lib/widgets";

interface LogoCarouselEditorProps {
  initialConfig: LogoCarouselConfig;
  widgetId: string;
  widgetName: string;
  isExisting: boolean;
  initialWebsite?: string;
}

export const LogoCarouselEditor: FC<LogoCarouselEditorProps> = ({
  initialConfig,
  widgetId,
  widgetName: initialWidgetName,
  isExisting,
  initialWebsite = "",
}) => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<LogoCarouselConfig>(initialConfig);
  const [widgetName, setWidgetName] = useState(initialWidgetName || "Logo Carousel");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const updateConfig = <K extends keyof LogoCarouselConfig>(
    key: K,
    value: LogoCarouselConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectDesign = (design: LogoDesignDefinition) => {
    setConfig((prev) => ({
      ...prev,
      designId: design.id,
      // Preserve all user added logos, titles, and layout measurements
      logos: prev.logos,
      title: prev.title,
      description: prev.description,
      showHeading: prev.showHeading,
      visibleLogosDesktop: prev.visibleLogosDesktop,
      logoHeight: prev.logoHeight,
      maxLogoWidth: prev.maxLogoWidth,
      gap: prev.gap,
      paddingY: prev.paddingY,
      autoplay: prev.autoplay,
      speed: prev.speed,
      direction: prev.direction,
      pauseOnHover: prev.pauseOnHover,
      pauseOnFocus: prev.pauseOnFocus,
      showArrows: prev.showArrows,
      showDots: prev.showDots,
      loop: prev.loop,
    }));
    setResetKey((k) => k + 1);
    toast.info(`Applied design: ${design.name}`);
  };

  const handleResetDefaults = () => {
    setConfig((prev) => ({
      ...prev,
      visibleLogosDesktop: 5,
      logoHeight: 38,
      maxLogoWidth: 150,
      gap: 36,
      gridColumns: 4,
      paddingY: 36,
      containerWidth: "contained",
      autoplay: true,
      speed: 4,
      direction: "left",
      pauseOnHover: true,
      pauseOnFocus: true,
      showArrows: true,
      showDots: true,
      loop: true,
      bgColor: "transparent",
      textColor: "#1E293B",
      logoOpacity: 85,
      grayscale: false,
      hoverColor: true,
      cardRadius: 12,
      showCardBorder: true,
      showCardShadow: false,
    }));
    setResetKey((k) => k + 1);
    toast.success("Reset settings to default");
  };

  const handlePublish = async () => {
    if (isPublishing) return;

    setIsPublishing(true);
    try {
      saveWidget({
        id: widgetId,
        type: "logo-carousel",
        name: widgetName || "Logo Carousel",
        config: config as any,
        updatedAt: Date.now(),
        website: initialWebsite || "",
      });

      if (typeof window !== "undefined") {
        (window as any).WTO_LOGO_CAROUSEL_CONFIGS =
          (window as any).WTO_LOGO_CAROUSEL_CONFIGS || {};
        (window as any).WTO_LOGO_CAROUSEL_CONFIGS[widgetId] = config;
        (window as any).WTO_DEMO_CONFIG = (window as any).WTO_DEMO_CONFIG || {};
        (window as any).WTO_DEMO_CONFIG[widgetId] = config;
      }

      await new Promise((r) => setTimeout(r, 350));
      toast.success("Logo Carousel published successfully!", {
        description: "Your logos are live and ready to embed on any website.",
      });

      if (!isExisting) {
        navigate({
          to: "/editor/$type",
          params: { type: "logo-carousel" },
          search: { id: widgetId },
          replace: true,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish Logo Carousel.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      {/* 1. Header with back, title, ready status, install, publish */}
      <WidgetEditorHeader
        backTo="/widgets"
        backTooltip="Back to widget catalog"
        icon={<Layers className="h-5 w-5" />}
        iconBgClass="bg-purple-600"
        title="Logo Carousel"
        subtitle="Display client logos, trusted brands, technology partners, sponsors, certifications, or payment methods in attractive, responsive layouts."
        statusText="Ready"
        isPublishing={isPublishing}
        onInstall={() => setInstallModalOpen(true)}
        onPublish={handlePublish}
      />

      {/* 2. Main Two-Column Workspace */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto scrollbar-thin">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Left Column: Config Tabs (Designs, Content, Preferences) */}
          <div className="lg:col-span-5 space-y-4">
            <LogoCarouselConfigTabs
              config={config}
              updateConfig={updateConfig}
              onSelectDesign={handleSelectDesign}
              onResetDefaults={handleResetDefaults}
            />
          </div>

          {/* Right Column: Live Preview */}
          <div className="lg:col-span-7">
            <LogoCarouselLivePreview
              config={config}
              viewport={viewport}
              onViewportChange={setViewport}
              resetKey={resetKey}
            />
          </div>
        </div>
      </main>

      {/* Install Widget Modal */}
      <LogoCarouselInstallModal
        open={installModalOpen}
        onOpenChange={setInstallModalOpen}
        widgetId={widgetId}
        config={config}
      />
    </div>
  );
};
