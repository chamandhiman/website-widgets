import type { TestimonialItem } from "./types";

/**
 * Returns initials from a reviewer's full name.
 * e.g. "Sophia Martinez" -> "SM", "Alexander" -> "A"
 */
export function getInitials(name: string): string {
  if (!name || typeof name !== "string") return "?";
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return (parts[0]?.[0] || "?").toUpperCase();
  }
  const first = parts[0]?.[0] || "";
  const last = parts[parts.length - 1]?.[0] || "";
  return `${first}${last}`.toUpperCase();
}

/**
 * Clamps rating between 1 and 5 stars.
 */
export function normalizeRating(rating?: number): number {
  if (typeof rating !== "number" || isNaN(rating)) return 5;
  return Math.max(1, Math.min(5, Math.round(rating)));
}

/**
 * Computes chunked pages of testimonials based on visible cards per slide.
 */
export function getTestimonialPages(
  items: TestimonialItem[],
  itemsPerPage: number
): TestimonialItem[][] {
  if (!items || items.length === 0) return [];
  const chunkSize = Math.max(1, itemsPerPage);
  const pages: TestimonialItem[][] = [];

  for (let i = 0; i < items.length; i += chunkSize) {
    pages.push(items.slice(i, i + chunkSize));
  }

  return pages;
}

/**
 * Generates an excerpt for previews.
 */
export function getReviewExcerpt(text: string, maxLength = 80): string {
  if (!text) return "";
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trim()}...`;
}
