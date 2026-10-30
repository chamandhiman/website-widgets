import type { LogoItem } from "./types";

/**
 * Validates that a destination URL uses a safe protocol (http, https, mailto, tel, or hash)
 */
export function isSafeUrl(url?: string | null): boolean {
  if (!url || !url.trim()) return true;
  const trimmed = url.trim();
  if (trimmed === "#") return true;
  if (/^(?:https?:\/\/|mailto:|tel:|\/|#)/i.test(trimmed)) {
    return true;
  }
  return false;
}

/**
 * Splits an array of logos into pages based on the visible count
 */
export function getLogoPages(logos: LogoItem[], itemsPerPage: number): LogoItem[][] {
  const activeLogos = logos.filter((l) => l.enabled !== false);
  if (activeLogos.length === 0) return [];
  const safeItemsPerPage = Math.max(1, itemsPerPage);
  const pages: LogoItem[][] = [];

  for (let i = 0; i < activeLogos.length; i += safeItemsPerPage) {
    pages.push(activeLogos.slice(i, i + safeItemsPerPage));
  }

  return pages;
}

/**
 * Generates an SVG fallback data URL with the brand name initials
 */
export function getLogoFallbackSvg(name: string): string {
  const safeName = (name || "Partner").trim();
  const initials = safeName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

  const escapedName = safeName
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 44" fill="none">
    <rect x="2" y="4" width="36" height="36" rx="8" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5"/>
    <text x="20" y="27" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#64748B" text-anchor="middle">${initials}</text>
    <text x="48" y="27" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#334155">${escapedName}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
