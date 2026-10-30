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
import { getStandardEmbedSnippet } from "@/lib/embed";
import { cn } from "@/lib/utils";

export interface InstallModalProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  widgetType?: string;
  widgetId: string;
  title?: string;
  codeSnippet?: string;
  config?: unknown;
}

/**
 * Standard Minimal Install Widget Modal
 *
 * Displays only:
 * - Title: "Install Widget"
 * - Short description: "Copy this code and paste it into your website page where you want the widget to appear."
 * - Embed code box with standard production CDN script & readable monospace font
 * - Prominent "Copy Code" button with brief confirmation feedback
 * - Modal footer with secondary "Cancel" button and primary purple "Done" button
 */
export function InstallModal({
  open,
  isOpen,
  onOpenChange,
  onClose,
  widgetType = "countdown",
  widgetId,
  title = "Install Widget",
  codeSnippet,
}: InstallModalProps) {
  const [copied, setCopied] = useState(false);

  const isModalOpen = open ?? isOpen ?? false;

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange?.(nextOpen);
    if (!nextOpen) {
      onClose?.();
    }
  };

  // Generate the clean standard production CDN embed script
  const scriptSnippet =
    codeSnippet ||
    getStandardEmbedSnippet({
      widgetType,
      widgetId,
      hostMode: "cdn",
    });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scriptSnippet);
      setCopied(true);
      toast.success("Embed code copied to clipboard!", {
        description: "Paste it into your website HTML where you want the widget to appear.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy automatically. Please select and copy manually.");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg sm:max-w-xl w-full p-0 overflow-hidden sm:rounded-2xl border-border bg-card shadow-2xl gap-0">
        {/* Header */}
        <div className="p-6 pb-5 border-b border-border/80 pr-14 bg-card">
          <DialogHeader className="space-y-1.5 text-left">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400">
                <Code2 className="h-5 w-5" />
              </span>
              <DialogTitle className="text-lg font-bold text-foreground sm:text-xl">
                {title}
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              Copy this code and paste it into your website page where you want the widget to appear.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Embed Code Area */}
        <div className="p-6 space-y-3">
          <div className="relative rounded-xl border border-border/80 bg-slate-950 p-4 pt-12 shadow-inner">
            <div className="absolute top-2.5 left-4 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-700/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-700/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-700/80" />
              <span className="ml-2 text-[11px] font-mono font-medium text-slate-400">
                HTML Embed Code
              </span>
            </div>

            <Button
              type="button"
              size="sm"
              onClick={handleCopy}
              className={cn(
                "absolute right-2.5 top-2.5 h-8 gap-1.5 px-3 text-xs font-semibold rounded-lg transition-all shadow-xs",
                copied
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              )}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </Button>

            <pre className="overflow-x-auto text-xs sm:text-[13px] font-mono text-slate-100 leading-relaxed scrollbar-thin">
              <code>{scriptSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-border/80 flex items-center justify-end gap-2.5 bg-muted/20">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleOpenChange(false)}
            className="h-9 px-4 rounded-xl border-border/80 font-medium text-muted-foreground hover:text-foreground text-xs sm:text-sm"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => handleOpenChange(false)}
            className="h-9 min-w-20 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
