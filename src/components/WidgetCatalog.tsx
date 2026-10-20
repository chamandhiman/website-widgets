import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CATEGORIES, WIDGETS, filterWidgets } from "@/lib/widgets";
import { cn } from "@/lib/utils";

export function WidgetCatalog() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const list = filterWidgets(WIDGETS, q, cat);
  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search widgets…" className="pl-9" />
        </div>
        <span className="text-sm text-muted-foreground">{list.length} widget{list.length === 1 ? "" : "s"}</span>
      </div>
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={cn("shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              cat === c ? "border-transparent bg-brand text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground")}>
            {c}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <p className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">No widgets match your search.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {list.map((w) => (
            <article key={w.type} className="group flex flex-col rounded-2xl border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
              <div className="mb-4 grid h-28 place-items-center rounded-xl bg-brand-soft">
                <w.icon className="h-10 w-10 text-primary transition-transform group-hover:scale-110" />
              </div>
              <div className="mb-1 flex items-center justify-between gap-2">
                <h3 className="font-semibold">{w.name}</h3>
                <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold",
                  w.ready ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")}>
                  {w.ready ? "Ready" : "Coming Soon"}
                </span>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">{w.description}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{w.category} · {w.kind === "floating" ? "Floating" : "Page"}</span>
                {w.ready ? (
                  <Button asChild size="sm"><Link to="/editor/$type" params={{ type: w.type }}>Create</Link></Button>
                ) : (
                  <Button size="sm" variant="outline" disabled>Soon</Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
