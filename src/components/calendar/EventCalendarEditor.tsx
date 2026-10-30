import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { EventCalendarConfigTabs } from "./EventCalendarConfigTabs";
import { EventCalendarLivePreview } from "./EventCalendarLivePreview";
import { EventCalendarInstallModal } from "./EventCalendarInstallModal";
import { WidgetEditorHeader } from "@/components/editor/WidgetEditorHeader";
import {
  type EventCalendarConfig,
  type CalendarDesignDefinition,
} from "@/lib/calendar/types";
import { saveWidget } from "@/lib/widgets";

interface EventCalendarEditorProps {
  initialConfig: EventCalendarConfig;
  widgetId: string;
  widgetName: string;
  isExisting: boolean;
  initialWebsite?: string;
}

export function EventCalendarEditor({
  initialConfig,
  widgetId,
  widgetName: initialWidgetName,
  isExisting,
  initialWebsite = "",
}: EventCalendarEditorProps) {
  const navigate = useNavigate();
  const [config, setConfig] = useState<EventCalendarConfig>(initialConfig);
  const [widgetName, setWidgetName] = useState(initialWidgetName || "Event Calendar");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const updateConfig = <K extends keyof EventCalendarConfig>(
    key: K,
    value: EventCalendarConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectDesign = (design: CalendarDesignDefinition) => {
    setConfig((prev) => ({
      ...prev,
      designId: design.id,
      // Strictly preserve all existing events, title, and preferences
      events: prev.events,
      title: prev.title,
      description: prev.description,
      upcomingOnly: prev.upcomingOnly,
      maxEvents: prev.maxEvents,
      showDescriptions: prev.showDescriptions,
      showLocations: prev.showLocations,
      showImages: prev.showImages,
      dateFormat: prev.dateFormat,
      timeFormat: prev.timeFormat,
      emptyStateMessage: prev.emptyStateMessage,
    }));
    toast.info(`Applied design: ${design.name}`);
  };

  const handlePublish = async () => {
    if (isPublishing) return;

    setIsPublishing(true);
    try {
      saveWidget({
        id: widgetId,
        type: "event-calendar",
        name: widgetName || "Event Calendar",
        config: config as any,
        updatedAt: Date.now(),
        website: initialWebsite || "",
      });

      if (typeof window !== "undefined") {
        (window as any).WTO_EVENT_CALENDAR_CONFIGS =
          (window as any).WTO_EVENT_CALENDAR_CONFIGS || {};
        (window as any).WTO_EVENT_CALENDAR_CONFIGS[widgetId] = config;
        (window as any).WTO_DEMO_CONFIG = (window as any).WTO_DEMO_CONFIG || {};
        (window as any).WTO_DEMO_CONFIG[widgetId] = config;
      }

      await new Promise((r) => setTimeout(r, 350));
      toast.success("Event Calendar published successfully!", {
        description: "Your calendar is live and ready to install on your website.",
      });

      if (!isExisting) {
        navigate({
          to: "/editor/$type",
          params: { type: "event-calendar" },
          search: { id: widgetId },
          replace: true,
        });
      }
    } catch (err) {
      toast.error("Failed to publish Event Calendar", {
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
        icon={<CalendarDays className="h-5 w-5" />}
        iconBgClass="bg-purple-600"
        title={widgetName}
        subtitle="List upcoming events in a clean calendar."
        statusText="Ready"
        isPublishing={isPublishing}
        onInstall={handleInstallClick}
        onPublish={handlePublish}
      />

      {/* ================= MAIN TWO-COLUMN WORKSPACE ================= */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* LEFT COLUMN: Configuration tabs (Designs, Content, Preferences) */}
          <div className="lg:col-span-5 h-[calc(100vh-100px)] min-h-[580px] flex flex-col">
            <EventCalendarConfigTabs
              config={config}
              onChange={updateConfig}
              onSelectDesign={handleSelectDesign}
            />
          </div>

          {/* RIGHT COLUMN: Live Preview */}
          <div className="lg:col-span-7">
            <EventCalendarLivePreview
              config={config}
              viewport={viewport}
              onViewportChange={setViewport}
            />
          </div>
        </div>
      </main>

      {/* ================= INSTALL MODAL ================= */}
      <EventCalendarInstallModal
        open={installModalOpen}
        onOpenChange={setInstallModalOpen}
        widgetId={widgetId}
        config={config}
      />
    </div>
  );
}
