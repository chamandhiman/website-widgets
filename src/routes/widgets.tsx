import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/StudioLayout";
import { WidgetCatalog } from "@/components/WidgetCatalog";

export const Route = createFileRoute("/widgets")({
  head: () => ({
    meta: [
      { title: "All Widgets — WebToolOcean" },
      { name: "description", content: "Browse every WebToolOcean website widget by category." },
      { property: "og:title", content: "All Widgets — WebToolOcean" },
      { property: "og:description", content: "Browse every WebToolOcean website widget by category." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      <PageHeader title="All Widgets" description="Pick a widget to customize and install on your website." />
      <WidgetCatalog />
    </div>
  ),
});
