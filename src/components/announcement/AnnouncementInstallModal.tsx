import { useState } from "react";
import { Copy, Check, Code2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { AnnouncementBarConfig } from "@/lib/announcement/types";
import { cn } from "@/lib/utils";

interface AnnouncementInstallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widgetId: string;
  config: AnnouncementBarConfig;
}

const PLATFORMS: Record<string, { title: string; steps: string[] }> = {
  HTML: {
    title: "Static HTML Website",
    steps: [
      "Open your website's index.html or global layout file.",
      "Scroll to the top (or bottom) where you want the script loaded.",
      "Paste the script tag just inside the <head> or right before </body>.",
      "Save the file and refresh your browser.",
    ],
  },
  WordPress: {
    title: "WordPress (Gutenberg / Elementor / Header-Footer Plugins)",
    steps: [
      "In WordPress Admin, install or open 'WPCode' or 'Insert Headers and Footers'.",
      "Create a new header/footer snippet.",
      "Paste the embed snippet and set activation to 'Active'.",
      "Save and publish.",
    ],
  },
  Shopify: {
    title: "Shopify Store",
    steps: [
      "From your Shopify Admin, go to Online Store → Themes.",
      "Click 'Actions' and select 'Edit code'.",
      "Open 'theme.liquid'.",
      "Paste the code right before </head> or </body> and click Save.",
    ],
  },
  Wix: {
    title: "Wix Website",
    steps: [
      "In Wix Editor, click the '+' Add button → 'Embed Code' → 'Embed HTML'.",
      "Choose 'Code', paste the script snippet, and click Apply.",
      "Set display across all pages and publish.",
    ],
  },
  Webflow: {
    title: "Webflow Site",
    steps: [
      "Open Webflow Project Settings → Custom Code.",
      "Paste the script into the 'Head Code' or 'Footer Code' field.",
      "Click 'Save Changes' and publish your website.",
    ],
  },
  Custom: {
    title: "React, Next.js, or Single Page App",
    steps: [
      "Add the script dynamically using a useEffect hook or Next.js <Script> component.",
      "Pass the data-widget-id attribute with your unique widget ID.",
      "The widget isolates all styles via Shadow DOM and does not affect your CSS.",
    ],
  },
};

export function AnnouncementInstallModal({
  open,
  onOpenChange,
  widgetId,
  config,
}: AnnouncementInstallModalProps) {
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  const localHostOrigin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "http://localhost:8082";

  const [scriptHostMode, setScriptHostMode] = useState<"local" | "cdn">(
    isLocalhost ? "local" : "cdn"
  );
  const [activeTab, setActiveTab] = useState<"standard" | "inline">("standard");
  const [platform, setPlatform] = useState<string>("HTML");
  const [copied, setCopied] = useState(false);

  const scriptBaseUrl = scriptHostMode === "local" ? localHostOrigin : "https://cdn.webtoolocean.com";

  // Standard script embed
  const standardScript = `<script
  src="${scriptBaseUrl}/embed/announcement-bar.js"
  data-widget-id="${widgetId}"
  async
></script>`;

  // Standalone self-contained inline snippet (works immediately anywhere without a backend!)
  const standaloneScript = `<!-- WebToolOcean Announcement Bar Widget -->
<script>
  window.WTO_ANNOUNCEMENT_CONFIGS = window.WTO_ANNOUNCEMENT_CONFIGS || {};
  window.WTO_ANNOUNCEMENT_CONFIGS["${widgetId}"] = ${JSON.stringify(config, null, 2)};
</script>
<script
  src="${scriptBaseUrl}/embed/announcement-bar.js"
  data-widget-id="${widgetId}"
  async
></script>`;

  const activeCode = activeTab === "standard" ? standardScript : standaloneScript;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      toast.success("Embed code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy automatically. Please select and copy manually.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl sm:max-w-3xl max-h-[85vh] p-0 flex flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl">
        {/* Fixed Header with close button room */}
        <div className="p-6 pb-4 border-b shrink-0 pr-14 bg-card">
          <DialogHeader className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <Code2 className="h-4 w-4" />
              </span>
              <DialogTitle className="text-xl font-bold">Install Announcement Bar</DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground">
              Embed this announcement bar on any website using lightweight, framework-agnostic JavaScript.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Middle Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 min-h-0">
          {/* Environment & Embed Type Controls */}
          <div className="space-y-2 rounded-xl border bg-muted/30 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs">
                <span className="text-muted-foreground">Widget Identifier: </span>
                <code className="rounded bg-background px-2 py-0.5 font-mono font-semibold text-primary">
                  {widgetId}
                </code>
              </div>

              {/* Script source toggle (Local vs CDN) */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-muted-foreground font-medium">Script Source:</span>
                <div className="flex rounded-lg border bg-background p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setScriptHostMode("local")}
                    className={cn(
                      "rounded px-2.5 py-0.5 font-medium transition-colors",
                      scriptHostMode === "local"
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Local Host ({localHostOrigin.replace(/^https?:\/\//, "")})
                  </button>
                  <button
                    type="button"
                    onClick={() => setScriptHostMode("cdn")}
                    className={cn(
                      "rounded px-2.5 py-0.5 font-medium transition-colors",
                      scriptHostMode === "cdn"
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Production CDN
                  </button>
                </div>
              </div>
            </div>

            {/* Mode Selector Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50">
              <div className="flex rounded-lg border bg-background p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("inline")}
                  className={cn(
                    "rounded-md px-3 py-1 font-medium transition-colors",
                    activeTab === "inline"
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Standalone (Recommended for other websites)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("standard")}
                  className={cn(
                    "rounded-md px-3 py-1 font-medium transition-colors",
                    activeTab === "standard"
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Standard Loader
                </button>
              </div>

              <span className="text-[11px] text-muted-foreground">
                {activeTab === "inline"
                  ? "✓ Includes full config inline — works on any external site or sandbox"
                  : "Requires local dev server or live backend"}
              </span>
            </div>
          </div>

          {/* Code Preview Box with Copy Button */}
          <div className="relative rounded-xl border bg-slate-950 p-4 font-mono text-xs text-slate-100 dark:bg-black">
            <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>
                {activeTab === "standard" ? "script.html (hosted loader)" : "script.html (self-contained)"}
              </span>
              <Button
                size="sm"
                onClick={handleCopy}
                className="h-7 gap-1.5 bg-primary/90 text-xs text-white hover:bg-primary"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy Code"}
              </Button>
            </div>
            <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-all leading-relaxed font-mono selection:bg-primary/30">
              <code>{activeCode}</code>
            </pre>
          </div>

          {/* Platform Selection & Instructions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Installation Instructions
              </h4>
              <span className="text-xs text-muted-foreground">
                Target: <strong className="text-foreground">{PLATFORMS[platform]?.title}</strong>
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {Object.keys(PLATFORMS).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPlatform(key)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                    platform === key
                      ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/40"
                      : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {key}
                </button>
              ))}
            </div>

            <ol className="list-decimal space-y-1.5 pl-5 text-xs text-muted-foreground">
              {PLATFORMS[platform]?.steps.map((step, idx) => (
                <li key={idx} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Fixed Footer with Close Button */}
        <div className="p-3.5 px-6 border-t shrink-0 flex items-center justify-end bg-muted/20">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
