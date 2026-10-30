export type TestimonialDesignId =
  | "modern-cards"
  | "minimal"
  | "elegant"
  | "dark"
  | "quote-focus"
  | "compact";

export interface TestimonialItem {
  id: string;
  name: string;
  review: string;
  photoUrl?: string | undefined;
  designation?: string | undefined;
  company?: string | undefined;
  rating?: number | undefined; // 1 to 5
  websiteUrl?: string | undefined;
}

export interface TestimonialDesignDefinition {
  id: TestimonialDesignId;
  name: string;
  description: string;
  badge: string;
  previewBg: string;
}

export const TESTIMONIAL_DESIGNS: TestimonialDesignDefinition[] = [
  {
    id: "modern-cards",
    name: "Modern Cards",
    description: "Elevated cards with subtle shadows, clean borders, star ratings, and reviewer profile.",
    badge: "Popular",
    previewBg: "from-purple-500/10 via-indigo-500/10 to-blue-500/10",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, understated typography with generous whitespace and subtle borders.",
    badge: "Clean",
    previewBg: "from-slate-100 to-slate-200",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Editorial styling with serif headings, refined spacing, and luxury brand aesthetics.",
    badge: "Luxury",
    previewBg: "from-amber-500/10 via-stone-200 to-amber-100/30",
  },
  {
    id: "dark",
    name: "Dark",
    description: "Sleek dark theme with slate-900 canvas, glowing borders, and high contrast accents.",
    badge: "Sleek",
    previewBg: "from-slate-900 to-zinc-950",
  },
  {
    id: "quote-focus",
    name: "Quote Focus",
    description: "Extra-large quotation mark with prominent statement text and attribution beneath.",
    badge: "Editorial",
    previewBg: "from-violet-500/10 to-fuchsia-500/10",
  },
  {
    id: "compact",
    name: "Compact Slider",
    description: "Space-efficient horizontal layout optimized for sidebars and narrow site columns.",
    badge: "Sidebar",
    previewBg: "from-emerald-500/10 to-teal-500/10",
  },
];

export interface TestimonialSliderConfig {
  designId: TestimonialDesignId;
  title: string;
  description?: string | undefined;
  testimonials: TestimonialItem[];
  // Slider Behavior
  autoplay: boolean;
  autoplayInterval: number; // in seconds (e.g. 5)
  showArrows: boolean;
  showDots: boolean;
  desktopColumns: number; // 1, 2, or 3 visible cards
  // Display Options
  showPhotos: boolean;
  showRatings: boolean;
  showDesignation: boolean;
  showCompany: boolean;
}

export const SAMPLE_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "demo-t1",
    name: "Sophia Martinez",
    designation: "Head of Marketing",
    company: "Lumina Studio",
    rating: 5,
    review:
      "WebToolOcean has completely transformed our conversion rates. Adding widgets takes seconds and the visual polish immediately elevated our brand trust.",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    websiteUrl: "https://luminastudio.example.com",
  },
  {
    id: "demo-t2",
    name: "Alexander Wright",
    designation: "Founder & CEO",
    company: "Apex Growth",
    rating: 5,
    review:
      "The clean design and mobile responsiveness are outstanding. We saw an immediate 28% increase in client inquiries after embedding these testimonials.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    websiteUrl: "https://apexgrowth.example.com",
  },
  {
    id: "demo-t3",
    name: "Emily Chen",
    designation: "Product Designer",
    company: "Pulse UI",
    rating: 5,
    review:
      "Every layout is genuinely gorgeous. The typography, spacing, and micro-interactions feel like they were crafted by a senior design agency.",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    websiteUrl: "https://pulseui.example.com",
  },
  {
    id: "demo-t4",
    name: "Marcus Vance",
    designation: "E-Commerce Director",
    company: "Nordic Goods",
    rating: 4,
    review:
      "Extremely reliable and effortless to customize. Our shoppers love reading genuine customer feedback right on the checkout page.",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    websiteUrl: "https://nordicgoods.example.com",
  },
];

export const DEFAULT_TESTIMONIAL_CONFIG: TestimonialSliderConfig = {
  designId: "modern-cards",
  title: "What Our Customers Say",
  description: "Real stories and verified experiences from teams around the world.",
  testimonials: SAMPLE_TESTIMONIALS,
  autoplay: true,
  autoplayInterval: 5,
  showArrows: true,
  showDots: true,
  desktopColumns: 2,
  showPhotos: true,
  showRatings: true,
  showDesignation: true,
  showCompany: true,
};

/**
 * Migration helper to ensure backwards compatibility with older configurations
 * or raw JSON objects loaded from localStorage / API.
 */
export function migrateTestimonialConfig(raw: any): TestimonialSliderConfig {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_TESTIMONIAL_CONFIG };
  }

  const r = raw;

  // Check if items were previously formatted as pipe-separated text (Emma R. | Quote)
  let migratedItems: TestimonialItem[] = [];
  if (Array.isArray(r.testimonials)) {
    migratedItems = r.testimonials as TestimonialItem[];
  } else if (typeof r.items === "string" && r.items.trim()) {
    const itemsStr = String(r.items || "");
    migratedItems = itemsStr
      .split("\n")
      .map((line: string, idx: number) => {
        const parts = line.split("|").map((p: string) => p.trim());
        const name = parts[0] || `Customer ${idx + 1}`;
        const review = parts[1] || "";
        return {
          id: `migrated-${idx + 1}`,
          name,
          review,
          rating: 5,
        };
      })
      .filter((item: TestimonialItem) => item.review.length > 0);
  }

  if (migratedItems.length === 0) {
    migratedItems = SAMPLE_TESTIMONIALS;
  }

  const validDesignIds: TestimonialDesignId[] = [
    "modern-cards",
    "minimal",
    "elegant",
    "dark",
    "quote-focus",
    "compact",
  ];

  const designId: TestimonialDesignId =
    typeof r.designId === "string" && validDesignIds.includes(r.designId as TestimonialDesignId)
      ? (r.designId as TestimonialDesignId)
      : "modern-cards";

  return {
    designId,
    title: typeof r.title === "string" && r.title.trim() ? r.title : DEFAULT_TESTIMONIAL_CONFIG.title,
    description: typeof r.description === "string" ? r.description : DEFAULT_TESTIMONIAL_CONFIG.description,
    testimonials: migratedItems,
    autoplay: typeof r.autoplay === "boolean" ? r.autoplay : DEFAULT_TESTIMONIAL_CONFIG.autoplay,
    autoplayInterval:
      typeof r.autoplayInterval === "number" && r.autoplayInterval >= 2 && r.autoplayInterval <= 30
        ? r.autoplayInterval
        : DEFAULT_TESTIMONIAL_CONFIG.autoplayInterval,
    showArrows: typeof r.showArrows === "boolean" ? r.showArrows : DEFAULT_TESTIMONIAL_CONFIG.showArrows,
    showDots: typeof r.showDots === "boolean" ? r.showDots : DEFAULT_TESTIMONIAL_CONFIG.showDots,
    desktopColumns:
      typeof r.desktopColumns === "number" && [1, 2, 3].includes(r.desktopColumns)
        ? r.desktopColumns
        : DEFAULT_TESTIMONIAL_CONFIG.desktopColumns,
    showPhotos: typeof r.showPhotos === "boolean" ? r.showPhotos : DEFAULT_TESTIMONIAL_CONFIG.showPhotos,
    showRatings: typeof r.showRatings === "boolean" ? r.showRatings : DEFAULT_TESTIMONIAL_CONFIG.showRatings,
    showDesignation:
      typeof r.showDesignation === "boolean" ? r.showDesignation : DEFAULT_TESTIMONIAL_CONFIG.showDesignation,
    showCompany: typeof r.showCompany === "boolean" ? r.showCompany : DEFAULT_TESTIMONIAL_CONFIG.showCompany,
  };
}
