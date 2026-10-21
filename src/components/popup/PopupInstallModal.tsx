import { useState, type FC } from "react";
import {
  Code2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Info,
  Layers,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PopupWidgetConfig } from "@/lib/popup/types";

interface PopupInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  widgetId: string;
  config: PopupWidgetConfig;
}

export const PopupInstallModal: FC<PopupInstallModalProps> = ({
  isOpen,
  onClose,
  widgetId,
  config,
}) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("html");

  // Derive origin or fallback
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://webtoolocean.com";

  // Standard embed script
  const embedCodeSnippet = `<!-- WebToolOcean Popup Widget -->
<script
  src="${origin}/embed/popup.js"
  data-widget-id="${widgetId}"
  async
></script>`;

  // Self-contained inline config snippet (allows instantaneous embedding without backend database)
  const inlineCodeSnippet = `<!-- WebToolOcean Popup Widget (Self-Contained) -->
<script>
  window.WTO_POPUP_CONFIGS = window.WTO_POPUP_CONFIGS || {};
  window.WTO_POPUP_CONFIGS["${widgetId}"] = ${JSON.stringify(config, null, 2)};
</script>
<script
  src="${origin}/embed/popup.js"
  data-widget-id="${widgetId}"
  async
></script>`;

  const handleCopy = (text: string, isSnippet = true) => {
    navigator.clipboard.writeText(text);
    if (isSnippet) {
      setCopiedScript(true);
      toast.success("Embed script copied to clipboard!");
      setTimeout(() => setCopiedScript(false), 2000);
    } else {
      setCopiedId(true);
      toast.success("Widget ID copied!");
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Install Popup Widget</DialogTitle>
              <DialogDescription className="text-xs">
                Embed your custom popup into any website with a single asynchronous JavaScript tag.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Widget ID Pill */}
          <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/30 p-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Widget ID:</span>
              <code className="rounded bg-background px-2 py-0.5 text-xs font-bold font-mono text-purple-600">
                {widgetId}
              </code>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(widgetId, false)}
              className="h-7 text-xs"
            >
              {copiedId ? <Check className="h-3.5 w-3.5 text-emerald-500 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
              {copiedId ? "Copied" : "Copy ID"}
            </Button>
          </div>

          {/* Standard Embed Snippet Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">Standard Embed Code</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCopy(embedCodeSnippet, true)}
                className="h-7 text-xs font-semibold rounded-lg"
              >
                {copiedScript ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500 mr-1" />
                ) : (
                  <Copy className="h-3.5 w-3.5 mr-1" />
                )}
                {copiedScript ? "Copied!" : "Copy Code"}
              </Button>
            </div>

            <pre className="overflow-x-auto rounded-xl border border-border bg-slate-950 p-3.5 text-[11px] font-mono text-slate-100 leading-relaxed scrollbar-thin">
              <code>{embedCodeSnippet}</code>
            </pre>
          </div>

          {/* Platform Guides */}
          <div className="rounded-xl border border-border/80 p-3.5 space-y-2 bg-muted/20">
            <label className="text-xs font-bold text-foreground block">
              Platform Installation Guide
            </label>
            <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform} className="w-full">
              <TabsList className="grid grid-cols-4 h-8 bg-muted/60 p-0.5 rounded-lg text-xs">
                <TabsTrigger value="html" className="text-[11px] py-1">HTML</TabsTrigger>
                <TabsTrigger value="wordpress" className="text-[11px] py-1">WordPress</TabsTrigger>
                <TabsTrigger value="shopify" className="text-[11px] py-1">Shopify</TabsTrigger>
                <TabsTrigger value="webflow" className="text-[11px] py-1">Webflow</TabsTrigger>
              </TabsList>

              <TabsContent value="html" className="mt-2.5 text-xs text-muted-foreground space-y-1">
                <p>1. Copy the embed code snippet above.</p>
                <p>2. Paste it right before the closing <code className="text-foreground font-mono">&lt;/body&gt;</code> tag of your HTML pages.</p>
              </TabsContent>

              <TabsContent value="wordpress" className="mt-2.5 text-xs text-muted-foreground space-y-1">
                <p>1. Go to your WordPress Dashboard &rarr; Appearance &rarr; Theme File Editor (or use an "Insert Headers and Footers" plugin).</p>
                <p>2. Paste the script into the Footer section and save changes.</p>
              </TabsContent>

              <TabsContent value="shopify" className="mt-2.5 text-xs text-muted-foreground space-y-1">
                <p>1. In Shopify Admin, navigate to Online Store &rarr; Themes &rarr; Edit Code.</p>
                <p>2. Open <code className="text-foreground font-mono">theme.liquid</code>, locate <code className="text-foreground font-mono">&lt;/body&gt;</code>, paste the snippet above it, and click Save.</p>
              </TabsContent>

              <TabsContent value="webflow" className="mt-2.5 text-xs text-muted-foreground space-y-1">
                <p>1. Open Project Settings &rarr; Custom Code.</p>
                <p>2. Paste into the "Footer Code" field and publish your Webflow site.</p>
              </TabsContent>
            </Tabs>
          </div>

          {/* Architecture & Hosting Transparency Note */}
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-3 space-y-1.5">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
              <Info className="h-4 w-4 shrink-0" /> Standalone Script Architecture Note
            </span>
            <p className="text-[11px] text-muted-foreground leading-normal">
              An external script on a 3rd-party website cannot access this dashboard's browser <code className="font-mono">localStorage</code>. For external sites, our runtime supports instant self-contained inline configuration via <code className="font-mono">window.WTO_POPUP_CONFIGS</code> or fetching via backend REST API.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
