import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/StudioLayout";
import { WIDGETS, deleteWidget, loadSaved, type SavedWidget } from "@/lib/widgets";

export const Route = createFileRoute("/my-widgets")({
  head: () => ({
    meta: [
      { title: "My Widgets — WebToolOcean" },
      { name: "description", content: "Manage the widgets you've saved in WebToolOcean." },
      { property: "og:title", content: "My Widgets — WebToolOcean" },
      { property: "og:description", content: "Manage the widgets you've saved in WebToolOcean." },
    ],
  }),
  component: MyWidgets,
});

function MyWidgets() {
  const [list, setList] = useState<SavedWidget[]>([]);
  useEffect(() => setList(loadSaved()), []);
  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      <PageHeader title="My Widgets" description="Widgets you've saved in this browser.">
        <Button asChild><Link to="/widgets">New widget</Link></Button>
      </PageHeader>
      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
          You haven't saved any widgets yet. <Link to="/widgets" className="font-medium text-primary underline">Create one</Link>.
        </div>
      ) : (
        <ul className="divide-y rounded-2xl border bg-card shadow-soft">
          {list.map((w) => {
            const def = WIDGETS.find((d) => d.type === w.type);
            const Icon = def?.icon;
            return (
              <li key={w.id} className="flex items-center gap-4 p-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft">{Icon && <Icon className="h-5 w-5 text-primary" />}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{w.name}</p>
                  <p className="text-xs text-muted-foreground">{def?.name} · updated {new Date(w.updatedAt).toLocaleString()}</p>
                </div>
                <Button asChild size="sm" variant="outline"><Link to="/editor/$type" params={{ type: w.type }} search={{ id: w.id }}><Pencil className="h-4 w-4" /> Edit</Link></Button>
                <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => { deleteWidget(w.id); setList(loadSaved()); toast("Widget deleted"); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
