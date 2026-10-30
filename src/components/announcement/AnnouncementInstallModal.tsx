import { InstallModal } from "@/components/InstallModal";
import type { AnnouncementBarConfig } from "@/lib/announcement/types";

export interface AnnouncementInstallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widgetId: string;
  config?: AnnouncementBarConfig;
}

/**
 * Announcement Bar Install Widget Modal
 * Simplified, clean modal showing only the standard production CDN embed script.
 */
export function AnnouncementInstallModal({
  open,
  onOpenChange,
  widgetId,
  config,
}: AnnouncementInstallModalProps) {
  return (
    <InstallModal
      open={open}
      onOpenChange={onOpenChange}
      widgetType="announcement-bar"
      widgetId={widgetId}
      title="Install Widget"
      config={config}
    />
  );
}
