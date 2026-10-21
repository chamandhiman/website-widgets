import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
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
    <div className="mx-auto max-w-7xl p-5 md:p-8 space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-500/15 via-indigo-500/10 to-pink-500/15 px-3 py-1 text-xs font-bold text-purple-700 dark:text-purple-300 border border-purple-500/20 mb-2">
          <Sparkles className="h-3.5 w-3.5 text-purple-500" />
          <span>Full Widget Catalog</span>
        </div>
        <PageHeader
          title="All Widgets"
          description="Pick a widget to customize with live real-time preview and install on your website."
        />
      </div>
      <WidgetCatalog />
    </div>
  ),
});
