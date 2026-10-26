import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Trash2, Pencil, Copy, Search, X, Globe } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

/** Strip protocol and leading www from a URL/domain string for display. */
function formatDomain(raw: string | undefined): string | null {
  if (!raw || !raw.trim()) return null;
  try {
    const url = raw.includes("://") ? raw : `https://${raw}`;
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return raw.trim();
  }
}

function MyWidgets() {
  const [list, setList] = useState<SavedWidget[]>([]);
  const [query, setQuery] = useState("");
  const [widgetToDelete, setWidgetToDelete] = useState<SavedWidget | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

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

  const handleDelete = (id: string) => {
    deleteWidget(id);
    setList(loadSaved());
    toast("Widget deleted");
  };

  const clearSearch = () => {
    setQuery("");
    searchRef.current?.focus();
  };

  /** Filter by name, widget type name, category, phone number, or website domain. */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((w) => {
      const def = WIDGETS.find((d) => d.type === w.type);
      const phone = w.config?.["phone"] ? String(w.config["phone"]) : "";
      const domain = (w.website || "").toLowerCase();
      const typeName = (def?.name || "").toLowerCase();
      const category = (def?.category || "").toLowerCase();
      return (
        w.name.toLowerCase().includes(q) ||
        typeName.includes(q) ||
        category.includes(q) ||
        phone.includes(q) ||
        domain.includes(q)
      );
    });
  }, [list, query]);

  const total = list.length;
  const hasQuery = query.trim().length > 0;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* ─── Top Header: Title on Left, Search + New Widget on Right ─── */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground md:text-3xl lg:text-4xl">
            <span className="flex items-center gap-3">
              My Widgets
              {total > 0 && (
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800">
                  {total}
                </span>
              )}
            </span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            Widgets you've saved in this browser.
          </p>
        </div>

        {/* Top-Right Controls: Search Bar + New Widget Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {total > 0 && (
            <div className="relative w-full sm:w-64 md:w-72 lg:w-80">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
              <input
                ref={searchRef}
                id="widget-search"
                type="search"
                autoComplete="off"
                spellCheck={false}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search widgets…"
                className={cn(
                  "w-full rounded-xl border border-border/70 bg-card/80 py-2 pl-9 pr-9 text-sm",
                  "placeholder:text-muted-foreground/60 shadow-2xs transition-all",
                  "focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400",
                  "dark:bg-card dark:border-border/60"
                )}
              />
              {hasQuery && (
                <button
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

          <Button
            asChild
            className="shrink-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 text-white font-semibold shadow-xs hover:shadow-md hover:shadow-purple-500/25 transition-all"
          >
            <Link to="/widgets">New widget</Link>
          </Button>
        </div>
      </div>

      {/* ─── Empty: no saved widgets at all ─── */}
      {total === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-12 text-center text-sm text-muted-foreground shadow-2xs">
          You haven't saved any widgets yet.{" "}
          <Link to="/widgets" className="font-semibold text-purple-600 hover:underline">
            Create one
          </Link>
          .
        </div>
      ) : filtered.length === 0 ? (
        /* ─── Empty: search matched nothing ─── */
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-12 text-center shadow-2xs">
          <Search className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">No widgets found</p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            No widgets match &ldquo;
            <span className="font-medium text-foreground/80">{query}</span>
            &rdquo;.{" "}
            <button
              onClick={clearSearch}
              className="font-semibold text-purple-600 hover:underline"
            >
              Clear search
            </button>
          </p>
        </div>
      ) : (
        /* ─── Widget list ─── */
        <ul className="divide-y rounded-3xl border border-border/75 bg-card/90 shadow-soft backdrop-blur-xs">
          {filtered.map((w) => {
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
            const maskedPhone =
              isWhatsApp && phoneVal
                ? maskPhoneNumber(String(phoneVal), String(callingCodeVal || "91"))
                : null;
            const textVal = cfg["text"] || cfg["message"];
            const announcementSnippet =
              isAnnouncement && textVal
                ? String(textVal).slice(0, 36) + (String(textVal).length > 36 ? "…" : "")
                : null;

            const domain = formatDomain(w.website);

            return (
              <li
                key={w.id}
                className="flex flex-wrap items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
              >
                {/* Widget type icon */}
                <span className={cn("grid h-10 w-10 place-items-center rounded-xl shrink-0", badgeBg)}>
                  {isWhatsApp ? (
                    <WhatsAppIcon className="h-5 w-5 text-white" />
                  ) : (
                    Icon && <Icon className="h-5 w-5" />
                  )}
                </span>

                {/* Name + sub-info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
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
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                    <p className="text-xs text-muted-foreground">
                      {def?.name} · updated {new Date(w.updatedAt).toLocaleString()}
                    </p>
                    {/* Website / organization domain */}
                    {domain ? (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground/80">
                        <Globe className="h-3 w-3 shrink-0 text-muted-foreground/50" />
                        <span className="truncate max-w-[180px]">{domain}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/40 select-none">—</span>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
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
                    onClick={() => setWidgetToDelete(w)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive/80 hover:text-destructive" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* ─── Delete Confirmation Box Dialog ─── */}
      <AlertDialog
        open={!!widgetToDelete}
        onOpenChange={(open) => {
          if (!open) setWidgetToDelete(null);
        }}
      >
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Widget</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{widgetToDelete?.name}&rdquo;
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel onClick={() => setWidgetToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(buttonVariants({ variant: "destructive" }))}
              onClick={() => {
                if (widgetToDelete) {
                  handleDelete(widgetToDelete.id);
                  setWidgetToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
