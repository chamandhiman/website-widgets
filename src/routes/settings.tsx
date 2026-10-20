import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/StudioLayout";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — WebToolOcean" },
      { name: "description", content: "Manage your WebToolOcean Widget Studio settings." },
      { property: "og:title", content: "Settings — WebToolOcean" },
      { property: "og:description", content: "Manage your WebToolOcean Widget Studio settings." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl p-4 md:p-8">
      <PageHeader title="Settings" description="Studio preferences and local data." />
      <div className="rounded-2xl border bg-card p-5 shadow-soft">
        <h3 className="font-semibold">Saved widget data</h3>
        <p className="mb-4 mt-1 text-sm text-muted-foreground">Your widgets are stored in this browser. Clearing removes all saved widgets.</p>
        <Button variant="destructive" onClick={() => {
          if (confirm("Delete all saved widgets?")) { localStorage.removeItem("wto.savedWidgets"); toast("All saved widgets cleared"); }
        }}>Clear saved widgets</Button>
      </div>
    </div>
  ),
});
