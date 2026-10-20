import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/StudioLayout";

const ITEMS = ["WordPress", "Shopify", "Wix", "Webflow", "Squarespace", "Custom HTML"];

export const Route = createFileRoute("/integrations")({
  head: () => ({
    meta: [
      { title: "Integrations — WebToolOcean" },
      { name: "description", content: "Platforms supported by WebToolOcean widget embed codes." },
      { property: "og:title", content: "Integrations — WebToolOcean" },
      { property: "og:description", content: "Platforms supported by WebToolOcean widget embed codes." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      <PageHeader title="Integrations" description="Install widgets on any platform by pasting the embed code." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((i) => (
          <div key={i} className="rounded-2xl border bg-card p-5 shadow-soft">
            <h3 className="font-semibold">{i}</h3>
            <p className="mt-1 text-sm text-muted-foreground">Supported via copy-and-paste embed code. Step-by-step guides are in each widget's Install window.</p>
          </div>
        ))}
      </div>
    </div>
  ),
});
