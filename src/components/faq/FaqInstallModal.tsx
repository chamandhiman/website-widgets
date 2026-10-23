import { useState } from "react";
import { Copy, Check, Code2, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { FaqWidgetConfig } from "@/lib/faq/types";
import { cn } from "@/lib/utils";
import { getStandardEmbedSnippet } from "@/lib/embed";

interface FaqInstallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widgetId: string;
  config: FaqWidgetConfig;
}

const PLATFORMS: Record<string, { title: string; steps: string[] }> = {
  HTML: {
    title: "Static HTML Website",
    steps: [
      "Open your website's index.html or target page file.",
      "Locate the container where you want the FAQ widget displayed (e.g. <div id=\"faq-container\"></div>).",
      "Paste the script tag directly into the page body where the FAQ should appear.",
      "Save the file and refresh your browser.",
    ],
  },
  WordPress: {
    title: "WordPress (Gutenberg / Elementor / Theme Code)",
    steps: [
      "In your WordPress page editor, add a 'Custom HTML' block where you want the FAQ.",
      "Paste the script snippet into the HTML block.",
      "Alternatively, use a header/footer code snippet plugin (e.g. WPCode).",
      "Click Update or Publish to make it live.",
    ],
  },
  Shopify: {
    title: "Shopify Store",
    steps: [
      "From Shopify Admin, go to Online Store → Pages (or Themes).",
      "Edit the target page in HTML mode (<> icon).",
      "Paste the script snippet where you want the FAQ to render.",
      "Save the page changes and preview your storefront.",
    ],
  },
  Wix: {
    title: "Wix Website",
    steps: [
      "In Wix Studio or Editor, click Add Elements (+) → Embed Code → Embed HTML.",
      "Paste the embed snippet into the code box.",
      "Resize and position the widget container on your canvas.",
      "Publish your Wix site.",
    ],
  },
  Webflow: {
    title: "Webflow Project",
    steps: [
      "Open your Webflow Designer and navigate to the FAQ section.",
      "Add an 'Embed' component from the Add panel.",
      "Paste the script snippet into the custom code modal.",
      "Save and publish your Webflow site to production.",
    ],
  },
};

export function FaqInstallModal({
  open,
  onOpenChange,
  widgetId,
  config,
}: FaqInstallModalProps) {
  const [copied, setCopied] = useState(false);
  const [activePlatform, setActivePlatform] = useState<string>("HTML");

  // Standard script embed (uses https://cdn.widgets.webtoolocean.com/embed/faq.js)
  const embedSnippet = getStandardEmbedSnippet({
    widgetType: "faq",
    widgetId,
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedSnippet);
      setCopied(true);
      toast.success("Embed code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy embed code.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl sm:rounded-2xl border-border bg-card p-6 shadow-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-purple-500/10 text-purple-600">
              <Code2 className="h-4 w-4" />
            </span>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Install FAQ Widget
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Embed your interactive FAQ accordion on any website using this single script.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Widget ID & Status */}
          <div className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Widget ID:</span>
              <code className="font-mono font-bold text-foreground bg-background px-1.5 py-0.5 rounded border border-border/60">
                {widgetId}
              </code>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Ready for installation
            </span>
          </div>

          {/* Embed Code Snippet Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">JavaScript Embed Snippet</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="h-7 text-xs gap-1 border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-950"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied!" : "Copy Code"}</span>
              </Button>
            </div>

            <pre className="overflow-x-auto rounded-xl border border-border/80 bg-slate-900 p-3.5 font-mono text-xs text-purple-200 shadow-inner">
              <code>{embedSnippet}</code>
            </pre>
          </div>

          {/* Platform Step-by-Step Guides */}
          <div className="space-y-2 rounded-xl border border-border/70 p-3.5 bg-background">
            <span className="text-xs font-bold text-foreground">Installation Guides</span>

            {/* Platform Tabs */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {Object.keys(PLATFORMS).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActivePlatform(key)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors",
                    activePlatform === key
                      ? "bg-purple-600 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  {key}
                </button>
              ))}
            </div>

            {/* Platform Instructions */}
            <div className="pt-2 text-xs">
              <h4 className="font-semibold text-foreground mb-1.5">
                {PLATFORMS[activePlatform]?.title}
              </h4>
              <ol className="list-decimal pl-5 space-y-1 text-muted-foreground leading-relaxed">
                {PLATFORMS[activePlatform]?.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Local vs Production Notice */}
          <div className="flex items-start gap-2.5 rounded-xl border border-purple-500/20 bg-purple-500/5 p-3 text-xs text-muted-foreground">
            <AlertCircle className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              <strong className="text-foreground">Development Note:</strong> Widget configurations are saved locally in your browser storage. For public external embedding across third-party websites, widgets are loaded from the WebToolOcean runtime with isolated Shadow DOM.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-border/60">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-xs bg-purple-600 hover:bg-purple-700 text-white"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
