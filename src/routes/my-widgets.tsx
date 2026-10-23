import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, Pencil, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/StudioLayout";
import { WIDGETS, deleteWidget, loadSaved, saveWidget, type SavedWidget } from "@/lib/widgets";
import { maskPhoneNumber } from "@/lib/whatsapp/phone";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppLivePreview";

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

  const handleDuplicate = (w: SavedWidget) => {
    const newId = `wto_${Math.random().toString(36).slice(2, 9)}`;
    const cloned: SavedWidget = {
      ...w,
      id: newId,
      name: `${w.name} (Copy)`,
      updatedAt: Date.now(),
    };
    saveWidget(cloned);
    setList(loadSaved());
    toast.success("Widget duplicated");
  };

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      <PageHeader title="My Widgets" description="Widgets you've saved in this browser.">
        <Button
          asChild
          className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 text-white font-semibold shadow-xs hover:shadow-md hover:shadow-purple-500/25 transition-all"
        >
          <Link to="/widgets">New widget</Link>
        </Button>
      </PageHeader>
      {list.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-12 text-center text-sm text-muted-foreground shadow-2xs">
          You haven't saved any widgets yet.{" "}
          <Link to="/widgets" className="font-semibold text-purple-600 hover:underline">
            Create one
          </Link>.
        </div>
      ) : (
        <ul className="divide-y rounded-3xl border border-border/75 bg-card/90 shadow-soft backdrop-blur-xs">
          {list.map((w) => {
            const def = WIDGETS.find((d) => d.type === w.type);
            const Icon = def?.icon;
            const isWhatsApp = w.type === "whatsapp-chat";
            const isAnnouncement = w.type === "announcement-bar";
            const isGoogle = w.type === "google-reviews";

            const badgeBg = isWhatsApp
              ? "bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-xs"
              : isAnnouncement
              ? "bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-600 text-white shadow-xs"
              : isGoogle
              ? "bg-gradient-to-tr from-amber-400 to-orange-500 text-white shadow-xs"
              : "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs";

            const cfg = w.config || {};
            const phoneVal = cfg["phone"];
            const callingCodeVal = cfg["callingCode"];
            const maskedPhone = isWhatsApp && phoneVal
              ? maskPhoneNumber(String(phoneVal), String(callingCodeVal || "91"))
              : null;
            const textVal = cfg["text"] || cfg["message"];
            const announcementSnippet = isAnnouncement && textVal
              ? String(textVal).slice(0, 36) + (String(textVal).length > 36 ? "..." : "")
              : null;

            return (
              <li key={w.id} className="flex flex-wrap items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                <span className={cn("grid h-10 w-10 place-items-center rounded-xl shrink-0", badgeBg)}>
                  {isWhatsApp ? (
                    <WhatsAppIcon className="h-5 w-5 text-white" />
                  ) : (
                    Icon && <Icon className="h-5 w-5" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{w.name}</p>
                    {maskedPhone && (
                      <span className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                        {maskedPhone}
                      </span>
                    )}
                    {announcementSnippet && (
                      <span className="rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground truncate max-w-[220px]">
                        {announcementSnippet}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {def?.name} · updated {new Date(w.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button asChild size="sm" variant="outline">
                    <Link to="/editor/$type" params={{ type: w.type }} search={{ id: w.id }}>
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Duplicate widget"
                    title="Duplicate widget"
                    onClick={() => handleDuplicate(w)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Delete widget"
                    title="Delete widget"
                    onClick={() => {
                      deleteWidget(w.id);
                      setList(loadSaved());
                      toast("Widget deleted");
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive/80 hover:text-destructive" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
