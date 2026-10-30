export type LogoDesignId =
  | "classic"
  | "trusted-by"
  | "infinite-marquee"
  | "grayscale-color"
  | "logo-grid"
  | "premium-cards"
  | "dark-showcase"
  | "compact-strip";

export interface LogoItem {
  id: string;
  name: string;
  imageUrl: string;
  altText?: string | undefined;
  websiteUrl?: string | undefined;
  openInNewTab?: boolean | undefined;
  enabled?: boolean | undefined;
}

export interface LogoDesignDefinition {
  id: LogoDesignId;
  name: string;
  subtitle: string;
  description: string;
  badge: string;
  isGrid?: boolean | undefined;
}

export const LOGO_DESIGNS: LogoDesignDefinition[] = [
  {
    id: "classic",
    name: "Classic Logo Carousel",
    subtitle: "Continuous smooth slider",
    description: "Horizontally arranged logos with clean spacing, smooth movement, and interactive navigation.",
    badge: "Popular",
  },
  {
    id: "trusted-by",
    name: "Trusted By",
    subtitle: "SaaS landing header & logos",
    description: "Prominent trust heading with a centered, balanced row of partner brand logos.",
    badge: "High Converting",
  },
  {
    id: "infinite-marquee",
    name: "Infinite Marquee",
    subtitle: "Seamless looping ticker",
    description: "Continuous moving logos with a perfectly seamless visual loop and pause on hover.",
    badge: "Trending",
  },
  {
    id: "grayscale-color",
    name: "Grayscale to Color",
    subtitle: "Interactive hover reveal",
    description: "Muted grayscale logos by default that reveal full brand colors on mouse hover or keyboard focus.",
    badge: "Interactive",
  },
  {
    id: "logo-grid",
    name: "Logo Grid",
    subtitle: "Responsive static layout",
    description: "Multi-column responsive grid ideal for showcasing sponsors, certifications, and partner networks.",
    badge: "Clean Grid",
    isGrid: true,
  },
  {
    id: "premium-cards",
    name: "Premium Cards",
    subtitle: "Elevated subtle cards",
    description: "Individual logo cards with delicate borders, rounded corners, and soft modern shadows.",
    badge: "Luxury",
  },
  {
    id: "dark-showcase",
    name: "Dark Showcase",
    subtitle: "High contrast dark canvas",
    description: "Engineered for dark sections with crisp contrast, inverted brightness, and luminous logo styling.",
    badge: "Dark Mode",
  },
  {
    id: "compact-strip",
    name: "Compact Partner Strip",
    subtitle: "Slim under-hero ribbon",
    description: "Ultra-slim horizontal logo ribbon with minimal vertical footprint, ideal beneath hero sections.",
    badge: "Minimalist",
  },
];

export interface LogoCarouselConfig {
  designId: LogoDesignId;
  title?: string | undefined;
  description?: string | undefined;
  showHeading: boolean;
  logos: LogoItem[];
  // Layout & Sizing
  visibleLogosDesktop: number; // 2 to 8
  logoHeight: number; // 24 to 80 px
  maxLogoWidth: number; // 60 to 220 px
  gap: number; // 12 to 64 px
  gridColumns: number; // 2 to 6
  paddingY: number; // 12 to 64 px
  containerWidth: "full" | "contained";
  // Carousel Behavior
  autoplay: boolean;
  speed: number; // 1 to 10 seconds or marquee duration
  direction: "left" | "right";
  pauseOnHover: boolean;
  pauseOnFocus: boolean;
  showArrows: boolean;
  showDots: boolean;
  loop: boolean;
  // Appearance
  bgColor: string;
  textColor: string;
  logoOpacity: number; // 20 to 100
  grayscale: boolean;
  hoverColor: boolean;
  cardRadius: number; // 0 to 24 px
  showCardBorder: boolean;
  showCardShadow: boolean;
}

// 8 High Quality, Resolution-Independent Brand SVGs (Generic demonstration logos)
export const SAMPLE_LOGOS: LogoItem[] = [
  {
    id: "logo-1",
    name: "Apex Cloud",
    altText: "Apex Cloud logo",
    websiteUrl: "https://example.com/apex-cloud",
    openInNewTab: true,
    enabled: true,
    imageUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 44" fill="none"><path d="M14 34L28 10L42 34H33L28 24L23 34H14Z" fill="%237C3AED"/><circle cx="28" cy="18" r="3.5" fill="%23A78BFA"/><text x="50" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="%231E293B">Apex<tspan fill="%237C3AED">Cloud</tspan></text></svg>',
  },
  {
    id: "logo-2",
    name: "Nova Pulse",
    altText: "Nova Pulse logo",
    websiteUrl: "https://example.com/nova-pulse",
    openInNewTab: true,
    enabled: true,
    imageUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 44" fill="none"><circle cx="26" cy="22" r="12" stroke="%2306B6D4" stroke-width="3"/><path d="M20 22H24L26 16L28 28L30 22H34" stroke="%230284C7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="48" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="%231E293B">Nova<tspan fill="%230284C7">Pulse</tspan></text></svg>',
  },
  {
    id: "logo-3",
    name: "Vertex Labs",
    altText: "Vertex Labs logo",
    websiteUrl: "https://example.com/vertex-labs",
    openInNewTab: true,
    enabled: true,
    imageUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 44" fill="none"><rect x="14" y="10" width="24" height="24" rx="6" fill="%23F59E0B"/><path d="M21 27L26 17L31 27H21Z" fill="white"/><text x="48" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="%231E293B">Vertex<tspan fill="%23D97706">Labs</tspan></text></svg>',
  },
  {
    id: "logo-4",
    name: "Hyperion AI",
    altText: "Hyperion AI logo",
    websiteUrl: "https://example.com/hyperion-ai",
    openInNewTab: true,
    enabled: true,
    imageUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 44" fill="none"><circle cx="26" cy="22" r="11" fill="%232563EB"/><path d="M26 15V29M19 22H33" stroke="white" stroke-width="2.5" stroke-linecap="round"/><text x="48" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="%231E293B">Hyperion<tspan fill="%232563EB">AI</tspan></text></svg>',
  },
  {
    id: "logo-5",
    name: "Starlight Data",
    altText: "Starlight Data logo",
    websiteUrl: "https://example.com/starlight",
    openInNewTab: true,
    enabled: true,
    imageUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 165 44" fill="none"><path d="M26 10L29 19L38 22L29 25L26 34L23 25L14 22L23 19L26 10Z" fill="%23EC4899"/><text x="48" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="%231E293B">Starlight<tspan fill="%23DB2777">Data</tspan></text></svg>',
  },
  {
    id: "logo-6",
    name: "Solaria Bio",
    altText: "Solaria Bio logo",
    websiteUrl: "https://example.com/solaria-bio",
    openInNewTab: true,
    enabled: true,
    imageUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 44" fill="none"><circle cx="26" cy="22" r="12" fill="%2310B981"/><circle cx="26" cy="22" r="6" fill="%23059669"/><text x="48" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="%231E293B">Solaria<tspan fill="%23059669">Bio</tspan></text></svg>',
  },
  {
    id: "logo-7",
    name: "Quantum Sync",
    altText: "Quantum Sync logo",
    websiteUrl: "https://example.com/quantum-sync",
    openInNewTab: true,
    enabled: true,
    imageUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 165 44" fill="none"><circle cx="20" cy="18" r="5" fill="%236366F1"/><circle cx="32" cy="26" r="5" fill="%238B5CF6"/><line x1="20" y1="18" x2="32" y2="26" stroke="%236366F1" stroke-width="2.5"/><text x="48" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="%231E293B">Quantum<tspan fill="%236366F1">Sync</tspan></text></svg>',
  },
  {
    id: "logo-8",
    name: "Cipher Guard",
    altText: "Cipher Guard logo",
    websiteUrl: "https://example.com/cipher-guard",
    openInNewTab: true,
    enabled: true,
    imageUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 165 44" fill="none"><path d="M26 11L36 15V23C36 29 26 34 26 34C26 34 16 29 16 23V15L26 11Z" fill="%230F172A"/><path d="M24 21L26 23L30 19" stroke="%2338BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><text x="48" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="%231E293B">Cipher<tspan fill="%230284C7">Guard</tspan></text></svg>',
  },
];

export const DEFAULT_LOGO_CAROUSEL_CONFIG: LogoCarouselConfig = {
  designId: "classic",
  title: "Trusted by 10,000+ Fast-Growing Companies",
  description: "Powering innovative engineering and marketing teams around the globe.",
  showHeading: true,
  logos: SAMPLE_LOGOS,
  visibleLogosDesktop: 5,
  logoHeight: 38,
  maxLogoWidth: 150,
  gap: 36,
  gridColumns: 4,
  paddingY: 36,
  containerWidth: "contained",
  autoplay: true,
  speed: 4,
  direction: "left",
  pauseOnHover: true,
  pauseOnFocus: true,
  showArrows: true,
  showDots: true,
  loop: true,
  bgColor: "transparent",
  textColor: "#1E293B",
  logoOpacity: 85,
  grayscale: false,
  hoverColor: true,
  cardRadius: 12,
  showCardBorder: true,
  showCardShadow: false,
};

export function migrateLogoCarouselConfig(raw: any): LogoCarouselConfig {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_LOGO_CAROUSEL_CONFIG };
  }

  const rawLogos = Array.isArray(raw.logos) && raw.logos.length > 0 ? raw.logos : SAMPLE_LOGOS;
  const migratedLogos: LogoItem[] = rawLogos.map((l: any, idx: number) => ({
    id: typeof l.id === "string" ? l.id : `logo-${idx + 1}-${Date.now()}`,
    name: typeof l.name === "string" && l.name.trim() ? l.name : `Partner ${idx + 1}`,
    imageUrl: typeof l.imageUrl === "string" ? l.imageUrl : "",
    altText: typeof l.altText === "string" ? l.altText : undefined,
    websiteUrl: typeof l.websiteUrl === "string" ? l.websiteUrl : undefined,
    openInNewTab: typeof l.openInNewTab === "boolean" ? l.openInNewTab : true,
    enabled: typeof l.enabled === "boolean" ? l.enabled : true,
  }));

  const validDesignIds: LogoDesignId[] = [
    "classic",
    "trusted-by",
    "infinite-marquee",
    "grayscale-color",
    "logo-grid",
    "premium-cards",
    "dark-showcase",
    "compact-strip",
  ];
  const designId: LogoDesignId = validDesignIds.includes(raw.designId) ? raw.designId : "classic";

  return {
    designId,
    title: typeof raw.title === "string" ? raw.title : DEFAULT_LOGO_CAROUSEL_CONFIG.title,
    description: typeof raw.description === "string" ? raw.description : DEFAULT_LOGO_CAROUSEL_CONFIG.description,
    showHeading: typeof raw.showHeading === "boolean" ? raw.showHeading : true,
    logos: migratedLogos,
    visibleLogosDesktop: typeof raw.visibleLogosDesktop === "number" ? Math.max(2, Math.min(8, raw.visibleLogosDesktop)) : 5,
    logoHeight: typeof raw.logoHeight === "number" ? Math.max(20, Math.min(100, raw.logoHeight)) : 38,
    maxLogoWidth: typeof raw.maxLogoWidth === "number" ? Math.max(50, Math.min(260, raw.maxLogoWidth)) : 150,
    gap: typeof raw.gap === "number" ? Math.max(8, Math.min(80, raw.gap)) : 36,
    gridColumns: typeof raw.gridColumns === "number" ? Math.max(2, Math.min(6, raw.gridColumns)) : 4,
    paddingY: typeof raw.paddingY === "number" ? Math.max(8, Math.min(80, raw.paddingY)) : 36,
    containerWidth: raw.containerWidth === "full" ? "full" : "contained",
    autoplay: typeof raw.autoplay === "boolean" ? raw.autoplay : true,
    speed: typeof raw.speed === "number" ? Math.max(1, Math.min(60, raw.speed)) : 4,
    direction: raw.direction === "right" ? "right" : "left",
    pauseOnHover: typeof raw.pauseOnHover === "boolean" ? raw.pauseOnHover : true,
    pauseOnFocus: typeof raw.pauseOnFocus === "boolean" ? raw.pauseOnFocus : true,
    showArrows: typeof raw.showArrows === "boolean" ? raw.showArrows : true,
    showDots: typeof raw.showDots === "boolean" ? raw.showDots : true,
    loop: typeof raw.loop === "boolean" ? raw.loop : true,
    bgColor: typeof raw.bgColor === "string" ? raw.bgColor : "transparent",
    textColor: typeof raw.textColor === "string" ? raw.textColor : "#1E293B",
    logoOpacity: typeof raw.logoOpacity === "number" ? Math.max(20, Math.min(100, raw.logoOpacity)) : 85,
    grayscale: typeof raw.grayscale === "boolean" ? raw.grayscale : false,
    hoverColor: typeof raw.hoverColor === "boolean" ? raw.hoverColor : true,
    cardRadius: typeof raw.cardRadius === "number" ? Math.max(0, Math.min(32, raw.cardRadius)) : 12,
    showCardBorder: typeof raw.showCardBorder === "boolean" ? raw.showCardBorder : true,
    showCardShadow: typeof raw.showCardShadow === "boolean" ? raw.showCardShadow : false,
  };
}
