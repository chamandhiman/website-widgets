import type { PopupWidgetConfig } from "./types";

export interface PopupValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings?: Record<string, string>;
}

export function isSafeUrl(url: string): boolean {
  if (!url || url.trim() === "" || url === "#") return true;
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("data:text/html") ||
    trimmed.startsWith("vbscript:")
  ) {
    return false;
  }
  return (
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("#")
  );
}

export function parseVideoUrl(url: string): {
  platform: "youtube" | "vimeo" | "mp4" | "unknown";
  embedUrl: string;
} {
  if (!url) return { platform: "unknown", embedUrl: "" };

  const trimmed = url.trim();

  // YouTube match
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return {
      platform: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?enablejsapi=1`,
    };
  }

  // Vimeo match
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      platform: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}`,
    };
  }

  // Direct MP4 / WebM
  if (trimmed.endsWith(".mp4") || trimmed.endsWith(".webm") || trimmed.includes(".mp4?")) {
    return {
      platform: "mp4",
      embedUrl: trimmed,
    };
  }

  return { platform: "unknown", embedUrl: trimmed };
}

export function validatePopupConfig(config: PopupWidgetConfig): PopupValidationResult {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  // Title validation
  if (config.templateId !== "custom-html") {
    if (!config.title || config.title.trim().length === 0) {
      errors["title"] = "Popup title is required.";
    } else if (config.title.length > 100) {
      errors["title"] = "Title cannot exceed 100 characters.";
    }
  }

  // Description length
  if (config.description && config.description.length > 300) {
    errors["description"] = "Description cannot exceed 300 characters.";
  }

  // Primary Button URL
  if (config.primaryButtonUrl && !isSafeUrl(config.primaryButtonUrl)) {
    errors["primaryButtonUrl"] = "Please enter a valid, safe URL (http, https, mailto, tel, or #).";
  }

  // Secondary Button URL
  if (config.hasSecondaryButton && config.secondaryButtonUrl && !isSafeUrl(config.secondaryButtonUrl)) {
    errors["secondaryButtonUrl"] = "Secondary button URL must be a valid, safe destination.";
  }

  // Template specific checks
  if (config.templateId === "video") {
    if (!config.videoUrl || config.videoUrl.trim().length === 0) {
      errors["videoUrl"] = "Video URL is required for Video Popups.";
    } else {
      const parsed = parseVideoUrl(config.videoUrl);
      if (parsed.platform === "unknown") {
        errors["videoUrl"] = "Please provide a valid YouTube, Vimeo, or direct MP4 video URL.";
      }
    }
  }

  if (config.templateId === "custom-html") {
    if (!config.customHtmlContent || config.customHtmlContent.trim().length === 0) {
      errors["customHtmlContent"] = "Custom HTML content cannot be empty.";
    } else if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(config.customHtmlContent)) {
      warnings["customHtmlContent"] = "Script tags are disabled in editor preview for security.";
    }
  }

  if (config.templateId === "age-verification") {
    if (config.declineAction === "redirect" && config.declineUrl && !isSafeUrl(config.declineUrl)) {
      errors["declineUrl"] = "Decline redirect URL must be a valid safe URL.";
    }
  }

  // Scheduling validation
  if (config.enableScheduling) {
    if (config.startDate && config.endDate) {
      const start = new Date(config.startDate).getTime();
      const end = new Date(config.endDate).getTime();
      if (!isNaN(start) && !isNaN(end) && start > end) {
        errors["schedule"] = "Start date must be earlier than end date.";
      }
    }
  }

  // Trigger click selector check
  if (config.triggerType === "click") {
    if (!config.clickSelector || config.clickSelector.trim().length === 0) {
      errors["clickSelector"] = "Please specify a CSS selector (e.g. .open-popup-btn or #subscribe-btn).";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}
