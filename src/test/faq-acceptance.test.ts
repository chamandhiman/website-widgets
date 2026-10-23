import { describe, expect, it } from "vitest";
import {
  DEFAULT_FAQ_CONFIG,
  DEFAULT_FAQ_ITEMS,
  migrateFaqConfig,
} from "@/lib/faq/types";
import { FAQ_TEMPLATES } from "@/lib/faq/templates";
import { validateFaqConfig } from "@/lib/faq/validation";

describe("FAQ Widget Acceptance Tests", () => {
  it("provides sensible default configuration with 6 realistic items", () => {
    expect(DEFAULT_FAQ_CONFIG.version).toBe(2);
    expect(DEFAULT_FAQ_CONFIG.template).toBe("classic");
    expect(DEFAULT_FAQ_CONFIG.items.length).toBe(6);
    expect(DEFAULT_FAQ_CONFIG.categories.length).toBeGreaterThanOrEqual(4);
    expect(DEFAULT_FAQ_CONFIG.heading).toBe("Frequently Asked Questions");
    expect(DEFAULT_FAQ_CONFIG.showHeading).toBe(true);
  });

  it("contains all 10 visually distinct templates with unique IDs", () => {
    expect(FAQ_TEMPLATES.length).toBe(10);

    const expectedIds = [
      "classic",
      "minimal",
      "card",
      "bordered",
      "two-column",
      "help-center",
      "category-based",
      "compact",
      "highlighted",
      "dark",
    ];

    const actualIds = FAQ_TEMPLATES.map((t) => t.id);
    expect(actualIds).toEqual(expectedIds);

    // Each template has unique number 1 to 10
    const numbers = FAQ_TEMPLATES.map((t) => t.number);
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    // Check distinct properties (e.g. two-column has columns: 2, dark has dark background, help-center has search)
    const twoCol = FAQ_TEMPLATES.find((t) => t.id === "two-column");
    expect(twoCol?.defaults.columns).toBe(2);

    const dark = FAQ_TEMPLATES.find((t) => t.id === "dark");
    expect(dark?.defaults.bgColor).toBe("#0f172a");

    const helpCenter = FAQ_TEMPLATES.find((t) => t.id === "help-center");
    expect(helpCenter?.defaults.enableSearch).toBe(true);

    const categoryBased = FAQ_TEMPLATES.find((t) => t.id === "category-based");
    expect(categoryBased?.defaults.showCategoryFilters).toBe(true);
  });

  describe("Validation", () => {
    it("validates that default configuration is fully valid", () => {
      const res = validateFaqConfig(DEFAULT_FAQ_CONFIG);
      expect(res.isValid).toBe(true);
      expect(Object.keys(res.errors).length).toBe(0);
    });

    it("rejects configurations with empty questions or answers", () => {
      const invalidConfig = {
        ...DEFAULT_FAQ_CONFIG,
        items: [
          { id: "1", question: "", answer: "Some answer" },
          { id: "2", question: "Valid question?", answer: "   " },
        ],
      };

      const res = validateFaqConfig(invalidConfig);
      expect(res.isValid).toBe(false);
      expect(res.errors["item_1_question"]).toBeDefined();
      expect(res.errors["item_2_answer"]).toBeDefined();
    });

    it("rejects configurations with no items", () => {
      const noItemsConfig = {
        ...DEFAULT_FAQ_CONFIG,
        items: [],
      };

      const res = validateFaqConfig(noItemsConfig);
      expect(res.isValid).toBe(false);
      expect(res.errors["items"]).toBeDefined();
    });

    it("rejects empty heading when showHeading is true", () => {
      const res = validateFaqConfig({
        ...DEFAULT_FAQ_CONFIG,
        showHeading: true,
        heading: "   ",
      });
      expect(res.isValid).toBe(false);
      expect(res.errors["heading"]).toBeDefined();
    });
  });

  describe("Migration & Backward Compatibility", () => {
    it("gracefully handles undefined and null", () => {
      const migrated = migrateFaqConfig(undefined);
      expect(migrated.template).toBe("classic");
      expect(migrated.items.length).toBe(6);
    });

    it("migrates legacy string-based items (Q | A)", () => {
      const legacyRaw = {
        title: "Legacy Store FAQ",
        items: "Where is my order? | You can track it online.\nCan I change address? | Only within 2 hours.",
        openFirst: false,
      };

      const migrated = migrateFaqConfig(legacyRaw);
      expect(migrated.heading).toBe("Legacy Store FAQ");
      expect(migrated.items.length).toBe(2);
      expect(migrated.items[0]?.question).toBe("Where is my order?");
      expect(migrated.items[0]?.answer).toBe("You can track it online.");
      expect(migrated.items[1]?.question).toBe("Can I change address?");
      expect(migrated.items[1]?.answer).toBe("Only within 2 hours.");
      expect(migrated.openFirstByDefault).toBe(false);
    });

    it("preserves modern structured items when already present", () => {
      const structuredRaw = {
        template: "card" as const,
        heading: "VIP Questions",
        items: [
          { id: "c_1", question: "What is VIP?", answer: "Exclusive perks.", category: "VIP", badge: "New" },
        ],
      };

      const migrated = migrateFaqConfig(structuredRaw);
      expect(migrated.template).toBe("card");
      expect(migrated.heading).toBe("VIP Questions");
      expect(migrated.items.length).toBe(1);
      expect(migrated.items[0]?.id).toBe("c_1");
      expect(migrated.items[0]?.badge).toBe("New");
    });
  });
});
