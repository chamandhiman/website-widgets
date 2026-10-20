import { describe, expect, it } from "vitest";
import { WIDGETS, SCHEMAS, filterWidgets } from "@/lib/widgets";

describe("widget catalog", () => {
  it("only marks widgets with an editor as Ready", () => {
    for (const w of WIDGETS) expect(w.ready).toBe(Boolean(SCHEMAS[w.type]));
  });
  it("filters by category and search", () => {
    expect(filterWidgets(WIDGETS, "", "Chat").map((w) => w.type)).toEqual(["whatsapp-chat"]);
    expect(filterWidgets(WIDGETS, "youtube", "All").map((w) => w.type)).toEqual(["youtube-gallery"]);
  });
});
