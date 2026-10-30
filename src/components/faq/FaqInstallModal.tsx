import { InstallModal } from "@/components/InstallModal";
import type { FaqWidgetConfig } from "@/lib/faq/types";

export interface FaqInstallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widgetId: string;
  config?: FaqWidgetConfig;
}

/**
 * FAQ Accordion Install Widget Modal
 * Simplified, clean modal showing only the standard production CDN embed script.
 */
export function FaqInstallModal({
  open,
  onOpenChange,
  widgetId,
  config,
}: FaqInstallModalProps) {
  return (
    <InstallModal
      open={open}
      onOpenChange={onOpenChange}
      widgetType="faq"
      widgetId={widgetId}
      title="Install Widget"
      config={config}
    />
  );
}
