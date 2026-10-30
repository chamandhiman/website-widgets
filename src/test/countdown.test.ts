import { describe, it, expect } from "vitest";
import {
  parseCountdownTarget,
  calculateCountdownRemaining,
} from "@/lib/countdown/countdownUtils";
import {
  getWidgetScriptFileName,
  getWidgetScriptUrl,
  getStandardEmbedSnippet,
  getStandaloneEmbedSnippet,
} from "@/lib/embed";
import { SCHEMAS, WIDGETS } from "@/lib/widgets";

describe("Countdown Timer Widget Acceptance & Functionality", () => {
  describe("Target Parsing & Timezone", () => {
    it("parses standard datetime-local string in local timezone", () => {
      const parsed = parseCountdownTarget("2027-12-31T23:59", "Local");
      expect(isNaN(parsed)).toBe(false);
      expect(parsed).toBeGreaterThan(Date.now());
    });

    it("parses backward-compatible date-only string (e.g. 2026-12-31) as end of day", () => {
      const parsed = parseCountdownTarget("2026-12-31", "Local");
      expect(isNaN(parsed)).toBe(false);
      const d = new Date(parsed);
      expect(d.getHours()).toBe(23);
      expect(d.getMinutes()).toBe(59);
    });

    it("handles UTC timezone correctly", () => {
      const parsedUtc = parseCountdownTarget("2027-12-31T23:59", "UTC");
      expect(isNaN(parsedUtc)).toBe(false);
      const expectedUtc = Date.parse("2027-12-31T23:59Z");
      expect(parsedUtc).toBe(expectedUtc);
    });

    it("handles invalid or empty dates gracefully", () => {
      expect(isNaN(parseCountdownTarget(""))).toBe(true);
      expect(isNaN(parseCountdownTarget(null))).toBe(true);
      expect(isNaN(parseCountdownTarget("invalid-date-string"))).toBe(true);
    });
  });

  describe("Time Remaining Calculation", () => {
    it("accurately calculates remaining Days, Hours, Minutes, Seconds", () => {
      const now = 1700000000000;
      // 2 days, 3 hours, 4 minutes, 5 seconds in future
      const target =
        now +
        2 * 86400 * 1000 +
        3 * 3600 * 1000 +
        4 * 60 * 1000 +
        5 * 1000;

      const remaining = calculateCountdownRemaining(target, now);
      expect(remaining.isExpired).toBe(false);
      expect(remaining.isValid).toBe(true);
      expect(remaining.days).toBe(2);
      expect(remaining.hours).toBe(3);
      expect(remaining.minutes).toBe(4);
      expect(remaining.seconds).toBe(5);
    });

    it("stops at zero and marks expired when target is reached or in past", () => {
      const now = 1700000000000;
      const pastTarget = now - 10000;

      const remaining = calculateCountdownRemaining(pastTarget, now);
      expect(remaining.isExpired).toBe(true);
      expect(remaining.isValid).toBe(true);
      expect(remaining.days).toBe(0);
      expect(remaining.hours).toBe(0);
      expect(remaining.minutes).toBe(0);
      expect(remaining.seconds).toBe(0);
    });

    it("handles invalid target timestamp gracefully", () => {
      const remaining = calculateCountdownRemaining(NaN);
      expect(remaining.isExpired).toBe(true);
      expect(remaining.isValid).toBe(false);
      expect(remaining.days).toBe(0);
    });
  });

  describe("Widget Registry & Schema Compatibility", () => {
    it("countdown exists as a single option in WIDGETS gallery", () => {
      const countdowns = WIDGETS.filter((w) => w.type === "countdown");
      expect(countdowns.length).toBe(1);
      expect(countdowns[0].ready).toBe(true);
      expect(countdowns[0].name).toBe("Countdown Timer");
    });

    it("countdown schema includes essential settings and maintains backward compatibility", () => {
      const schema = SCHEMAS["countdown"];
      expect(schema).toBeDefined();

      const fieldKeys = schema.fields.map((f) => f.key);
      expect(fieldKeys).toContain("title");
      expect(fieldKeys).toContain("target");
      expect(fieldKeys).toContain("timezone");
      expect(fieldKeys).toContain("expiryMessage");
      expect(fieldKeys).toContain("style");
      expect(fieldKeys).toContain("showDays");
      expect(fieldKeys).toContain("showHours");
      expect(fieldKeys).toContain("showMinutes");
      expect(fieldKeys).toContain("showSeconds");

      // Verify defaults
      expect(schema.defaults.title).toBeDefined();
      expect(schema.defaults.target).toBeDefined();
      expect(schema.defaults.expiryMessage).toBe("Offer has ended.");
      expect(schema.defaults.showDays).toBe(true);
      expect(schema.defaults.showSeconds).toBe(true);
    });
  });

  describe("Embed Generation", () => {
    it("maps countdown to countdown.js in CDN URL", () => {
      const fileName = getWidgetScriptFileName("countdown");
      expect(fileName).toBe("countdown.js");

      const scriptUrl = getWidgetScriptUrl("countdown");
      expect(scriptUrl).toBe("https://cdn.widgets.webtoolocean.com/embed/countdown.js");
    });

    it("generates standard script embed snippet", () => {
      const snippet = getStandardEmbedSnippet({
        widgetType: "countdown",
        widgetId: "test_cd_123",
      });
      expect(snippet).toContain("https://cdn.widgets.webtoolocean.com/embed/countdown.js");
      expect(snippet).toContain('data-widget-id="test_cd_123"');
    });

    it("generates standalone embed snippet with window.WTO_COUNTDOWN_CONFIGS", () => {
      const snippet = getStandaloneEmbedSnippet({
        widgetType: "countdown",
        widgetId: "test_cd_123",
        config: { title: "Flash Sale", target: "2027-12-31T23:59" },
      });
      expect(snippet).toContain("window.WTO_COUNTDOWN_CONFIGS");
      expect(snippet).toContain('"title": "Flash Sale"');
      expect(snippet).toContain("https://cdn.widgets.webtoolocean.com/embed/countdown.js");
    });
  });

  describe("Config Migration & Designs", () => {
    it("migrates older partial saved config with complete defaults", async () => {
      const { migrateCountdownConfig, COUNTDOWN_DESIGNS } = await import("@/lib/countdown/types");
      const migrated = migrateCountdownConfig({
        title: "Old Sale",
        target: "2026-12-31",
      });
      expect(migrated.title).toBe("Old Sale");
      expect(migrated.target).toBe("2026-12-31");
      expect(migrated.showDays).toBe(true);
      expect(migrated.showSeconds).toBe(true);
      expect(migrated.expiryMessage).toBe("This offer has ended.");
      expect(migrated.designId).toBe("cards");

      // Verify all 6 designs exist with unique IDs
      expect(COUNTDOWN_DESIGNS.length).toBe(6);
      const designIds = COUNTDOWN_DESIGNS.map((d) => d.id);
      expect(designIds).toEqual(["cards", "minimal", "circular", "flip", "banner", "elegant"]);
    });
  });
});
