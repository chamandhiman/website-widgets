import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Monitor, Smartphone, Save, Code2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WidgetPreview } from "@/components/WidgetPreview";
import { InstallDialog } from "@/components/InstallDialog";
import { embedCode, getSchema, loadSaved, saveWidget, type Config, type Field } from "@/lib/widgets";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/editor/$type")({
  validateSearch: (s: Record<string, unknown>): { id?: string | undefined } => ({ id: typeof s["id"] === "string" ? (s["id"] as string) : undefined }),
  head: () => ({
    meta: [
      { title: "Customize Widget — WebToolOcean" },
      { name: "description", content: "Customize your widget with a live preview and get the install code." },
      { property: "og:title", content: "Customize Widget — WebToolOcean" },
      { property: "og:description", content: "Customize your widget with a live preview and get the install code." },
    ],
  }),
  component: Editor,
});

function Editor() {
  const { type } = Route.useParams();
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const schema = getSchema(type);
  const [config, setConfig] = useState<Config>(schema?.defaults ?? {});
  const [name, setName] = useState(schema?.def.name ?? "");
  const [mobile, setMobile] = useState(false);
  const [install, setInstall] = useState(false);
  const widgetId = useMemo(() => id ?? `wto_${Math.random().toString(36).slice(2, 9)}`, [id]);

  useEffect(() => {
    if (!id || !schema) return;
    const s = loadSaved().find((w) => w.id === id);
    if (s) { setConfig({ ...schema.defaults, ...s.config }); setName(s.name); }
  }, [id, type]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!schema) {
    return (
      <div className="p-10 text-center">
        <p className="mb-4 text-muted-foreground">This widget isn't available yet.</p>
        <Button asChild><Link to="/widgets">Back to widgets</Link></Button>
      </div>
    );
  }

  const set = (k: string, v: Config[string]) => setConfig((c) => ({ ...c, [k]: v }));
  const save = () => {
    saveWidget({ id: widgetId, type, name: name || schema.def.name, config, updatedAt: Date.now() });
    toast.success("Widget saved");
    if (!id) navigate({ to: "/editor/$type", params: { type }, search: { id: widgetId }, replace: true });
  };
  const groups = (["content", "layout", "theme"] as const);

  return (
    <div className="flex flex-col lg:h-screen lg:flex-row">
      <aside className="flex w-full flex-col border-b bg-card lg:w-96 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2 border-b p-4">
          <Button asChild variant="ghost" size="icon"><Link to="/widgets" aria-label="Back"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9 font-semibold" aria-label="Widget name" />
        </div>
        <Tabs defaultValue="content" className="flex min-h-0 flex-1 flex-col p-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
          </TabsList>
          {groups.map((g) => (
            <TabsContent key={g} value={g} className="mt-4 space-y-5 overflow-y-auto lg:flex-1">
              {schema.fields.filter((f) => f.group === g).map((f) => (
                <FieldControl key={f.key} f={f} value={config[f.key] ?? ""} onChange={(v) => set(f.key, v)} />
              ))}
            </TabsContent>
          ))}
        </Tabs>
        <div className="flex gap-2 border-t p-4">
          <Button variant="ghost" size="icon" onClick={() => setConfig(schema.defaults)} aria-label="Reset settings"><RotateCcw className="h-4 w-4" /></Button>
          <Button variant="outline" className="flex-1" onClick={save}><Save className="h-4 w-4" /> Save Widget</Button>
          <Button className="flex-1" onClick={() => setInstall(true)}><Code2 className="h-4 w-4" /> Install</Button>
        </div>
      </aside>
      <section className="flex min-h-[560px] flex-1 flex-col bg-muted/50">
        <div className="flex items-center justify-between border-b bg-card px-4 py-2">
          <span className="text-sm font-medium text-muted-foreground">Live preview · {schema.def.kind === "floating" ? "Floating widget" : "Page widget"}</span>
          <div className="flex rounded-lg border p-0.5">
            {[{ m: false, I: Monitor, l: "Desktop" }, { m: true, I: Smartphone, l: "Mobile" }].map(({ m, I, l }) => (
              <button key={l} onClick={() => setMobile(m)} aria-label={l}
                className={cn("rounded-md px-2.5 py-1", mobile === m ? "bg-accent text-accent-foreground" : "text-muted-foreground")}>
                <I className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-1 items-start justify-center overflow-auto p-4 md:p-8">
          <div className={cn("relative min-h-[480px] w-full overflow-hidden rounded-2xl border bg-card shadow-soft transition-all duration-300", mobile ? "max-w-[375px]" : "max-w-5xl")}>
            <div className="flex gap-1.5 border-b px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" /><span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" /><span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            </div>
            <div className="p-4 md:p-6">
              {schema.def.kind === "floating" && (
                <div className="space-y-3"><div className="h-6 w-1/2 rounded bg-muted" /><div className="h-3 w-full rounded bg-muted" /><div className="h-3 w-5/6 rounded bg-muted" /><div className="h-32 rounded-xl bg-muted" /></div>
              )}
              <WidgetPreview type={type} c={config} mobile={mobile} />
            </div>
          </div>
        </div>
      </section>
      <InstallDialog open={install} onOpenChange={setInstall} code={embedCode({ id: widgetId, type, config })} />
    </div>
  );
}

function FieldControl({ f, value, onChange }: { f: Field; value: Config[string]; onChange: (v: Config[string]) => void }) {
  const id = `f-${f.key}`;
  if (f.type === "toggle") {
    return <div className="flex items-center justify-between"><Label htmlFor={id}>{f.label}</Label><Switch id={id} checked={Boolean(value)} onCheckedChange={onChange} /></div>;
  }
  return (
    <div className="space-y-2">
      <div className="flex justify-between"><Label htmlFor={id}>{f.label}</Label>{f.type === "range" && <span className="text-xs text-muted-foreground">{String(value)}</span>}</div>
      {f.type === "text" && <Input id={id} value={String(value)} onChange={(e) => onChange(e.target.value)} />}
      {f.type === "textarea" && <Textarea id={id} rows={4} value={String(value)} onChange={(e) => onChange(e.target.value)} />}
      {f.type === "range" && <Slider id={id} min={f.min ?? 0} max={f.max ?? 100} step={f.step ?? 1} value={[Number(value)]} onValueChange={(v) => onChange(v[0] ?? 0)} />}
      {f.type === "color" && (
        <div className="flex items-center gap-2">
          <input id={id} type="color" value={String(value)} onChange={(e) => onChange(e.target.value)} className="h-9 w-12 cursor-pointer rounded border bg-transparent" />
          <Input value={String(value)} onChange={(e) => onChange(e.target.value)} className="font-mono text-xs" />
        </div>
      )}
      {f.type === "select" && (
        <Select value={String(value)} onValueChange={onChange}>
          <SelectTrigger id={id}><SelectValue /></SelectTrigger>
          <SelectContent>{f.options!.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
        </Select>
      )}
    </div>
  );
}
