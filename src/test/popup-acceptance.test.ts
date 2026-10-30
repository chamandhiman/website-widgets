import { describe, expect, it } from "vitest";
import { POPUP_TEMPLATES } from "@/lib/popup/templates";
import {
  DEFAULT_POPUP_CONFIG,
  type PopupWidgetConfig,
  type PopupType,
} from "@/lib/popup/types";
import {
  validatePopupConfig,
  isSafeUrl,
  parseVideoUrl,
} from "@/lib/popup/validation";
import { saveWidget, loadSaved, deleteWidget, WIDGETS } from "@/lib/widgets";

describe("Popup Widget - Comprehensive Acceptance Tests", () => {
  // Criterion 1: Popup Widget is registered in catalog and is marked ready
  it("Criterion 1: Popup Widget is registered in catalog and ready is true", () => {
    const def = WIDGETS.find((w) => w.type === "popup");
    expect(def).toBeDefined();
    expect(def?.ready).toBe(true);
    expect(def?.name).toBe("Popup Widget");
    expect(def?.category).toBe("Promotion");
    expect(def?.kind).toBe("floating");
  });

  // Criterion 2: All 8 core popup designs plus specialized templates are defined
  it("Criterion 2: All 8 core popup designs plus specialized templates are defined with numbers, names and subtitles", () => {
    expect(POPUP_TEMPLATES.length).toBeGreaterThanOrEqual(8);
    const expectedTypes: PopupType[] = [
      "classic",
      "hero-image",
      "split",
      "discount",
      "minimal",
      "newsletter",
      "slide-in",
      "announcement",
    ];

    for (let i = 0; i < expectedTypes.length; i++) {
      const type = expectedTypes[i]!;
      const tmpl = POPUP_TEMPLATES.find((t) => t.id === type);
      expect(tmpl).toBeDefined();
      expect(tmpl?.number).toBe(i + 1);
      expect(tmpl?.name).toBeDefined();
      expect(tmpl?.subtitle).toBeDefined();
      expect(tmpl?.defaults.templateId).toBe(type);
    }
  });

  // Criterion 3 & 4: Each popup type has appropriate dimensions, position and layout defaults
  it("Criterion 3 & 4: Template defaults configure appropriate layouts and sizes", () => {
    const slideIn = POPUP_TEMPLATES.find((t) => t.id === "slide-in");
    expect(slideIn?.defaults.position).toBe("bottom-right");
    expect(slideIn?.defaults.size).toBe("small");
    expect(slideIn?.defaults.entryAnimation).toBe("slide-up");

    const split = POPUP_TEMPLATES.find((t) => t.id === "split");
    expect(split?.defaults.position).toBe("center");
    expect(split?.defaults.size).toBe("large");

    const classic = POPUP_TEMPLATES.find((t) => t.id === "classic");
    expect(classic?.defaults.position).toBe("center");
    expect(classic?.defaults.overlayStyle).toBe("dark");

    const ageGate = POPUP_TEMPLATES.find((t) => t.id === "age-verification");
    expect(ageGate?.defaults.showCloseButton).toBe(false);
    expect(ageGate?.defaults.ageQuestion).toBe("Are You 18 or Older?");
  });

  // Criterion 5 & 6: Validation checks title presence and character limits
  it("Criterion 5: Validates required title and length boundaries", () => {
    const emptyTitleConfig: PopupWidgetConfig = {
      ...DEFAULT_POPUP_CONFIG,
      title: "",
    };
    const res = validatePopupConfig(emptyTitleConfig);
    expect(res.isValid).toBe(false);
    expect(res.errors["title"]).toBeDefined();

    const tooLongTitle: PopupWidgetConfig = {
      ...DEFAULT_POPUP_CONFIG,
      title: "a".repeat(101),
    };
    const res2 = validatePopupConfig(tooLongTitle);
    expect(res2.isValid).toBe(false);
    expect(res2.errors["title"]).toContain("100 characters");
  });

  // Criterion 7: URL validation blocks unsafe protocols
  it("Criterion 7: URL validation rejects javascript: and data: exploits", () => {
    expect(isSafeUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeUrl("JAVASCRIPT:void(0)")).toBe(false);
    expect(isSafeUrl("data:text/html;base64,...")).toBe(false);

    expect(isSafeUrl("https://example.com")).toBe(true);
    expect(isSafeUrl("http://example.com/promo")).toBe(true);
    expect(isSafeUrl("mailto:support@example.com")).toBe(true);
    expect(isSafeUrl("tel:+1234567890")).toBe(true);
    expect(isSafeUrl("#")).toBe(true);
  });

  // Criterion 8: Video URL parser correctly handles YouTube, Vimeo and direct MP4
  it("Criterion 8: Video parser extracts embed URLs for YouTube and Vimeo", () => {
    const yt1 = parseVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(yt1.platform).toBe("youtube");
    expect(yt1.embedUrl).toContain("dQw4w9WgXcQ");

    const yt2 = parseVideoUrl("https://youtu.be/dQw4w9WgXcQ");
    expect(yt2.platform).toBe("youtube");
    expect(yt2.embedUrl).toContain("dQw4w9WgXcQ");

    const vimeo = parseVideoUrl("https://vimeo.com/76979871");
    expect(vimeo.platform).toBe("vimeo");
    expect(vimeo.embedUrl).toContain("76979871");

    const mp4 = parseVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
    expect(mp4.platform).toBe("mp4");
  });

  // Criterion 9: Custom HTML popup validation
  it("Criterion 9: Custom HTML allows markup and detects script warnings", () => {
    const customConfig: PopupWidgetConfig = {
      ...DEFAULT_POPUP_CONFIG,
      templateId: "custom-html",
      customHtmlContent: "<div>Hello world</div>",
    };
    const validRes = validatePopupConfig(customConfig);
    expect(validRes.isValid).toBe(true);

    const scriptConfig: PopupWidgetConfig = {
      ...DEFAULT_POPUP_CONFIG,
      templateId: "custom-html",
      customHtmlContent: "<div><script>alert(1)</script></div>",
    };
    const scriptRes = validatePopupConfig(scriptConfig);
    expect(scriptRes.warnings?.["customHtmlContent"]).toBeDefined();
  });

  // Criterion 10: Scheduling date boundaries
  it("Criterion 10: Scheduling validates start date is before end date", () => {
    const invalidSchedule: PopupWidgetConfig = {
      ...DEFAULT_POPUP_CONFIG,
      enableScheduling: true,
      startDate: "2026-12-31",
      endDate: "2026-01-01",
    };
    const res = validatePopupConfig(invalidSchedule);
    expect(res.isValid).toBe(false);
    expect(res.errors["schedule"]).toBeDefined();
  });

  // Criterion 11 & 12: Save and Publish persistence
  it("Criterion 11 & 12: Widget saves to storage and can be reloaded without duplicate ID", () => {
    const testId = "popup_test_" + Date.now();
    saveWidget({
      id: testId,
      type: "popup",
      name: "Black Friday Popup",
      config: { ...DEFAULT_POPUP_CONFIG, title: "Black Friday 50% Off" } as any,
      updatedAt: Date.now(),
    });

    const saved = loadSaved();
    const found = saved.find((w) => w.id === testId);
    expect(found).toBeDefined();
    expect(found?.name).toBe("Black Friday Popup");
    expect((found?.config as any)?.title).toBe("Black Friday 50% Off");

    // Clean up
    deleteWidget(testId);
    const afterDelete = loadSaved();
    expect(afterDelete.find((w) => w.id === testId)).toBeUndefined();
  });
});
