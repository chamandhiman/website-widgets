import { createFileRoute } from "@tanstack/react-router";
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
    <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
      <WidgetCatalog />
    </div>
  ),
});
