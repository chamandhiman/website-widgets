import { describe, expect, it } from "vitest";
import { WIDGETS, SCHEMAS, saveWidget, loadSaved, deleteWidget } from "@/lib/widgets";
import {
  LOGO_DESIGNS,
  DEFAULT_LOGO_CAROUSEL_CONFIG,
  SAMPLE_LOGOS,
  migrateLogoCarouselConfig,
  type LogoItem,
} from "@/lib/logo-carousel/types";
import {
  isSafeUrl,
  getLogoPages,
  getLogoFallbackSvg,
} from "@/lib/logo-carousel/logoCarouselUtils";
import { getWidgetScriptUrl, getWidgetScriptFileName } from "@/lib/embed";

describe("Logo Carousel - Configuration & Logic Tests", () => {
  it("Criterion 1: Logo Carousel is registered in WIDGETS catalog with ready: true", () => {
    const def = WIDGETS.find((w) => w.type === "logo-carousel");
    expect(def).toBeDefined();
    expect(def?.name).toBe("Logo Carousel");
    expect(def?.ready).toBe(true);
    expect(def?.kind).toBe("page");
    expect(def?.description).toContain("Display client logos");
  });

  it("Criterion 2: SCHEMAS contains logo-carousel with default values", () => {
    const schema = SCHEMAS["logo-carousel"];
    expect(schema).toBeDefined();
    expect(schema?.defaults["title"]).toBeDefined();
    expect(schema?.defaults["autoplay"]).toBe(true);
    expect(schema?.defaults["designId"]).toBe("classic");
  });

  it("Criterion 3: All 8 distinct design templates are defined with numbers, names, subtitles, and badges", () => {
    expect(LOGO_DESIGNS.length).toBe(8);
    const expectedIds = [
      "classic",
      "trusted-by",
      "infinite-marquee",
      "grayscale-color",
      "logo-grid",
      "premium-cards",
      "dark-showcase",
      "compact-strip",
    ];

    expectedIds.forEach((id) => {
      const design = LOGO_DESIGNS.find((d) => d.id === id);
      expect(design).toBeDefined();
      expect(design?.name).toBeDefined();
      expect(design?.subtitle).toBeDefined();
      expect(design?.badge).toBeDefined();
    });

    const gridDesign = LOGO_DESIGNS.find((d) => d.id === "logo-grid");
    expect(gridDesign?.isGrid).toBe(true);
  });

  it("Criterion 4: migrateLogoCarouselConfig handles empty or corrupted data safely", () => {
    const emptyMigrated = migrateLogoCarouselConfig(null);
    expect(emptyMigrated.designId).toBe("classic");
    expect(emptyMigrated.logos.length).toBeGreaterThan(0);
    expect(emptyMigrated.autoplay).toBe(true);
    expect(emptyMigrated.visibleLogosDesktop).toBe(5);

    const customMigrated = migrateLogoCarouselConfig({
      designId: "infinite-marquee",
      title: "Custom Trusted Brands",
      visibleLogosDesktop: 15, // Out of bounds, should clamp to 8
      gap: 5, // Out of bounds, should clamp to 8
      speed: 8,
      logos: [
        { id: "custom-1", name: "Custom Partner", imageUrl: "https://example.com/logo.png" },
      ],
    });

    expect(customMigrated.designId).toBe("infinite-marquee");
    expect(customMigrated.title).toBe("Custom Trusted Brands");
    expect(customMigrated.visibleLogosDesktop).toBe(8);
    expect(customMigrated.gap).toBe(8);
    expect(customMigrated.logos.length).toBe(1);
    expect(customMigrated.logos[0]?.name).toBe("Custom Partner");
  });

  it("Criterion 5: getLogoPages correctly divides active logos into pages and excludes disabled ones", () => {
    const testLogos: LogoItem[] = [
      { id: "1", name: "A", imageUrl: "", enabled: true },
      { id: "2", name: "B", imageUrl: "", enabled: false }, // Disabled
      { id: "3", name: "C", imageUrl: "", enabled: true },
      { id: "4", name: "D", imageUrl: "", enabled: true },
      { id: "5", name: "E", imageUrl: "", enabled: true },
    ];

    const pages = getLogoPages(testLogos, 2);
    expect(pages.length).toBe(2);
    expect(pages[0]?.length).toBe(2);
    expect(pages[0]?.[0]?.name).toBe("A");
    expect(pages[0]?.[1]?.name).toBe("C"); // B was skipped
    expect(pages[1]?.length).toBe(2);
    expect(pages[1]?.[0]?.name).toBe("D");
    expect(pages[1]?.[1]?.name).toBe("E");
  });

  it("Criterion 6: isSafeUrl correctly filters unsafe protocols and permits safe URLs", () => {
    expect(isSafeUrl("https://example.com")).toBe(true);
    expect(isSafeUrl("http://company.org/partners")).toBe(true);
    expect(isSafeUrl("mailto:partners@example.com")).toBe(true);
    expect(isSafeUrl("tel:+123456789")).toBe(true);
    expect(isSafeUrl("#")).toBe(true);
    expect(isSafeUrl("")).toBe(true);

    expect(isSafeUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeUrl("data:text/html;base64,...")).toBe(false);
    expect(isSafeUrl("vbscript:msgbox")).toBe(false);
  });

  it("Criterion 7: getLogoFallbackSvg generates valid resolution-independent SVG data URL", () => {
    const svgUrl = getLogoFallbackSvg("Apex Cloud");
    expect(svgUrl).toContain("data:image/svg+xml");
    expect(svgUrl).toContain("AC"); // Initials
    expect(svgUrl).toContain("Apex%20Cloud");
  });

  it("Criterion 8: Script filename and CDN embed URL match standard specification", () => {
    expect(getWidgetScriptFileName("logo-carousel")).toBe("logo-carousel.js");
    expect(getWidgetScriptUrl("logo-carousel")).toBe(
      "https://cdn.widgets.webtoolocean.com/embed/logo-carousel.js"
    );
  });

  it("Criterion 9: Widget saves and reloads from storage accurately", () => {
    const testId = `test_logo_${Date.now()}`;
    const testConfig = {
      ...DEFAULT_LOGO_CAROUSEL_CONFIG,
      title: "Storage Test Showcase",
      designId: "premium-cards" as const,
    };

    saveWidget({
      id: testId,
      type: "logo-carousel",
      name: "My Logo Carousel",
      config: testConfig as any,
      updatedAt: Date.now(),
    });

    const loaded = loadSaved().find((w) => w.id === testId);
    expect(loaded).toBeDefined();
    expect(loaded?.name).toBe("My Logo Carousel");
    expect(loaded?.config["title"]).toBe("Storage Test Showcase");
    expect(loaded?.config["designId"]).toBe("premium-cards");

    deleteWidget(testId);
    const afterDelete = loadSaved().find((w) => w.id === testId);
    expect(afterDelete).toBeUndefined();
  });
});
