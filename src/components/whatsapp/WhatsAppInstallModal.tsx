import { InstallModal } from "@/components/InstallModal";
import type { WhatsAppWidgetConfig } from "@/lib/whatsapp/types";

export interface WhatsAppInstallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widgetId: string;
  config?: WhatsAppWidgetConfig;
}

/**
 * WhatsApp Chat Install Widget Modal
 * Simplified, clean modal showing only the standard production CDN embed script.
 */
export function WhatsAppInstallModal({
  open,
  onOpenChange,
  widgetId,
  config,
}: WhatsAppInstallModalProps) {
  return (
    <InstallModal
      open={open}
      onOpenChange={onOpenChange}
      widgetType="whatsapp"
      widgetId={widgetId}
      title="Install Widget"
      config={config}
    />
  );
}
