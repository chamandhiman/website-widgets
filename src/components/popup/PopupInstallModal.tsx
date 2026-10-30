import type { FC } from "react";
import { InstallModal } from "@/components/InstallModal";
import type { PopupWidgetConfig } from "@/lib/popup/types";

export interface PopupInstallModalProps {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  widgetId: string;
  config?: PopupWidgetConfig;
}

/**
 * Popup Install Widget Modal
 * Simplified, clean modal showing only the standard production CDN embed script.
 */
export const PopupInstallModal: FC<PopupInstallModalProps> = ({
  isOpen,
  open,
  onClose,
  onOpenChange,
  widgetId,
  config,
}) => {
  return (
    <InstallModal
      open={open ?? isOpen ?? false}
      onOpenChange={(nextOpen) => {
        onOpenChange?.(nextOpen);
        if (!nextOpen) {
          onClose?.();
        }
      }}
      onClose={onClose}
      widgetType="popup"
      widgetId={widgetId}
      title="Install Widget"
      config={config}
    />
  );
};
