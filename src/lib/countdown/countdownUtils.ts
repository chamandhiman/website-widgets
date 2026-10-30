export interface CountdownTimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  isValid: boolean;
}

/**
 * Parses target date/time string with timezone support.
 * Supports:
 * - "2027-12-31T23:59" / "2027-12-31T23:59:59"
 * - "2026-12-31" (treated as end of that day: 23:59:59)
 * - ISO string with timezone or timezone argument ("Local" or "UTC")
 */
export function parseCountdownTarget(
  targetStr: string | undefined | null,
  timezone: string = "Local"
): number {
  if (!targetStr || typeof targetStr !== "string") return NaN;
  const str = targetStr.trim();
  if (!str) return NaN;

  // If date only (e.g. "2026-12-31")
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(str);
  const normalizedStr = isDateOnly ? `${str}T23:59:59` : str;

  const isUtc = timezone && timezone.toUpperCase() === "UTC";

  if (isUtc) {
    // If not already explicitly UTC or offset
    if (!normalizedStr.endsWith("Z") && !/[+-]\d{2}:\d{2}$/.test(normalizedStr)) {
      const parsed = Date.parse(`${normalizedStr}Z`);
      if (!isNaN(parsed)) return parsed;
    }
  }

  const timestamp = new Date(normalizedStr).getTime();
  return isNaN(timestamp) ? NaN : timestamp;
}

/**
 * Calculates remaining time until target timestamp.
 * Stops at 0, handles expired and invalid states cleanly.
 */
export function calculateCountdownRemaining(
  targetTimestamp: number,
  nowTimestamp: number = Date.now()
): CountdownTimeRemaining {
  if (isNaN(targetTimestamp)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      isValid: false,
    };
  }

  const diffMs = targetTimestamp - nowTimestamp;

  if (diffMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      isValid: true,
    };
  }

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
    isValid: true,
  };
}
