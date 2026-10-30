import { useState, type FC } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PanelTop } from "lucide-react";
import { toast } from "sonner";
import { PopupConfigTabs } from "./PopupConfigTabs";
import { PopupLivePreview } from "./PopupLivePreview";
import { PopupInstallModal } from "./PopupInstallModal";
import { WidgetEditorHeader } from "@/components/editor/WidgetEditorHeader";
import type { PopupWidgetConfig } from "@/lib/popup/types";
import { DEFAULT_POPUP_CONFIG } from "@/lib/popup/types";
import { validatePopupConfig } from "@/lib/popup/validation";
import type { PopupTemplateDefinition } from "@/lib/popup/templates";
import { saveWidget } from "@/lib/widgets";

interface PopupEditorProps {
  initialConfig: PopupWidgetConfig;
  widgetId: string;
  widgetName: string;
  isExisting: boolean;
}

export const PopupEditor: FC<PopupEditorProps> = ({
  initialConfig,
  widgetId,
  widgetName: initialWidgetName,
  isExisting,
}) => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<PopupWidgetConfig>(initialConfig || DEFAULT_POPUP_CONFIG);
  const [widgetName, setWidgetName] = useState(initialWidgetName || "Popup Widget");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPublishing, setIsPublishing] = useState(false);
  const [resetTriggerKey, setResetTriggerKey] = useState(0);

  const updateConfig = <K extends keyof PopupWidgetConfig>(
    key: K,
    value: PopupWidgetConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    if (errors[key as string]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as string];
        return next;
      });
    }
  };

  const handleSelectTemplate = (template: PopupTemplateDefinition) => {
    setConfig((prev) => {
      // Check if user has already customized content so we don't accidentally wipe it
      const hasCustomTitle =
        prev.title &&
        prev.title !== "Special Offer! 🎉" &&
        prev.title.trim().length > 0;

      return {
        ...prev,
        ...template.defaults,
        title: hasCustomTitle ? prev.title : template.defaults.title || prev.title,
        templateId: template.id,
      };
    });
    setResetTriggerKey((k) => k + 1);
    toast.info(`Switched to: ${template.name}`);
  };

  const handleResetDefaults = () => {
    setConfig({
      ...DEFAULT_POPUP_CONFIG,
      templateId: config.templateId,
    });
    setErrors({});
    setResetTriggerKey((k) => k + 1);
  };

  const handleTestTrigger = () => {
    setResetTriggerKey((k) => k + 1);
    toast.success("Trigger activated in live preview!");
  };

  const handlePublish = async () => {
    if (isPublishing) return;

    const validation = validatePopupConfig(config);
    if (!validation.isValid) {
      setErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      toast.error("Please resolve validation errors before publishing", {
        description: firstError,
      });
      return;
    }

    setIsPublishing(true);
    try {
      // Save widget configuration to local persistence
      saveWidget({
        id: widgetId,
        type: "popup",
        name: widgetName || "Popup Widget",
        config: config as any,
        updatedAt: Date.now(),
      });

      // Also register into window global for local embed previews
      if (typeof window !== "undefined") {
        (window as any).WTO_POPUP_CONFIGS = (window as any).WTO_POPUP_CONFIGS || {};
        (window as any).WTO_POPUP_CONFIGS[widgetId] = config;
      }

      await new Promise((r) => setTimeout(r, 400));
      toast.success("Popup Widget Published!", {
        description: "Your popup settings have been saved and are ready to install.",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save widget configuration.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      {/* 1. SHARED EDITOR HEADER (Matching Mockup exactly) */}
      <WidgetEditorHeader
        backTo="/widgets"
        backTooltip="Back to widget catalog"
        icon={<PanelTop className="h-5 w-5" />}
        iconBgClass="bg-purple-600"
        title="Popup Widget"
        subtitle="Create eye-catching popups to engage your visitors and increase conversions."
        statusText="Ready"
        isPublishing={isPublishing}
        onInstall={() => setInstallModalOpen(true)}
        onPublish={handlePublish}
      />

      {/* 2. MAIN TWO-COLUMN WORKSPACE AREA */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto scrollbar-thin">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* LEFT COLUMN: CONFIGURATION PANEL (Setup, Style, Position, Trigger) */}
          <div className="lg:col-span-5 space-y-4">
            <PopupConfigTabs
              config={config}
              widgetId={widgetId}
              updateConfig={updateConfig}
              onSelectTemplate={handleSelectTemplate}
              onResetDefaults={handleResetDefaults}
              onTestTrigger={handleTestTrigger}
              errors={errors}
            />
          </div>

          {/* RIGHT COLUMN: LIVE PREVIEW ONLY */}
          <div className="lg:col-span-7">
            <PopupLivePreview
              config={config}
              updateConfig={updateConfig}
              viewport={viewport}
              onViewportChange={setViewport}
              resetTriggerKey={resetTriggerKey}
            />
          </div>
        </div>
      </main>

      {/* Install Widget Dialog */}
      <PopupInstallModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        widgetId={widgetId}
        config={config}
      />
    </div>
  );
};
