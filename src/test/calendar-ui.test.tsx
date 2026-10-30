import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EventCalendarRenderer } from "@/components/calendar/EventCalendarRenderer";
import { EventCalendarConfigTabs } from "@/components/calendar/EventCalendarConfigTabs";
import { EventCalendarInstallModal } from "@/components/calendar/EventCalendarInstallModal";
import {
  DEFAULT_EVENT_CALENDAR_CONFIG,
  type EventCalendarConfig,
  type CalendarEvent,
} from "@/lib/calendar/types";

describe("Event Calendar UI Components Suite", () => {
  const testConfig: EventCalendarConfig = {
    ...DEFAULT_EVENT_CALENDAR_CONFIG,
    title: "Company Showcase 2027",
    description: "Annual keynote and partner sessions.",
    events: [
      {
        id: "ev-1",
        title: "Keynote Address",
        date: "2027-04-15",
        startTime: "09:00",
        endTime: "11:00",
        location: "Hall A",
        description: "Opening keynote by the CEO.",
        destinationUrl: "https://example.com/keynote",
      },
      {
        id: "ev-2",
        title: "AI & UI Workshop",
        date: "2027-04-20",
        startTime: "13:00",
        endTime: "15:00",
        location: "Room 204",
        description: "Hands-on UI workshop.",
      },
    ],
  };

  describe("EventCalendarRenderer (All 6 Designs)", () => {
    it("renders Minimal List design with title, date badge, and event titles", () => {
      render(<EventCalendarRenderer config={{ ...testConfig, designId: "minimal-list" }} />);
      expect(screen.getByText("Company Showcase 2027")).toBeInTheDocument();
      expect(screen.getByText("Keynote Address")).toBeInTheDocument();
      expect(screen.getByText("AI & UI Workshop")).toBeInTheDocument();
      expect(screen.getByText("View Details")).toBeInTheDocument();
    });

    it("renders Modern Cards design with event cards and locations", () => {
      render(<EventCalendarRenderer config={{ ...testConfig, designId: "modern-cards" }} />);
      expect(screen.getByText("Company Showcase 2027")).toBeInTheDocument();
      expect(screen.getByText("Keynote Address")).toBeInTheDocument();
      expect(screen.getByText("Hall A")).toBeInTheDocument();
      expect(screen.getByText("Register / Details")).toBeInTheDocument();
    });

    it("renders Monthly Calendar design with month header, navigation, and calendar days", () => {
      render(<EventCalendarRenderer config={{ ...testConfig, designId: "monthly-grid" }} />);
      expect(screen.getByText(/April 2027/i)).toBeInTheDocument();
      expect(screen.getByLabelText("Previous Month")).toBeInTheDocument();
      expect(screen.getByLabelText("Next Month")).toBeInTheDocument();
      // Month grid has day numbers
      expect(screen.getByText("15")).toBeInTheDocument();
    });

    it("renders Agenda design grouped by date headers", () => {
      render(<EventCalendarRenderer config={{ ...testConfig, designId: "agenda" }} />);
      expect(screen.getByText("Keynote Address")).toBeInTheDocument();
      expect(screen.getByText("AI & UI Workshop")).toBeInTheDocument();
      expect(screen.getByText("Details")).toBeInTheDocument();
    });

    it("renders Compact design with condensed event items", () => {
      render(<EventCalendarRenderer config={{ ...testConfig, designId: "compact" }} />);
      expect(screen.getByText("Keynote Address")).toBeInTheDocument();
      expect(screen.getByText("AI & UI Workshop")).toBeInTheDocument();
    });

    it("renders Featured Events design with large event highlight", () => {
      render(<EventCalendarRenderer config={{ ...testConfig, designId: "featured" }} />);
      expect(screen.getByText("Keynote Address")).toBeInTheDocument();
      expect(screen.getByText("Reserve Spot")).toBeInTheDocument();
    });

    it("displays custom empty state message when no events exist", () => {
      render(
        <EventCalendarRenderer
          config={{
            ...testConfig,
            designId: "minimal-list",
            events: [],
            emptyStateMessage: "No sessions currently scheduled.",
          }}
        />
      );
      expect(screen.getByText("No sessions currently scheduled.")).toBeInTheDocument();
    });
  });

  describe("EventCalendarConfigTabs", () => {
    it("renders Designs, Content, and Preferences tabs", () => {
      render(
        <EventCalendarConfigTabs
          config={testConfig}
          onChange={vi.fn()}
          onSelectDesign={vi.fn()}
        />
      );

      expect(screen.getByRole("tab", { name: /designs/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /content/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /preferences/i })).toBeInTheDocument();

      // All 6 templates listed in Designs tab
      expect(screen.getByText("Minimal List")).toBeInTheDocument();
      expect(screen.getByText("Modern Cards")).toBeInTheDocument();
      expect(screen.getByText("Monthly Calendar")).toBeInTheDocument();
      expect(screen.getByText("Agenda")).toBeInTheDocument();
      expect(screen.getByText("Compact")).toBeInTheDocument();
      expect(screen.getByText("Featured Events")).toBeInTheDocument();
    });

    it("allows switching to Content tab and editing calendar title", () => {
      const handleChange = vi.fn();
      render(
        <EventCalendarConfigTabs
          config={testConfig}
          onChange={handleChange}
          onSelectDesign={vi.fn()}
          defaultTab="content"
        />
      );

      const titleInput = screen.getByLabelText(/calendar title/i);
      expect(titleInput).toBeInTheDocument();

      fireEvent.change(titleInput, { target: { value: "Summer Meetup Series" } });
      expect(handleChange).toHaveBeenCalledWith("title", "Summer Meetup Series");
    });

    it("allows switching to Preferences tab and toggling switches", () => {
      const handleChange = vi.fn();
      render(
        <EventCalendarConfigTabs
          config={testConfig}
          onChange={handleChange}
          onSelectDesign={vi.fn()}
          defaultTab="preferences"
        />
      );

      expect(screen.getByLabelText(/upcoming events only/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/show descriptions/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/show locations/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/show event images/i)).toBeInTheDocument();
    });
  });

  describe("EventCalendarInstallModal", () => {
    it("renders simplified modal with standard event-calendar.js CDN script and purple Done button", () => {
      render(
        <EventCalendarInstallModal
          open={true}
          onOpenChange={() => {}}
          widgetId="wto_test_calendar_888"
          config={testConfig}
        />
      );

      expect(screen.getByText("Install Widget")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Copy this code and paste it into your website page where you want the widget to appear."
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(/https:\/\/cdn\.widgets\.webtoolocean\.com\/embed\/event-calendar\.js/)
      ).toBeInTheDocument();
      expect(screen.getByText(/data-widget-id="wto_test_calendar_888"/)).toBeInTheDocument();

      expect(screen.getByText("Copy Code")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      const doneBtn = screen.getByText("Done");
      expect(doneBtn).toBeInTheDocument();
      expect(doneBtn.className).toContain("bg-purple-600");

      // Verify technical clutter is not rendered
      expect(screen.queryByText("Script Source:")).toBeNull();
      expect(screen.queryByText("Embed Mode:")).toBeNull();
      expect(screen.queryByText("Select Your Website Platform")).toBeNull();
    });
  });
});
