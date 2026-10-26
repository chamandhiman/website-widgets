import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import { toast } from "sonner";
import { AnnouncementConfigTabs } from "./AnnouncementConfigTabs";
import { AnnouncementLivePreview } from "./AnnouncementLivePreview";
import { AnnouncementInstallModal } from "./AnnouncementInstallModal";
import { WidgetEditorHeader } from "@/components/editor/WidgetEditorHeader";
import type { AnnouncementBarConfig } from "@/lib/announcement/types";
import { validateAnnouncementConfig } from "@/lib/announcement/validation";
import type { TemplateDefinition } from "@/lib/announcement/templates";
import { saveWidget } from "@/lib/widgets";
import { WebsiteUrlField, normaliseWebsiteUrl } from "@/components/editor/WebsiteUrlField";
interface AnnouncementEditorProps {
  initialConfig: AnnouncementBarConfig;
  widgetId: string;
  widgetName: string;
  isExisting: boolean;
}

export function AnnouncementEditor({
  initialConfig,
  widgetId,
  widgetName: initialWidgetName,
  isExisting,
}: AnnouncementEditorProps) {
  const navigate = useNavigate();
  const [config, setConfig] = useState<AnnouncementBarConfig>(initialConfig);
  const [widgetName, setWidgetName] = useState(initialWidgetName || "Announcement Bar");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPublishing, setIsPublishing] = useState(false);
  const [website, setWebsite] = useState("");

  const updateConfig = <K extends keyof AnnouncementBarConfig>(
    key: K,
    value: AnnouncementBarConfig[K]
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

  const handleSelectTemplate = (template: TemplateDefinition) => {
    setConfig((prev) => {
      const hasCustomText =
        prev.text &&
        prev.text !== "2027 Winter and Spring Schedules are now open for enrollment!" &&
        prev.text.trim().length > 0;

      return {
        ...prev,
        ...template.defaults,
        text: hasCustomText ? prev.text : template.defaults.text || prev.text,
      };
    });
    toast.info(`Applied template: ${template.name}`);
  };

  const handlePublish = async () => {
    if (isPublishing) return;

    const valResult = validateAnnouncementConfig(config);
    if (!valResult.isValid) {
      setErrors(valResult.errors);
      const firstError = Object.values(valResult.errors)[0];
      toast.error("Please fix validation errors before publishing", {
        description: firstError,
      });
      return;
    }

    setIsPublishing(true);
    try {
      saveWidget({
        id: widgetId,
        type: "announcement-bar",
        name: widgetName || "Announcement Bar",
        config: config as any,
        updatedAt: Date.now(),
        website: normaliseWebsiteUrl(website),
      });

      if (typeof window !== "undefined") {
        (window as any).WTO_ANNOUNCEMENT_CONFIGS = (window as any).WTO_ANNOUNCEMENT_CONFIGS || {};
        (window as any).WTO_ANNOUNCEMENT_CONFIGS[widgetId] = config;
      }

      await new Promise((r) => setTimeout(r, 400));
      toast.success("Announcement bar published successfully!", {
        description: "Your bar is live and ready to install on your website.",
      });

      if (!isExisting) {
        navigate({
          to: "/editor/$type",
          params: { type: "announcement-bar" },
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
    const valResult = validateAnnouncementConfig(config);
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
    <div className="flex min-h-screen flex-col bg-background">
      {/* ================= TOP HEADER ================= */}
      <WidgetEditorHeader
        backTo="/widgets"
        backTooltip="Back to widgets"
        icon={<Megaphone className="h-5 w-5" />}
        iconBgClass="bg-purple-600"
        title="Announcement Bar"
        subtitle="Create and customize an announcement bar for your website."
        statusText="Ready"
        isPublishing={isPublishing}
        onInstall={handleInstallClick}
        onPublish={handlePublish}
      />
      {/* Website URL field placed under header */}
      <div className="px-6 py-3 border-b">
        <WebsiteUrlField value={website} onChange={setWebsite} />
      </div>

      {/* ================= MAIN TWO-COLUMN LAYOUT ================= */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* LEFT COLUMN: TWO TABS (Design & Preferences) */}
          <div className="lg:col-span-5 h-[calc(100vh-140px)] min-h-[580px] flex flex-col">
            <AnnouncementConfigTabs
              config={config}
              onChange={updateConfig}
              onSelectTemplate={handleSelectTemplate}
              errors={errors}
              onPublish={handlePublish}
              isPublishing={isPublishing}
              onCancel={() => navigate({ to: "/widgets" })}
            />
          </div>

          {/* RIGHT COLUMN: LIVE PREVIEW ONLY */}
          <div className="lg:col-span-7">
            <AnnouncementLivePreview
              config={config}
              viewport={viewport}
              onViewportChange={setViewport}
            />
          </div>
        </div>
      </main>

      {/* ================= INSTALL MODAL ================= */}
      <AnnouncementInstallModal
        open={installModalOpen}
        onOpenChange={setInstallModalOpen}
        widgetId={widgetId}
        config={config}
      />
    </div>
  );
}
