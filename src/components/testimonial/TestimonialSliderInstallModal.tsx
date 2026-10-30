import { InstallModal } from "@/components/InstallModal";
import type { TestimonialSliderConfig } from "@/lib/testimonial/types";

export interface TestimonialSliderInstallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widgetId: string;
  config?: TestimonialSliderConfig;
}

/**
 * Testimonial Slider Install Widget Modal
 * Simplified, clean modal displaying the standard production CDN embed script and DONE button.
 */
export function TestimonialSliderInstallModal({
  open,
  onOpenChange,
  widgetId,
  config,
}: TestimonialSliderInstallModalProps) {
  return (
    <InstallModal
      open={open}
      onOpenChange={onOpenChange}
      widgetType="testimonial-slider"
      widgetId={widgetId}
      title="Install Widget"
      config={config}
    />
  );
}
