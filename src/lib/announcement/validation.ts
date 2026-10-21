import type { AnnouncementBarConfig } from "./types";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates a URL ensuring only safe schemes are allowed (https, http, relative, #).
 * Strictly rejects javascript:, data:, vbscript:, and malicious schemes.
 */
export function isSafeUrl(rawUrl: string): boolean {
  if (!rawUrl || !rawUrl.trim()) return true; // Optional URLs can be empty
  const trimmed = rawUrl.trim().toLowerCase();

  // Explicit dangerous schemes check
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("vbscript:") ||
    trimmed.startsWith("file:")
  ) {
    return false;
  }

  // Allow relative URLs starting with / or #
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    // If not a full URL and doesn't start with / or #, reject
    return false;
  }
}

/**
 * Validates the full AnnouncementBarConfig before saving or installing.
 */
export function validateAnnouncementConfig(config: AnnouncementBarConfig): ValidationResult {
  const errors: Record<string, string> = {};

  // Text is required
  if (!config.text || !config.text.trim()) {
    errors.text = "Announcement text is required.";
  } else if (config.text.length > 200) {
    errors.text = "Announcement text cannot exceed 200 characters.";
  }

  // Validate Button Link if button is enabled
  if (config.hasButton && config.buttonLink) {
    if (!isSafeUrl(config.buttonLink)) {
      errors.buttonLink = "Please enter a valid, safe URL (https://...). JavaScript links are not allowed.";
    }
  }

  // Validate Inline Link if link is enabled
  if (config.hasLink && config.linkUrl) {
    if (!isSafeUrl(config.linkUrl)) {
      errors.linkUrl = "Please enter a valid, safe URL (https://...). JavaScript links are not allowed.";
    }
  }

  // Validate Countdown target date if enabled
  if (config.hasCountdown) {
    if (!config.countdownTarget) {
      errors.countdownTarget = "Please set a target date and time for the countdown.";
    } else {
      const parsedDate = new Date(config.countdownTarget);
      if (isNaN(parsedDate.getTime())) {
        errors.countdownTarget = "Invalid target date/time format.";
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface CountdownTimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

/**
 * Calculates remaining time from target timestamp.
 */
export function calculateTimeRemaining(targetIso: string): CountdownTimeRemaining {
  const targetTime = new Date(targetIso).getTime();
  const now = Date.now();

  if (isNaN(targetTime) || targetTime <= now) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const diffMs = targetTime - now;
  const totalSeconds = Math.floor(diffMs / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
  };
}
