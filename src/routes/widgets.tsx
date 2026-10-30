import { createFileRoute } from "@tanstack/react-router";
import { WidgetCatalog } from "@/components/WidgetCatalog";

export const Route = createFileRoute("/widgets")({
  head: () => ({
    meta: [
      { title: "Explore Widgets — Website Widgets" },
      { name: "description", content: "Browse every Website Widgets marketplace widget by category." },
      { property: "og:title", content: "Explore Widgets — Website Widgets" },
      { property: "og:description", content: "Browse every Website Widgets marketplace widget by category." },
    ],
  }),
  component: () => <WidgetCatalog />,
});
