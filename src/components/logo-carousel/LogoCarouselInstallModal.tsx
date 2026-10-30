import { InstallModal } from "@/components/InstallModal";
import type { LogoCarouselConfig } from "@/lib/logo-carousel/types";

export interface LogoCarouselInstallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widgetId: string;
  config?: LogoCarouselConfig;
}

export function LogoCarouselInstallModal({
  open,
  onOpenChange,
  widgetId,
  config,
}: LogoCarouselInstallModalProps) {
  return (
    <InstallModal
      open={open}
      onOpenChange={onOpenChange}
      widgetType="logo-carousel"
      widgetId={widgetId}
      title="Install Logo Carousel"
      config={config}
    />
  );
}
