import { useState, type FC } from "react";
import { useNavigate } from "@tanstack/react-router";
import { HelpCircle, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import { FaqConfigTabs, type FaqEditorTab } from "./FaqConfigTabs";
import { FaqLivePreview } from "./FaqLivePreview";
import { FaqInstallModal } from "./FaqInstallModal";
import { WidgetEditorHeader } from "@/components/editor/WidgetEditorHeader";
import type { FaqWidgetConfig } from "@/lib/faq/types";
import { DEFAULT_FAQ_CONFIG } from "@/lib/faq/types";
import { validateFaqConfig } from "@/lib/faq/validation";
import type { FaqTemplateDefinition } from "@/lib/faq/templates";
import { saveWidget } from "@/lib/widgets";
import { Button } from "@/components/ui/button";

interface FaqEditorProps {
  initialConfig: FaqWidgetConfig;
  widgetId: string;
  widgetName: string;
  isExisting: boolean;
}

export const FaqEditor: FC<FaqEditorProps> = ({
  initialConfig,
  widgetId,
  widgetName: initialWidgetName,
  isExisting,
}) => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<FaqWidgetConfig>(initialConfig || DEFAULT_FAQ_CONFIG);
  const [widgetName, setWidgetName] = useState(initialWidgetName || "FAQ Accordion");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPublishing, setIsPublishing] = useState(false);
  // Default to 'templates' for new widgets, or 'content' for existing saved widgets
  const [activeTab, setActiveTab] = useState<FaqEditorTab>(
    isExisting ? "content" : "templates"
  );

  const updateConfig = <K extends keyof FaqWidgetConfig>(
    key: K,
    value: FaqWidgetConfig[K]
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

  const handleSelectTemplate = (template: FaqTemplateDefinition) => {
    setConfig((prev) => {
      // Preserve existing questions and custom heading
      return {
        ...prev,
        ...template.defaults,
        items: prev.items,
        categories: prev.categories,
        heading: prev.heading || template.defaults.heading || prev.heading,
        subtitle: prev.subtitle !== undefined ? prev.subtitle : template.defaults.subtitle || "",
      };
    });
    toast.info(`Applied template: ${template.name}`);
  };

  const handlePublish = async () => {
    if (isPublishing) return;

    const valResult = validateFaqConfig(config);
    if (!valResult.isValid) {
      setErrors(valResult.errors);
      const firstError = Object.values(valResult.errors)[0];
      toast.error("Please resolve validation errors before publishing", {
        description: firstError,
      });
      return;
    }

    setIsPublishing(true);
    try {
      saveWidget({
        id: widgetId,
        type: "faq",
        name: widgetName || "FAQ Accordion",
        config: config as any,
        updatedAt: Date.now(),
      });

      // Maintain runtime cache on window for instant preview/embed simulation
      if (typeof window !== "undefined") {
        (window as any).WTO_FAQ_CONFIGS = (window as any).WTO_FAQ_CONFIGS || {};
        (window as any).WTO_FAQ_CONFIGS[widgetId] = config;
      }

      await new Promise((r) => setTimeout(r, 350));
      toast.success("FAQ widget published successfully!", {
        description: "Your changes are saved and ready to install on your website.",
      });

      if (!isExisting) {
        navigate({
          to: "/editor/$type",
          params: { type: "faq" },
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

  const handleInstallClick = () => {
    const valResult = validateFaqConfig(config);
    if (!valResult.isValid) {
      setErrors(valResult.errors);
      const firstError = Object.values(valResult.errors)[0];
      toast.error("Validation required before installing", {
        description: firstError,
      });
      return;
    }
    setInstallModalOpen(true);
  };

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      {/* 1. Shared Top Editor Header */}
      <WidgetEditorHeader
        backTo="/widgets"
        backTooltip="Back to widget catalog"
        icon={<HelpCircle className="h-5 w-5" />}
        iconBgClass="bg-teal-600"
        title={widgetName}
        subtitle="Create, organize, and style frequently asked questions for your website."
        statusText="Ready"
        isPublishing={isPublishing}
        onInstall={handleInstallClick}
        onPublish={handlePublish}
        extraActions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("templates")}
            className="h-8.5 rounded-xl gap-1.5 text-xs font-semibold border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-950/60"
          >
            <LayoutGrid className="h-3.5 w-3.5 text-purple-600" />
            <span className="hidden sm:inline">Templates</span> (10)
          </Button>
        }
      />

      {/* 2. Main Two-Column Workspace Layout */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto scrollbar-thin">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Left Panel: 4-Tab Template-First Configuration Workspace */}
          <div className="lg:col-span-5 h-[calc(100vh-140px)] min-h-[580px] flex flex-col">
            <FaqConfigTabs
              config={config}
              onChange={updateConfig}
              onSelectTemplate={handleSelectTemplate}
              errors={errors}
              onPublish={handlePublish}
              isPublishing={isPublishing}
              onCancel={() => navigate({ to: "/widgets" })}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Right Panel: Real-time Live Preview */}
          <div className="lg:col-span-7">
            <FaqLivePreview
              config={config}
              viewport={viewport}
              onViewportChange={setViewport}
            />
          </div>
        </div>
      </main>

      {/* Install Widget Modal Dialog */}
      <FaqInstallModal
        open={installModalOpen}
        onOpenChange={setInstallModalOpen}
        widgetId={widgetId}
        config={config}
      />
    </div>
  );
};
