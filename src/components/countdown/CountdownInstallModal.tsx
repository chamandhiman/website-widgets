import { InstallModal } from "@/components/InstallModal";
import type { CountdownConfig } from "@/lib/countdown/types";

export interface CountdownInstallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widgetId: string;
  config?: CountdownConfig;
}

/**
 * Countdown Timer Install Widget Modal
 * Simplified, clean modal showing only the standard production CDN embed script.
 */
export function CountdownInstallModal({
  open,
  onOpenChange,
  widgetId,
  config,
}: CountdownInstallModalProps) {
  return (
    <InstallModal
      open={open}
      onOpenChange={onOpenChange}
      widgetType="countdown"
      widgetId={widgetId}
      title="Install Widget"
      config={config}
    />
  );
}
