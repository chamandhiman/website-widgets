import { InstallModal } from "@/components/InstallModal";
import type { EventCalendarConfig } from "@/lib/calendar/types";

export interface EventCalendarInstallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widgetId: string;
  config?: EventCalendarConfig;
}

/**
 * Event Calendar Install Widget Modal
 * Simplified, clean modal displaying the standard production CDN embed script and DONE button.
 */
export function EventCalendarInstallModal({
  open,
  onOpenChange,
  widgetId,
  config,
}: EventCalendarInstallModalProps) {
  return (
    <InstallModal
      open={open}
      onOpenChange={onOpenChange}
      widgetType="event-calendar"
      widgetId={widgetId}
      title="Install Widget"
      config={config}
    />
  );
}
