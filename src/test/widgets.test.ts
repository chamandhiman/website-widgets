import { describe, expect, it } from "vitest";
import { WIDGETS, SCHEMAS, filterWidgets } from "@/lib/widgets";

describe("widget catalog", () => {
  it("only marks widgets with an editor as Ready", () => {
    for (const w of WIDGETS) expect(w.ready).toBe(Boolean(SCHEMAS[w.type]));
  });
  it("prioritizes WhatsApp Chat, Announcement Bar, and Popup Widget at the top", () => {
    expect(WIDGETS[0].type).toBe("whatsapp-chat");
    expect(WIDGETS[1].type).toBe("announcement-bar");
    expect(WIDGETS[2].type).toBe("popup");
    expect(WIDGETS[3].type).toBe("google-reviews");
    expect(WIDGETS.length).toBe(17);
  });

  it("filters by category and search while preserving priority", () => {
    expect(filterWidgets(WIDGETS, "", "Chat").map((w) => w.type)).toEqual(["whatsapp-chat"]);
    expect(filterWidgets(WIDGETS, "youtube", "All").map((w) => w.type)).toEqual(["youtube-gallery"]);

    const allFiltered = filterWidgets(WIDGETS, "", "All");
    expect(allFiltered[0].type).toBe("whatsapp-chat");
    expect(allFiltered[1].type).toBe("announcement-bar");
    expect(allFiltered[2].type).toBe("popup");
  });
});
