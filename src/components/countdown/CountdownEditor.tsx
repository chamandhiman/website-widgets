import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Timer } from "lucide-react";
import { toast } from "sonner";
import { CountdownConfigTabs } from "./CountdownConfigTabs";
import { CountdownLivePreview } from "./CountdownLivePreview";
import { CountdownInstallModal } from "./CountdownInstallModal";
import { WidgetEditorHeader } from "@/components/editor/WidgetEditorHeader";
import {
  type CountdownConfig,
  type CountdownDesignDefinition,
} from "@/lib/countdown/types";
import { saveWidget } from "@/lib/widgets";

interface CountdownEditorProps {
  initialConfig: CountdownConfig;
  widgetId: string;
  widgetName: string;
  isExisting: boolean;
  initialWebsite?: string;
}

export function CountdownEditor({
  initialConfig,
  widgetId,
  widgetName: initialWidgetName,
  isExisting,
  initialWebsite = "",
}: CountdownEditorProps) {
  const navigate = useNavigate();
  const [config, setConfig] = useState<CountdownConfig>(initialConfig);
  const [widgetName, setWidgetName] = useState(initialWidgetName || "Countdown Timer");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const updateConfig = <K extends keyof CountdownConfig>(
    key: K,
    value: CountdownConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectDesign = (design: CountdownDesignDefinition) => {
    setConfig((prev) => ({
      ...prev,
      ...design.defaults,
      designId: design.id,
      // Strictly preserve content and user time settings
      title: prev.title,
      target: prev.target,
      timezone: prev.timezone,
      expiryMessage: prev.expiryMessage,
      expireAction: prev.expireAction,
      showDays: prev.showDays,
      showHours: prev.showHours,
      showMinutes: prev.showMinutes,
      showSeconds: prev.showSeconds,
    }));
    toast.info(`Applied design: ${design.name}`);
  };

  const handlePublish = async () => {
    if (isPublishing) return;

    if (!config.target) {
      toast.error("Please set a valid target date and time.");
      return;
    }

    setIsPublishing(true);
    try {
      saveWidget({
        id: widgetId,
        type: "countdown",
        name: widgetName || "Countdown Timer",
        config: config as any,
        updatedAt: Date.now(),
        website: initialWebsite || "",
      });

      if (typeof window !== "undefined") {
        (window as any).WTO_COUNTDOWN_CONFIGS = (window as any).WTO_COUNTDOWN_CONFIGS || {};
        (window as any).WTO_COUNTDOWN_CONFIGS[widgetId] = config;
        (window as any).WTO_DEMO_CONFIG = (window as any).WTO_DEMO_CONFIG || {};
        (window as any).WTO_DEMO_CONFIG[widgetId] = config;
      }

      await new Promise((r) => setTimeout(r, 350));
      toast.success("Countdown Timer published successfully!", {
        description: "Your timer is live and ready to install on your website.",
      });

      if (!isExisting) {
        navigate({
          to: "/editor/$type",
          params: { type: "countdown" },
          search: { id: widgetId },
          replace: true,
        });
      }
    } catch (err) {
      toast.error("Failed to publish countdown timer", {
        description: err instanceof Error ? err.message : "An unexpected error occurred.",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleInstallClick = () => {
    setInstallModalOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ================= TOP HEADER ================= */}
      <WidgetEditorHeader
        backTo="/widgets"
        backTooltip="Back to widgets"
        icon={<Timer className="h-5 w-5" />}
        iconBgClass="bg-purple-600"
        title={widgetName}
        subtitle="Create urgency with a live countdown."
        statusText="Ready"
        isPublishing={isPublishing}
        onInstall={handleInstallClick}
        onPublish={handlePublish}
      />

      {/* ================= MAIN TWO-COLUMN WORKSPACE (Directly under header) ================= */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* LEFT COLUMN: Configuration tabs (Designs, Content, Preferences) */}
          <div className="lg:col-span-5 h-[calc(100vh-100px)] min-h-[580px] flex flex-col">
            <CountdownConfigTabs
              config={config}
              onChange={updateConfig}
              onSelectDesign={handleSelectDesign}
            />
          </div>

          {/* RIGHT COLUMN: Live Preview */}
          <div className="lg:col-span-7">
            <CountdownLivePreview
              config={config}
              viewport={viewport}
              onViewportChange={setViewport}
            />
          </div>
        </div>
      </main>

      {/* ================= INSTALL MODAL ================= */}
      <CountdownInstallModal
        open={installModalOpen}
        onOpenChange={setInstallModalOpen}
        widgetId={widgetId}
        config={config}
      />
    </div>
  );
}
