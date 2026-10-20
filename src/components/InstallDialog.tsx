import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PLATFORMS: Record<string, string[]> = {
  HTML: ["Copy the code below.", "Paste it into your page's HTML where the widget should appear (floating widgets: just before </body>).", "Save and publish your page."],
  WordPress: ["In your dashboard, edit the page or post.", "Add a “Custom HTML” block.", "Paste the code and update the page."],
  Shopify: ["Go to Online Store → Themes → Customize.", "Add a “Custom Liquid” section where you want the widget.", "Paste the code and save."],
  Wix: ["Open the Wix Editor and click Add → Embed Code → Embed HTML.", "Choose “Code” and paste the snippet.", "Position the element and publish."],
  Webflow: ["Drag an “Embed” element onto your page.", "Paste the code into the embed editor.", "Save and publish your site."],
  Custom: ["Open your site's template or layout file.", "Paste the code where the widget should render.", "Deploy your site."],
};

export function InstallDialog({ open, onOpenChange, code }: { open: boolean; onOpenChange: (o: boolean) => void; code: string }) {
  const [p, setP] = useState("HTML");
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true); toast.success("Embed code copied");
      setTimeout(() => setCopied(false), 1800);
    } catch { toast.error("Couldn't copy — select the code and copy manually"); }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Install widget</DialogTitle>
          <DialogDescription>Demo embed snippet — it is not yet connected to a live widget service.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-2">
          {Object.keys(PLATFORMS).map((k) => (
            <button key={k} onClick={() => setP(k)} className={cn("rounded-full border px-3 py-1 text-xs font-medium",
              p === k ? "border-transparent bg-brand text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
              {k === "Custom" ? "Custom website" : k}
            </button>
          ))}
        </div>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
          {(PLATFORMS[p] ?? []).map((s) => <li key={s}>{s}</li>)}
        </ol>
        <div className="relative">
          <pre className="max-h-64 overflow-auto rounded-xl bg-muted p-4 text-xs"><code>{code}</code></pre>
          <Button size="sm" className="absolute right-2 top-2" onClick={copy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy code"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
