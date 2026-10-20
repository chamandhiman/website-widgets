import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Boxes, CheckCircle2, Clock } from "lucide-react";
import { PageHeader } from "@/components/StudioLayout";
import { WidgetCatalog } from "@/components/WidgetCatalog";
import { WIDGETS, loadSaved } from "@/lib/widgets";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Website Widgets Studio — WebToolOcean" },
      { name: "description", content: "Discover, customize and manage all your website widgets in one place." },
      { property: "og:title", content: "Website Widgets Studio — WebToolOcean" },
      { property: "og:description", content: "Discover, customize and manage all your website widgets in one place." },
    ],
  }),
  component: Index,
});

function Index() {
  const [saved, setSaved] = useState(0);
  useEffect(() => setSaved(loadSaved().length), []);
  const stats = [
    { label: "Ready widgets", value: WIDGETS.filter((w) => w.ready).length, icon: CheckCircle2 },
    { label: "Coming soon", value: WIDGETS.filter((w) => !w.ready).length, icon: Clock },
    { label: "My saved widgets", value: saved, icon: Boxes },
  ];
  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      <PageHeader title="Website Widgets" description="Discover, customize and manage all your website widgets in one place." />
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-soft">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft"><s.icon className="h-5 w-5 text-primary" /></span>
            <div><div className="text-2xl font-bold">{s.value}</div><div className="text-xs text-muted-foreground">{s.label}</div></div>
          </div>
        ))}
      </div>
      <WidgetCatalog />
    </div>
  );
}
