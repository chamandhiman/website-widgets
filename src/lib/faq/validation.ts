import type { FaqWidgetConfig } from "./types";

export interface FaqValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateFaqConfig(config: FaqWidgetConfig): FaqValidationResult {
  const errors: Record<string, string> = {};

  if (config.showHeading && (!config.heading || !config.heading.trim())) {
    errors["heading"] = "Heading text cannot be empty when heading is enabled.";
  }

  if (!Array.isArray(config.items) || config.items.length === 0) {
    errors["items"] = "You must include at least one FAQ question and answer.";
  } else {
    for (let i = 0; i < config.items.length; i++) {
      const item = config.items[i];
      if (!item) continue;
      if (!item.question || !item.question.trim()) {
        errors[`item_${item.id || i}_question`] = `Question #${i + 1} cannot be empty.`;
      }
      if (!item.answer || !item.answer.trim()) {
        errors[`item_${item.id || i}_answer`] = `Answer for Question #${i + 1} cannot be empty.`;
      }
    }
  }

  if (config.maxWidth < 320 || config.maxWidth > 1400) {
    errors["maxWidth"] = "Maximum width must be between 320px and 1400px.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
