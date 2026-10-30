import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Quote } from "lucide-react";
import { toast } from "sonner";
import { TestimonialSliderConfigTabs } from "./TestimonialSliderConfigTabs";
import { TestimonialSliderLivePreview } from "./TestimonialSliderLivePreview";
import { TestimonialSliderInstallModal } from "./TestimonialSliderInstallModal";
import { WidgetEditorHeader } from "@/components/editor/WidgetEditorHeader";
import {
  type TestimonialSliderConfig,
  type TestimonialDesignDefinition,
} from "@/lib/testimonial/types";
import { saveWidget } from "@/lib/widgets";

interface TestimonialSliderEditorProps {
  initialConfig: TestimonialSliderConfig;
  widgetId: string;
  widgetName: string;
  isExisting: boolean;
  initialWebsite?: string;
}

export function TestimonialSliderEditor({
  initialConfig,
  widgetId,
  widgetName: initialWidgetName,
  isExisting,
  initialWebsite = "",
}: TestimonialSliderEditorProps) {
  const navigate = useNavigate();
  const [config, setConfig] = useState<TestimonialSliderConfig>(initialConfig);
  const [widgetName, setWidgetName] = useState(initialWidgetName || "Testimonial Slider");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const updateConfig = <K extends keyof TestimonialSliderConfig>(
    key: K,
    value: TestimonialSliderConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectDesign = (design: TestimonialDesignDefinition) => {
    setConfig((prev) => ({
      ...prev,
      designId: design.id,
      // Strictly preserve all existing testimonials and preferences
      testimonials: prev.testimonials,
      title: prev.title,
      description: prev.description,
      autoplay: prev.autoplay,
      autoplayInterval: prev.autoplayInterval,
      showArrows: prev.showArrows,
      showDots: prev.showDots,
      desktopColumns: prev.desktopColumns,
      showPhotos: prev.showPhotos,
      showRatings: prev.showRatings,
      showDesignation: prev.showDesignation,
      showCompany: prev.showCompany,
    }));
    toast.info(`Applied design: ${design.name}`);
  };

  const handlePublish = async () => {
    if (isPublishing) return;

    setIsPublishing(true);
    try {
      saveWidget({
        id: widgetId,
        type: "testimonial-slider",
        name: widgetName || "Testimonial Slider",
        config: config as any,
        updatedAt: Date.now(),
        website: initialWebsite || "",
      });

      if (typeof window !== "undefined") {
        (window as any).WTO_TESTIMONIAL_CONFIGS =
          (window as any).WTO_TESTIMONIAL_CONFIGS || {};
        (window as any).WTO_TESTIMONIAL_CONFIGS[widgetId] = config;
        (window as any).WTO_DEMO_CONFIG = (window as any).WTO_DEMO_CONFIG || {};
        (window as any).WTO_DEMO_CONFIG[widgetId] = config;
      }

      await new Promise((r) => setTimeout(r, 350));
      toast.success("Testimonial Slider published successfully!", {
        description: "Your testimonials are live and ready to embed on your website.",
      });

      if (!isExisting) {
        navigate({
          to: "/editor/$type",
          params: { type: "testimonial-slider" },
          search: { id: widgetId },
          replace: true,
        });
      }
    } catch (err) {
      toast.error("Failed to publish Testimonial Slider", {
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
        icon={<Quote className="h-5 w-5" />}
        iconBgClass="bg-purple-600"
        title={widgetName}
        subtitle="Showcase customer reviews and build trust with beautiful testimonials."
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
            <TestimonialSliderConfigTabs
              config={config}
              onChange={updateConfig}
              onSelectDesign={handleSelectDesign}
            />
          </div>

          {/* RIGHT COLUMN: Live Preview */}
          <div className="lg:col-span-7">
            <TestimonialSliderLivePreview
              config={config}
              viewport={viewport}
              onViewportChange={setViewport}
            />
          </div>
        </div>
      </main>

      {/* ================= INSTALL MODAL ================= */}
      <TestimonialSliderInstallModal
        open={installModalOpen}
        onOpenChange={setInstallModalOpen}
        widgetId={widgetId}
        config={config}
      />
    </div>
  );
}
