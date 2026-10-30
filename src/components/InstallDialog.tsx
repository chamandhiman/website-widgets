import { InstallModal } from "@/components/InstallModal";

export interface InstallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  code?: string;
  widgetType?: string;
  widgetId?: string;
}

/**
 * Generic InstallDialog
 * Uses the unified InstallModal component for consistent layout, typography, and buttons.
 */
export function InstallDialog({
  open,
  onOpenChange,
  code,
  widgetType = "countdown",
  widgetId = "wto_widget",
}: InstallDialogProps) {
  return (
    <InstallModal
      open={open}
      onOpenChange={onOpenChange}
      widgetType={widgetType}
      widgetId={widgetId}
      title="Install Widget"
      codeSnippet={code}
    />
  );
}
