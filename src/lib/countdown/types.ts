export type CountdownStyle = "Boxes" | "Minimal";
export type CountdownTimezone = "Local" | "UTC";
export type CountdownExpireAction = "message" | "hide";
export type CountdownDesignId = "cards" | "minimal" | "circular" | "flip" | "banner" | "elegant";

export interface CountdownConfig {
  designId: CountdownDesignId;
  title: string;
  target: string;
  timezone: CountdownTimezone;
  expiryMessage: string;
  expireAction: CountdownExpireAction;
  style: CountdownStyle;
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  bg: string;
  text: string;
  accent: string;
  boxBg?: string;
  boxText?: string;
  radius: number;
  padding: number;
  width: number;
  align: "center" | "left";
  bannerCtaText?: string;
  bannerCtaLink?: string;
  bannerBadge?: string;
}

export interface CountdownDesignDefinition {
  id: CountdownDesignId;
  name: string;
  badgeLabel: string;
  description: string;
  defaults: Partial<CountdownConfig>;
}

export const COUNTDOWN_DESIGNS: CountdownDesignDefinition[] = [
  {
    id: "cards",
    name: "1. Modern Cards",
    badgeLabel: "Modern Cards",
    description: "Large countdown numbers displayed inside individual rounded cards with a bold, modern appearance.",
    defaults: {
      designId: "cards",
      style: "Boxes",
      bg: "#ffffff",
      text: "#0f172a",
      accent: "#7c3aed",
      boxBg: "#7c3aed",
      boxText: "#ffffff",
      radius: 16,
      padding: 24,
      width: 720,
    },
  },
  {
    id: "minimal",
    name: "2. Minimal",
    badgeLabel: "Minimal",
    description: "Clean typography, simple number and label combinations, and minimal decoration.",
    defaults: {
      designId: "minimal",
      style: "Minimal",
      bg: "#ffffff",
      text: "#111827",
      accent: "#111827",
      boxBg: "transparent",
      boxText: "#111827",
      radius: 8,
      padding: 20,
      width: 680,
    },
  },
  {
    id: "circular",
    name: "3. Circular Timer",
    badgeLabel: "Circular Timer",
    description: "Circular indicators displaying the countdown units.",
    defaults: {
      designId: "circular",
      style: "Boxes",
      bg: "#ffffff",
      text: "#0f172a",
      accent: "#2563eb",
      boxBg: "#eff6ff",
      boxText: "#1d4ed8",
      radius: 999,
      padding: 24,
      width: 740,
    },
  },
  {
    id: "flip",
    name: "4. Flip Clock",
    badgeLabel: "Flip Clock",
    description: "A digital flip-clock-inspired countdown appearance.",
    defaults: {
      designId: "flip",
      style: "Boxes",
      bg: "#18181b",
      text: "#f4f4f5",
      accent: "#fbbf24",
      boxBg: "#27272a",
      boxText: "#ffffff",
      radius: 10,
      padding: 24,
      width: 720,
    },
  },
  {
    id: "banner",
    name: "5. Banner",
    badgeLabel: "Banner",
    description: "A prominent, full-width promotional countdown suitable for sales and limited-time offers.",
    defaults: {
      designId: "banner",
      style: "Boxes",
      bg: "#0f172a",
      text: "#ffffff",
      accent: "#f59e0b",
      boxBg: "#1e293b",
      boxText: "#f59e0b",
      radius: 12,
      padding: 18,
      width: 960,
      bannerCtaText: "Claim Offer",
      bannerCtaLink: "https://example.com/deal",
      bannerBadge: "Special Promotion",
    },
  },
  {
    id: "elegant",
    name: "6. Elegant",
    badgeLabel: "Elegant",
    description: "Premium typography, subtle borders, balanced spacing, and a refined appearance.",
    defaults: {
      designId: "elegant",
      style: "Boxes",
      bg: "#fdfbf7",
      text: "#292524",
      accent: "#b45309",
      boxBg: "#ffffff",
      boxText: "#292524",
      radius: 8,
      padding: 28,
      width: 720,
    },
  },
];

export const DEFAULT_COUNTDOWN_CONFIG: CountdownConfig = {
  designId: "cards",
  title: "Limited Time Offer Ends In",
  target: "2027-12-31T23:59",
  timezone: "Local",
  expiryMessage: "This offer has ended.",
  expireAction: "message",
  style: "Boxes",
  showDays: true,
  showHours: true,
  showMinutes: true,
  showSeconds: true,
  bg: "#ffffff",
  text: "#0f172a",
  accent: "#7c3aed",
  boxBg: "#7c3aed",
  boxText: "#ffffff",
  radius: 16,
  padding: 24,
  width: 720,
  align: "center",
  bannerCtaText: "Claim Offer",
  bannerCtaLink: "https://example.com/deal",
  bannerBadge: "Special Promotion",
};

/**
 * Migration helper to ensure any partial or older saved countdown config
 * gets safely populated with all default fields while preserving existing user data.
 */
export function migrateCountdownConfig(raw: Partial<CountdownConfig> | undefined): CountdownConfig {
  if (!raw) return { ...DEFAULT_COUNTDOWN_CONFIG };

  const inferredDesign: CountdownDesignId =
    raw.designId || (raw.style === "Minimal" ? "minimal" : "cards");

  return {
    ...DEFAULT_COUNTDOWN_CONFIG,
    ...raw,
    designId: inferredDesign,
    title: raw.title !== undefined ? String(raw.title) : DEFAULT_COUNTDOWN_CONFIG.title,
    target: raw.target ? String(raw.target) : DEFAULT_COUNTDOWN_CONFIG.target,
    timezone: (raw.timezone as CountdownTimezone) || "Local",
    expiryMessage: raw.expiryMessage !== undefined ? String(raw.expiryMessage) : DEFAULT_COUNTDOWN_CONFIG.expiryMessage,
    expireAction: (raw.expireAction as CountdownExpireAction) || "message",
    style: raw.style === "Minimal" ? "Minimal" : "Boxes",
    showDays: raw.showDays !== undefined ? Boolean(raw.showDays) : true,
    showHours: raw.showHours !== undefined ? Boolean(raw.showHours) : true,
    showMinutes: raw.showMinutes !== undefined ? Boolean(raw.showMinutes) : true,
    showSeconds: raw.showSeconds !== undefined ? Boolean(raw.showSeconds) : true,
    bg: raw.bg || DEFAULT_COUNTDOWN_CONFIG.bg,
    text: raw.text || DEFAULT_COUNTDOWN_CONFIG.text,
    accent: raw.accent || DEFAULT_COUNTDOWN_CONFIG.accent,
    boxBg: raw.boxBg || raw.accent || DEFAULT_COUNTDOWN_CONFIG.boxBg,
    boxText: raw.boxText || "#ffffff",
    radius: typeof raw.radius === "number" ? raw.radius : DEFAULT_COUNTDOWN_CONFIG.radius,
    padding: typeof raw.padding === "number" ? raw.padding : DEFAULT_COUNTDOWN_CONFIG.padding,
    width: typeof raw.width === "number" ? raw.width : DEFAULT_COUNTDOWN_CONFIG.width,
    align: raw.align === "left" ? "left" : "center",
    bannerCtaText: raw.bannerCtaText || DEFAULT_COUNTDOWN_CONFIG.bannerCtaText,
    bannerCtaLink: raw.bannerCtaLink || DEFAULT_COUNTDOWN_CONFIG.bannerCtaLink,
    bannerBadge: raw.bannerBadge || DEFAULT_COUNTDOWN_CONFIG.bannerBadge,
  };
}
