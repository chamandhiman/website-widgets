import { describe, it, expect } from "vitest";
import {
  formatCalendarDate,
  formatCalendarTime,
  formatTimeRange,
  getDateBadgeInfo,
  isEventUpcoming,
  getProcessedEvents,
  groupEventsByDate,
  generateMonthGrid,
} from "@/lib/calendar/calendarUtils";
import {
  migrateCalendarConfig,
  CALENDAR_DESIGNS,
  DEFAULT_EVENT_CALENDAR_CONFIG,
  type CalendarEvent,
} from "@/lib/calendar/types";
import {
  getWidgetScriptFileName,
  getWidgetScriptUrl,
  getStandardEmbedSnippet,
  CDN_BASE_DOMAIN,
} from "@/lib/embed";
import { WIDGETS } from "@/lib/widgets";

describe("Event Calendar Utility & Logic Suite", () => {
  const sampleEvents: CalendarEvent[] = [
    {
      id: "ev-1",
      title: "Conference A",
      date: "2027-04-15",
      startTime: "09:00",
      endTime: "17:00",
      location: "San Francisco",
    },
    {
      id: "ev-2",
      title: "Workshop B",
      date: "2027-04-20",
      startTime: "14:30",
      endTime: "16:00",
      location: "Online",
    },
    {
      id: "ev-old",
      title: "Past Meetup",
      date: "2025-01-01",
      startTime: "10:00",
      endTime: "12:00",
    },
  ];

  describe("Date & Time Formatting", () => {
    it("formats dates into MMM D, YYYY by default", () => {
      expect(formatCalendarDate("2027-04-15")).toBe("Apr 15, 2027");
      expect(formatCalendarDate("2027-12-05")).toBe("Dec 5, 2027");
    });

    it("supports MM/DD/YYYY, DD/MM/YYYY, and YYYY-MM-DD formats", () => {
      expect(formatCalendarDate("2027-04-15", "MM/DD/YYYY")).toBe("04/15/2027");
      expect(formatCalendarDate("2027-04-15", "DD/MM/YYYY")).toBe("15/04/2027");
      expect(formatCalendarDate("2027-04-15", "YYYY-MM-DD")).toBe("2027-04-15");
    });

    it("extracts badge info with day, month, and weekday", () => {
      const badge = getDateBadgeInfo("2027-04-15");
      expect(badge.day).toBe(15);
      expect(badge.monthShort).toBe("Apr");
      expect(badge.year).toBe(2027);
      expect(badge.weekday).toBe("Thursday");
    });

    it("formats 12-hour and 24-hour time correctly", () => {
      expect(formatCalendarTime("09:00", "12h")).toBe("9:00 AM");
      expect(formatCalendarTime("14:30", "12h")).toBe("2:30 PM");
      expect(formatCalendarTime("00:15", "12h")).toBe("12:15 AM");
      expect(formatCalendarTime("14:30", "24h")).toBe("14:30");
    });

    it("formats time range accurately", () => {
      expect(formatTimeRange("09:00", "17:00", "12h")).toBe("9:00 AM – 5:00 PM");
      expect(formatTimeRange("09:00", "17:00", "24h")).toBe("09:00 – 17:00");
      expect(formatTimeRange("10:00", "", "12h")).toBe("10:00 AM");
    });
  });

  describe("Event Filtering & Sorting", () => {
    const referenceDate = new Date("2026-06-01T00:00:00Z");

    it("identifies upcoming vs past events accurately", () => {
      expect(isEventUpcoming(sampleEvents[0], referenceDate)).toBe(true);
      expect(isEventUpcoming(sampleEvents[2], referenceDate)).toBe(false);
    });

    it("filters and sorts upcoming events chronologically", () => {
      const processed = getProcessedEvents(
        sampleEvents,
        { upcomingOnly: true, maxEvents: 10 },
        referenceDate
      );
      expect(processed.length).toBe(2);
      expect(processed[0].id).toBe("ev-1");
      expect(processed[1].id).toBe("ev-2");
    });

    it("respects maxEvents limit", () => {
      const processed = getProcessedEvents(
        sampleEvents,
        { upcomingOnly: false, maxEvents: 1 },
        referenceDate
      );
      expect(processed.length).toBe(1);
    });

    it("groups events by date for Agenda view", () => {
      const grouped = groupEventsByDate(sampleEvents);
      expect(grouped["2027-04-15"]).toBeDefined();
      expect(grouped["2027-04-15"].length).toBe(1);
    });
  });

  describe("Monthly Grid Generation", () => {
    it("generates correct weeks and day numbers for April 2027", () => {
      const grid = generateMonthGrid(2027, 3, sampleEvents); // April is index 3
      expect(grid.monthName).toBe("April");
      expect(grid.year).toBe(2027);
      expect(grid.weeks.length).toBeGreaterThanOrEqual(5);

      // April 15, 2027 should contain event ev-1
      const allDays = grid.weeks.flat();
      const apr15 = allDays.find((d) => d.dateStr === "2027-04-15");
      expect(apr15).toBeDefined();
      expect(apr15?.events.length).toBe(1);
      expect(apr15?.events[0].title).toBe("Conference A");
    });
  });

  describe("Configuration & Registry Integration", () => {
    it("migrates raw config safely with fallback defaults", () => {
      const migrated = migrateCalendarConfig(null);
      expect(migrated.designId).toBe("modern-cards");
      expect(migrated.title).toBe("Upcoming Events");
      expect(migrated.events.length).toBeGreaterThan(0);
    });

    it("verifies 6 unique visual templates are defined", () => {
      expect(CALENDAR_DESIGNS.length).toBe(6);
      const ids = CALENDAR_DESIGNS.map((d) => d.id);
      expect(ids).toContain("minimal-list");
      expect(ids).toContain("modern-cards");
      expect(ids).toContain("monthly-grid");
      expect(ids).toContain("agenda");
      expect(ids).toContain("compact");
      expect(ids).toContain("featured");
    });

    it("confirms Event Calendar is registered and ready in WIDGETS", () => {
      const widget = WIDGETS.find((w) => w.type === "event-calendar");
      expect(widget).toBeDefined();
      expect(widget?.ready).toBe(true);
      expect(widget?.name).toBe("Event Calendar");
      expect(widget?.category).toBe("Content");
    });

    it("generates correct embed script path and snippet", () => {
      expect(getWidgetScriptFileName("event-calendar")).toBe("event-calendar.js");
      expect(getWidgetScriptUrl("event-calendar")).toBe(
        `${CDN_BASE_DOMAIN}/embed/event-calendar.js`
      );

      const snippet = getStandardEmbedSnippet({
        widgetType: "event-calendar",
        widgetId: "wto_cal_test_1",
      });
      expect(snippet).toContain(
        'src="https://cdn.widgets.webtoolocean.com/embed/event-calendar.js"'
      );
      expect(snippet).toContain('data-widget-id="wto_cal_test_1"');
      expect(snippet).toContain("async");
    });
  });
});
