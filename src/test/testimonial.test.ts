import { describe, expect, it } from "vitest";
import {
  getInitials,
  normalizeRating,
  getReviewExcerpt,
  getTestimonialPages,
} from "@/lib/testimonial/testimonialUtils";
import {
  DEFAULT_TESTIMONIAL_CONFIG,
  SAMPLE_TESTIMONIALS,
  TESTIMONIAL_DESIGNS,
  migrateTestimonialConfig,
  type TestimonialItem,
} from "@/lib/testimonial/types";
import {
  getWidgetScriptFileName,
  getWidgetScriptUrl,
  getStandardEmbedSnippet,
} from "@/lib/embed";
import { getSchema } from "@/lib/widgets";

describe("Testimonial Slider Utilities & Models", () => {
  it("computes reviewer initials correctly", () => {
    expect(getInitials("Sophia Martinez")).toBe("SM");
    expect(getInitials("Alexander")).toBe("A");
    expect(getInitials("Emily Rose Chen")).toBe("EC");
    expect(getInitials("")).toBe("?");
    // @ts-expect-error test undefined
    expect(getInitials(undefined)).toBe("?");
  });

  it("normalizes and clamps star ratings", () => {
    expect(normalizeRating(5)).toBe(5);
    expect(normalizeRating(1)).toBe(1);
    expect(normalizeRating(6)).toBe(5);
    expect(normalizeRating(0)).toBe(1);
    expect(normalizeRating(-2)).toBe(1);
    expect(normalizeRating(4.3)).toBe(4);
    expect(normalizeRating(undefined)).toBe(5);
    expect(normalizeRating(NaN)).toBe(5);
  });

  it("generates review excerpts accurately", () => {
    expect(getReviewExcerpt("Short review", 50)).toBe("Short review");
    expect(getReviewExcerpt("This is a rather long review that needs to be truncated for preview", 20)).toBe(
      "This is a rather lon..."
    );
    expect(getReviewExcerpt("")).toBe("");
  });

  it("chunks testimonials into pages based on visible items per slide", () => {
    const items: TestimonialItem[] = [
      { id: "1", name: "A", review: "R1" },
      { id: "2", name: "B", review: "R2" },
      { id: "3", name: "C", review: "R3" },
      { id: "4", name: "D", review: "R4" },
      { id: "5", name: "E", review: "R5" },
    ];

    const pages1 = getTestimonialPages(items, 1);
    expect(pages1).toHaveLength(5);
    expect(pages1[0]).toHaveLength(1);

    const pages2 = getTestimonialPages(items, 2);
    expect(pages2).toHaveLength(3);
    expect(pages2[0]).toHaveLength(2);
    expect(pages2[2]).toHaveLength(1);

    const pages3 = getTestimonialPages(items, 3);
    expect(pages3).toHaveLength(2);
    expect(pages3[0]).toHaveLength(3);
    expect(pages3[1]).toHaveLength(2);
  });

  it("provides 6 genuinely different design definitions", () => {
    expect(TESTIMONIAL_DESIGNS).toHaveLength(6);
    const ids = TESTIMONIAL_DESIGNS.map((d) => d.id);
    expect(ids).toEqual([
      "modern-cards",
      "minimal",
      "elegant",
      "dark",
      "quote-focus",
      "compact",
    ]);
  });

  it("migrates empty or undefined configs to default", () => {
    const migrated = migrateTestimonialConfig(null);
    expect(migrated.designId).toBe("modern-cards");
    expect(migrated.title).toBe("What Our Customers Say");
    expect(migrated.testimonials.length).toBeGreaterThan(0);
    expect(migrated.autoplay).toBe(true);
  });

  it("migrates legacy pipe-separated quotes", () => {
    const legacy = {
      title: "Loved by thousands",
      items: "Alice M. | Outstanding service!\nBob K. | Highly recommended.",
    };
    const migrated = migrateTestimonialConfig(legacy);
    expect(migrated.title).toBe("Loved by thousands");
    expect(migrated.testimonials).toHaveLength(2);
    expect(migrated.testimonials[0].name).toBe("Alice M.");
    expect(migrated.testimonials[0].review).toBe("Outstanding service!");
    expect(migrated.testimonials[1].name).toBe("Bob K.");
    expect(migrated.testimonials[1].review).toBe("Highly recommended.");
  });

  it("preserves modern testimonials and settings on migration", () => {
    const custom = {
      designId: "elegant",
      title: "Client Acclaim",
      description: "Handcrafted reviews",
      testimonials: [
        {
          id: "c1",
          name: "Diana Prince",
          review: "Impeccable quality.",
          rating: 5,
        },
      ],
      autoplay: false,
      autoplayInterval: 8,
      desktopColumns: 3,
      showPhotos: false,
    };
    const migrated = migrateTestimonialConfig(custom);
    expect(migrated.designId).toBe("elegant");
    expect(migrated.title).toBe("Client Acclaim");
    expect(migrated.description).toBe("Handcrafted reviews");
    expect(migrated.testimonials).toHaveLength(1);
    expect(migrated.testimonials[0].name).toBe("Diana Prince");
    expect(migrated.autoplay).toBe(false);
    expect(migrated.autoplayInterval).toBe(8);
    expect(migrated.desktopColumns).toBe(3);
    expect(migrated.showPhotos).toBe(false);
  });
});

describe("Testimonial Slider Embed & Schema Registration", () => {
  it("resolves the correct script filename and CDN url", () => {
    expect(getWidgetScriptFileName("testimonial-slider")).toBe("testimonial-slider.js");
    expect(getWidgetScriptFileName("testimonials")).toBe("testimonial-slider.js");

    const url = getWidgetScriptUrl("testimonial-slider");
    expect(url).toBe("https://cdn.widgets.webtoolocean.com/embed/testimonial-slider.js");
  });

  it("generates the standard production embed snippet", () => {
    const snippet = getStandardEmbedSnippet({
      widgetType: "testimonial-slider",
      widgetId: "t_test_123",
    });
    expect(snippet).toContain("https://cdn.widgets.webtoolocean.com/embed/testimonial-slider.js");
    expect(snippet).toContain('data-widget-id="t_test_123"');
    expect(snippet).toContain("async");
  });

  it("registers testimonial-slider in widget schema", () => {
    const schema = getSchema("testimonial-slider");
    expect(schema).not.toBeNull();
    expect(schema?.def.name).toBe("Testimonial Slider");
    expect(schema?.def.ready).toBe(true);
    expect(schema?.def.category).toBe("Reviews");
    expect(schema?.defaults.title).toBe("What Our Customers Say");
  });
});
