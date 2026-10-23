export type FaqTemplateId =
  | "classic"
  | "minimal"
  | "card"
  | "bordered"
  | "two-column"
  | "help-center"
  | "category-based"
  | "compact"
  | "highlighted"
  | "dark";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string | undefined;
  badge?: string | undefined;
}

export type IconStyle = "chevron" | "plus-minus" | "arrow";
export type AccordionMode = "single" | "multiple";
export type Density = "compact" | "comfortable" | "spacious";
export type HeadingAlignment = "left" | "center" | "right";
export type ShadowStyle = "none" | "subtle" | "medium";

export interface FaqWidgetConfig {
  // Metadata & Template
  version: number;
  template: FaqTemplateId;

  // Tab A: Content - Heading & Intro
  showHeading: boolean;
  heading: string;
  subtitle: string;
  introText: string;
  headingAlignment: HeadingAlignment;

  // Tab A: Content - FAQ Items & Categories
  items: FaqItem[];
  categories: string[];

  // Search
  enableSearch: boolean;
  searchPlaceholder: string;
  caseInsensitiveSearch: boolean;

  // Categories Filter
  showCategoryFilters: boolean;
  defaultCategory: string; // "All" or a specific category name

  // Tab B: Design - Colors
  bgColor: string;          // Main background
  cardBgColor: string;      // Card or row background
  questionColor: string;    // Question text color
  answerColor: string;      // Answer text color
  accentColor: string;      // Accent highlights, active tabs, badges
  borderColor: string;      // Dividers or borders
  iconColor: string;        // Icon color
  headingColor: string;     // Header text color

  // Tab B: Design - Typography
  fontFamily: string;
  fontSizeQuestion: number; // in px, e.g. 16
  fontSizeAnswer: number;   // in px, e.g. 14
  fontSizeHeading: number;  // in px, e.g. 28
  fontWeightQuestion: "normal" | "medium" | "semibold" | "bold";

  // Tab B: Design - Appearance
  borderRadius: number;     // in px, e.g. 12
  borderWidth: number;      // in px, e.g. 1
  shadow: ShadowStyle;
  iconStyle: IconStyle;
  paddingY: number;         // vertical row padding in px, e.g. 16
  itemGap: number;          // spacing between questions in px, e.g. 8

  // Tab C: Layout
  columns: 1 | 2;
  maxWidth: number;         // in px, e.g. 820
  alignment: "left" | "center" | "full";
  density: Density;
  showContainerBg: boolean;
  showOuterBorder: boolean;

  // Tab D: Behavior
  accordionMode: AccordionMode;
  openFirstByDefault: boolean;
  collapsible: boolean;
}

export const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq_1",
    question: "How long does shipping take?",
    answer:
      "Most domestic orders arrive within 3–5 business days. International shipping generally takes 7–14 business days depending on customs processing in your destination country.",
    category: "Shipping",
    badge: "Popular",
  },
  {
    id: "faq_2",
    question: "What is your return and refund policy?",
    answer:
      "We offer a 30-day money-back guarantee. If you are not completely satisfied with your purchase, you can return it in its original packaging for a full refund or exchange.",
    category: "Orders",
  },
  {
    id: "faq_3",
    question: "Do you ship internationally?",
    answer:
      "Yes! We ship to over 60 countries worldwide. International shipping rates and taxes are calculated automatically during checkout based on your delivery address.",
    category: "Shipping",
  },
  {
    id: "faq_4",
    question: "How can I track my order status?",
    answer:
      "Once your order ships, you will receive an email notification containing a tracking number and a direct link to track your package in real-time.",
    category: "Orders",
    badge: "Tracking",
  },
  {
    id: "faq_5",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and secure bank transfers.",
    category: "Billing",
  },
  {
    id: "faq_6",
    question: "How do I contact customer support?",
    answer:
      "You can reach our dedicated support team via email at support@example.com or via live chat Monday through Friday, 9:00 AM to 6:00 PM EST.",
    category: "Support",
  },
];

export const DEFAULT_FAQ_CATEGORIES: string[] = ["All", "Shipping", "Orders", "Billing", "Support"];

export const DEFAULT_FAQ_CONFIG: FaqWidgetConfig = {
  version: 2,
  template: "classic",

  // Content
  showHeading: true,
  heading: "Frequently Asked Questions",
  subtitle: "Everything you need to know about our products and services.",
  introText: "Can't find the answer you're looking for? Reach out to our customer support team.",
  headingAlignment: "left",

  items: DEFAULT_FAQ_ITEMS,
  categories: DEFAULT_FAQ_CATEGORIES,

  enableSearch: false,
  searchPlaceholder: "Search questions or keywords...",
  caseInsensitiveSearch: true,

  showCategoryFilters: false,
  defaultCategory: "All",

  // Design
  bgColor: "#ffffff",
  cardBgColor: "#ffffff",
  questionColor: "#0f172a",
  answerColor: "#475569",
  accentColor: "#7c3aed",
  borderColor: "#e2e8f0",
  iconColor: "#7c3aed",
  headingColor: "#0f172a",

  fontFamily: "inherit",
  fontSizeQuestion: 16,
  fontSizeAnswer: 14,
  fontSizeHeading: 28,
  fontWeightQuestion: "semibold",

  borderRadius: 12,
  borderWidth: 1,
  shadow: "none",
  iconStyle: "chevron",
  paddingY: 16,
  itemGap: 0,

  // Layout
  columns: 1,
  maxWidth: 820,
  alignment: "center",
  density: "comfortable",
  showContainerBg: true,
  showOuterBorder: true,

  // Behavior
  accordionMode: "single",
  openFirstByDefault: true,
  collapsible: true,
};

export interface RawFaqConfig {
  version?: number;
  template?: string;
  showHeading?: boolean;
  heading?: string;
  title?: string;
  subtitle?: string;
  introText?: string;
  headingAlignment?: string;
  items?: unknown;
  categories?: unknown;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  caseInsensitiveSearch?: boolean;
  showCategoryFilters?: boolean;
  defaultCategory?: string;
  bgColor?: string;
  bg?: string;
  cardBgColor?: string;
  questionColor?: string;
  text?: string;
  answerColor?: string;
  accentColor?: string;
  accent?: string;
  borderColor?: string;
  iconColor?: string;
  headingColor?: string;
  fontFamily?: string;
  fontSizeQuestion?: number;
  fontSizeAnswer?: number;
  fontSizeHeading?: number;
  fontWeightQuestion?: string;
  borderRadius?: number;
  radius?: number;
  borderWidth?: number;
  shadow?: string;
  iconStyle?: string;
  paddingY?: number;
  padding?: number;
  itemGap?: number;
  columns?: number;
  maxWidth?: number;
  width?: number;
  alignment?: string;
  density?: string;
  showContainerBg?: boolean;
  showOuterBorder?: boolean;
  accordionMode?: string;
  openFirstByDefault?: boolean;
  openFirst?: boolean;
  collapsible?: boolean;
}

/**
 * Safely migrates existing legacy FAQ configs or applies sensible defaults.
 */
export function migrateFaqConfig(raw: RawFaqConfig | undefined | null): FaqWidgetConfig {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_FAQ_CONFIG };
  }

  // Parse legacy items if stored as a string "Q | A\nQ | A"
  let parsedItems: FaqItem[] = DEFAULT_FAQ_ITEMS;
  const rawItems = raw["items"];
  if (Array.isArray(rawItems) && rawItems.length > 0) {
    parsedItems = rawItems.map((it: unknown, idx: number) => {
      if (typeof it === "object" && it !== null) {
        const itemObj = it as Record<string, unknown>;
        const categoryVal = typeof itemObj["category"] === "string" ? itemObj["category"] : undefined;
        const badgeVal = typeof itemObj["badge"] === "string" ? itemObj["badge"] : undefined;
        return {
          id: String(itemObj["id"] || `faq_${idx + 1}`),
          question: String(itemObj["question"] || "Question"),
          answer: String(itemObj["answer"] || ""),
          category: categoryVal,
          badge: badgeVal,
        };
      }
      return {
        id: `faq_${idx + 1}`,
        question: String(it),
        answer: "",
      };
    });
  } else if (typeof rawItems === "string" && rawItems.trim()) {
    const lines = rawItems.split("\n").filter((l) => l.trim().length > 0);
    if (lines.length > 0) {
      parsedItems = lines.map((line, idx) => {
        const parts = line.split("|").map((p) => p.trim());
        return {
          id: `faq_${idx + 1}`,
          question: parts[0] || `Question ${idx + 1}`,
          answer: parts[1] || "",
        };
      });
    }
  }

  // Extract categories from items
  const itemCats = parsedItems
    .map((it) => it.category)
    .filter((c): c is string => Boolean(c && c !== "All"));
  const mergedCategories = Array.from(new Set(["All", ...itemCats, ...(Array.isArray(raw.categories) ? (raw.categories as string[]) : [])]));

  return {
    version: 2,
    template: (raw.template as FaqTemplateId) || "classic",

    showHeading: raw.showHeading !== undefined ? Boolean(raw.showHeading) : true,
    heading: typeof raw.heading === "string" ? raw.heading : typeof raw.title === "string" ? raw.title : DEFAULT_FAQ_CONFIG.heading,
    subtitle: typeof raw.subtitle === "string" ? raw.subtitle : DEFAULT_FAQ_CONFIG.subtitle,
    introText: typeof raw.introText === "string" ? raw.introText : DEFAULT_FAQ_CONFIG.introText,
    headingAlignment: (raw.headingAlignment as HeadingAlignment) || "left",

    items: parsedItems,
    categories: mergedCategories.length > 1 ? mergedCategories : DEFAULT_FAQ_CATEGORIES,

    enableSearch: Boolean(raw.enableSearch),
    searchPlaceholder: typeof raw.searchPlaceholder === "string" ? raw.searchPlaceholder : DEFAULT_FAQ_CONFIG.searchPlaceholder,
    caseInsensitiveSearch: raw.caseInsensitiveSearch !== undefined ? Boolean(raw.caseInsensitiveSearch) : true,

    showCategoryFilters: Boolean(raw.showCategoryFilters),
    defaultCategory: typeof raw.defaultCategory === "string" ? raw.defaultCategory : "All",

    bgColor: typeof raw.bgColor === "string" ? raw.bgColor : typeof raw.bg === "string" ? raw.bg : DEFAULT_FAQ_CONFIG.bgColor,
    cardBgColor: typeof raw.cardBgColor === "string" ? raw.cardBgColor : DEFAULT_FAQ_CONFIG.cardBgColor,
    questionColor: typeof raw.questionColor === "string" ? raw.questionColor : typeof raw.text === "string" ? raw.text : DEFAULT_FAQ_CONFIG.questionColor,
    answerColor: typeof raw.answerColor === "string" ? raw.answerColor : DEFAULT_FAQ_CONFIG.answerColor,
    accentColor: typeof raw.accentColor === "string" ? raw.accentColor : typeof raw.accent === "string" ? raw.accent : DEFAULT_FAQ_CONFIG.accentColor,
    borderColor: typeof raw.borderColor === "string" ? raw.borderColor : DEFAULT_FAQ_CONFIG.borderColor,
    iconColor: typeof raw.iconColor === "string" ? raw.iconColor : typeof raw.accent === "string" ? raw.accent : DEFAULT_FAQ_CONFIG.iconColor,
    headingColor: typeof raw.headingColor === "string" ? raw.headingColor : typeof raw.text === "string" ? raw.text : DEFAULT_FAQ_CONFIG.headingColor,

    fontFamily: typeof raw.fontFamily === "string" ? raw.fontFamily : "inherit",
    fontSizeQuestion: typeof raw.fontSizeQuestion === "number" ? raw.fontSizeQuestion : DEFAULT_FAQ_CONFIG.fontSizeQuestion,
    fontSizeAnswer: typeof raw.fontSizeAnswer === "number" ? raw.fontSizeAnswer : DEFAULT_FAQ_CONFIG.fontSizeAnswer,
    fontSizeHeading: typeof raw.fontSizeHeading === "number" ? raw.fontSizeHeading : DEFAULT_FAQ_CONFIG.fontSizeHeading,
    fontWeightQuestion: (raw.fontWeightQuestion as FaqWidgetConfig["fontWeightQuestion"]) || "semibold",

    borderRadius: typeof raw.borderRadius === "number" ? raw.borderRadius : typeof raw.radius === "number" ? raw.radius : DEFAULT_FAQ_CONFIG.borderRadius,
    borderWidth: typeof raw.borderWidth === "number" ? raw.borderWidth : DEFAULT_FAQ_CONFIG.borderWidth,
    shadow: (raw.shadow as ShadowStyle) || "none",
    iconStyle: (raw.iconStyle as IconStyle) || "chevron",
    paddingY: typeof raw.paddingY === "number" ? raw.paddingY : typeof raw.padding === "number" ? raw.padding : DEFAULT_FAQ_CONFIG.paddingY,
    itemGap: typeof raw.itemGap === "number" ? raw.itemGap : DEFAULT_FAQ_CONFIG.itemGap,

    columns: raw.columns === 2 ? 2 : 1,
    maxWidth: typeof raw.maxWidth === "number" ? raw.maxWidth : typeof raw.width === "number" ? raw.width : DEFAULT_FAQ_CONFIG.maxWidth,
    alignment: (raw.alignment as FaqWidgetConfig["alignment"]) || "center",
    density: (raw.density as Density) || "comfortable",
    showContainerBg: raw.showContainerBg !== undefined ? Boolean(raw.showContainerBg) : true,
    showOuterBorder: raw.showOuterBorder !== undefined ? Boolean(raw.showOuterBorder) : true,

    accordionMode: (raw.accordionMode as AccordionMode) || "single",
    openFirstByDefault: raw.openFirstByDefault !== undefined ? Boolean(raw.openFirstByDefault) : raw.openFirst !== undefined ? Boolean(raw.openFirst) : true,
    collapsible: raw.collapsible !== undefined ? Boolean(raw.collapsible) : true,
  };
}
