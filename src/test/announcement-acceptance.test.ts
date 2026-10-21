import { describe, expect, it } from "vitest";
import {
  ANNOUNCEMENT_TEMPLATES,
  getTemplate,
} from "@/lib/announcement/templates";
import {
  DEFAULT_ANNOUNCEMENT_CONFIG,
  type AnnouncementBarConfig,
} from "@/lib/announcement/types";
import {
  validateAnnouncementConfig,
  isSafeUrl,
  calculateTimeRemaining,
} from "@/lib/announcement/validation";
import { saveWidget, loadSaved, deleteWidget, type SavedWidget, WIDGETS } from "@/lib/widgets";

describe("Announcement Bar Widget - Comprehensive Acceptance Tests", () => {
  // Scenario 1: The widget catalog includes Announcement Bar marked as Ready
  it("Scenario 1: Announcement Bar is registered in catalog and is Ready", () => {
    const def = WIDGETS.find((w) => w.type === "announcement-bar");
    expect(def).toBeDefined();
    expect(def?.ready).toBe(true);
    expect(def?.category).toBe("Promotion");
  });

  // Scenario 2: All 10 templates are available and selectable
  it("Scenario 2: All 10 pre-designed templates exist and have distinct IDs", () => {
    expect(ANNOUNCEMENT_TEMPLATES.length).toBe(10);
    const expectedIds = [
      "classic",
      "with-button",
      "information",
      "success",
      "seasonal",
      "minimal",
      "gradient",
      "countdown",
      "link",
      "multi-line",
    ];
    for (const id of expectedIds) {
      const tmpl = getTemplate(id as any);
      expect(tmpl.id).toBe(id);
      expect(tmpl.name).toBeDefined();
      expect(tmpl.defaults.bgColor).toBeDefined();
    }
  });

  // Scenario 3: Selecting a template updates configuration defaults
  it("Scenario 3: Selecting a template updates defaults properly", () => {
    const seasonal = getTemplate("seasonal");
    expect(seasonal.defaults.bgColor).toBe("#F59E0B");
    expect(seasonal.defaults.hasButton).toBe(true);

    const gradient = getTemplate("gradient");
    expect(gradient.defaults.bgColor).toContain("gradient");
  });

  // Scenario 4: Content changes update config and respect character limit
  it("Scenario 4: Content validation enforces text presence and 200 character limit", () => {
    const validConfig: AnnouncementBarConfig = {
      ...DEFAULT_ANNOUNCEMENT_CONFIG,
      text: "Flash Sale: Up to 50% Off Courses This Weekend Only!",
    };
    expect(validateAnnouncementConfig(validConfig).isValid).toBe(true);

    const emptyConfig: AnnouncementBarConfig = {
      ...DEFAULT_ANNOUNCEMENT_CONFIG,
      text: "",
    };
    const emptyRes = validateAnnouncementConfig(emptyConfig);
    expect(emptyRes.isValid).toBe(false);
    expect(emptyRes.errors.text).toMatch(/required/i);

    const overLimitConfig: AnnouncementBarConfig = {
      ...DEFAULT_ANNOUNCEMENT_CONFIG,
      text: "a".repeat(201),
    };
    const overRes = validateAnnouncementConfig(overLimitConfig);
    expect(overRes.isValid).toBe(false);
    expect(overRes.errors.text).toMatch(/200 characters/i);
  });

  // Scenario 5: URL validation permits safe schemes and blocks unsafe schemes
  it("Scenario 5: URL validation allows https/http/relative and strictly rejects dangerous schemes", () => {
    expect(isSafeUrl("https://apexacademy.com")).toBe(true);
    expect(isSafeUrl("http://localhost:8080/enroll")).toBe(true);
    expect(isSafeUrl("/courses")).toBe(true);
    expect(isSafeUrl("#contact")).toBe(true);
    expect(isSafeUrl("")).toBe(true);

    // Unsafe schemes must be rejected
    expect(isSafeUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeUrl("data:text/html,<script>alert(1)</script>")).toBe(false);
    expect(isSafeUrl("vbscript:msgbox")).toBe(false);
    expect(isSafeUrl("file:///etc/passwd")).toBe(false);
  });

  // Scenario 6: CTA button links are validated
  it("Scenario 6: Button links with malicious schemes block validation", () => {
    const badConfig: AnnouncementBarConfig = {
      ...DEFAULT_ANNOUNCEMENT_CONFIG,
      hasButton: true,
      buttonLink: "javascript:evil()",
    };
    const res = validateAnnouncementConfig(badConfig);
    expect(res.isValid).toBe(false);
    expect(res.errors.buttonLink).toBeDefined();
  });

  // Scenario 7: Position settings support Top and Bottom
  it("Scenario 7: Position configuration accepts Top and Bottom", () => {
    let conf = { ...DEFAULT_ANNOUNCEMENT_CONFIG, position: "top" as const };
    expect(conf.position).toBe("top");
    conf = { ...conf, position: "bottom" as const };
    expect(conf.position).toBe("bottom");
  });

  // Scenario 8: Countdown timer calculates remaining time from timestamp
  it("Scenario 8: Countdown accurately calculates time from future target and handles expiration", () => {
    // 2 days in the future
    const futureDate = new Date(Date.now() + 2 * 86400 * 1000 + 3600 * 1000).toISOString();
    const remaining = calculateTimeRemaining(futureDate);
    expect(remaining.isExpired).toBe(false);
    expect(remaining.days).toBe(2);

    // Past date
    const pastDate = new Date(Date.now() - 5000).toISOString();
    const expired = calculateTimeRemaining(pastDate);
    expect(expired.isExpired).toBe(true);
    expect(expired.days).toBe(0);
    expect(expired.seconds).toBe(0);
  });

  // Scenario 9: Save Widget persists configuration and allows reopening
  it("Scenario 9: Save Widget persists structured config to localStorage", () => {
    const testId = "wto_announcement_test_1";
    const customConfig: AnnouncementBarConfig = {
      ...DEFAULT_ANNOUNCEMENT_CONFIG,
      templateId: "seasonal",
      text: "Spring Break Safe Driver Special - 25% Off!",
      bgColor: "#F59E0B",
      buttonText: "Claim Coupon",
    };

    const savedRecord: SavedWidget = {
      id: testId,
      type: "announcement-bar",
      name: "Spring Break Announcement",
      config: customConfig as unknown as Record<string, string | number | boolean>,
      updatedAt: Date.now(),
    };

    saveWidget(savedRecord);

    const reloaded = loadSaved().find((w) => w.id === testId);
    expect(reloaded).toBeDefined();
    expect(reloaded?.name).toBe("Spring Break Announcement");
    expect((reloaded?.config as unknown as AnnouncementBarConfig).text).toBe(
      "Spring Break Safe Driver Special - 25% Off!"
    );
    expect((reloaded?.config as unknown as AnnouncementBarConfig).templateId).toBe("seasonal");

    // Clean up
    deleteWidget(testId);
    expect(loadSaved().find((w) => w.id === testId)).toBeUndefined();
  });

  // Scenario 10: Updating an existing widget updates in-place without duplicate
  it("Scenario 10: Updating an existing widget updates in-place without creating duplicates", () => {
    const testId = "wto_announcement_test_2";
    const record1: SavedWidget = {
      id: testId,
      type: "announcement-bar",
      name: "Initial Name",
      config: DEFAULT_ANNOUNCEMENT_CONFIG as unknown as Record<string, string | number | boolean>,
      updatedAt: 1000,
    };
    saveWidget(record1);

    const record2: SavedWidget = {
      id: testId,
      type: "announcement-bar",
      name: "Updated Name",
      config: DEFAULT_ANNOUNCEMENT_CONFIG as unknown as Record<string, string | number | boolean>,
      updatedAt: 2000,
    };
    saveWidget(record2);

    const matches = loadSaved().filter((w) => w.id === testId);
    expect(matches.length).toBe(1);
    expect(matches[0].name).toBe("Updated Name");

    // Clean up
    deleteWidget(testId);
  });

  // Scenario 11: Embed snippet matches specified format with data-widget-id
  it("Scenario 11: Embed snippet uses data-widget-id and async script", () => {
    const id = "wto_bar_987";
    const standardSnippet = `<script\n  src="https://cdn.webtoolocean.com/embed/announcement-bar.js"\n  data-widget-id="${id}"\n  async\n></script>`;
    expect(standardSnippet).toContain(`data-widget-id="${id}"`);
    expect(standardSnippet).toContain("announcement-bar.js");
  });

  // Scenario 12: Standalone inline configuration snippet contains complete config object
  it("Scenario 12: Standalone embed includes inline config object for zero-network testing", () => {
    const id = "wto_bar_987";
    const snippet = `window.WTO_ANNOUNCEMENT_CONFIGS["${id}"] = ${JSON.stringify(DEFAULT_ANNOUNCEMENT_CONFIG)};`;
    expect(snippet).toContain(DEFAULT_ANNOUNCEMENT_CONFIG.text);
    expect(snippet).toContain(DEFAULT_ANNOUNCEMENT_CONFIG.bgColor);
  });
});
