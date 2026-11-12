import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  GA_MEASUREMENT_ID,
  gtag,
  trackPageView,
  trackRoute,
  trackEvent,
  resetAnalyticsState,
  getLastDispatchedPath,
} from "../lib/analytics";

describe("Google Analytics 4 (GA4) Integration", () => {
  beforeEach(() => {
    resetAnalyticsState();
    window.dataLayer = [];
    delete (window as any).gtag;
    vi.restoreAllMocks();
  });

  it("should have the correct Measurement ID configured", () => {
    expect(GA_MEASUREMENT_ID).toBe("G-4C1PP726EZ");
  });

  describe("gtag helper", () => {
    it("should queue calls into dataLayer when window.gtag is not yet defined", () => {
      gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
      expect(window.dataLayer).toBeDefined();
      expect(window.dataLayer?.length).toBe(1);
      expect(window.dataLayer?.[0]).toEqual([
        "config",
        GA_MEASUREMENT_ID,
        { send_page_view: false },
      ]);
    });

    it("should invoke window.gtag when window.gtag is defined", () => {
      const mockGtag = vi.fn();
      window.gtag = mockGtag;

      gtag("event", "test_event", { foo: "bar" });
      expect(mockGtag).toHaveBeenCalledWith("event", "test_event", { foo: "bar" });
    });
  });

  describe("trackPageView", () => {
    it("should dispatch page_view event with GA_MEASUREMENT_ID", () => {
      const mockGtag = vi.fn();
      window.gtag = mockGtag;

      trackPageView({
        page_title: "Home",
        page_location: "https://widgets.webtoolocean.com/",
        page_path: "/",
      });

      expect(mockGtag).toHaveBeenCalledTimes(1);
      expect(mockGtag).toHaveBeenCalledWith("event", "page_view", {
        page_title: "Home",
        page_location: "https://widgets.webtoolocean.com/",
        page_path: "/",
        send_to: "G-4C1PP726EZ",
      });
    });
  });

  describe("trackRoute and Deduplication", () => {
    it("should track route with immediate dispatch and record lastDispatchedPath", () => {
      const mockGtag = vi.fn();
      window.gtag = mockGtag;

      trackRoute("/templates", "", true);

      expect(getLastDispatchedPath()).toBe("/templates");
      expect(mockGtag).toHaveBeenCalledTimes(1);
      expect(mockGtag).toHaveBeenCalledWith(
        "event",
        "page_view",
        expect.objectContaining({
          page_path: "/templates",
          send_to: "G-4C1PP726EZ",
        })
      );
    });

    it("should suppress duplicate page_view events for the identical path", () => {
      const mockGtag = vi.fn();
      window.gtag = mockGtag;

      // First call (initial render)
      trackRoute("/pricing", "", true);
      expect(mockGtag).toHaveBeenCalledTimes(1);

      // Duplicate call (e.g. React StrictMode or in-component re-render)
      trackRoute("/pricing", "", true);
      expect(mockGtag).toHaveBeenCalledTimes(1); // Still 1, NOT 2

      // Navigation to a new route
      trackRoute("/features", "", true);
      expect(mockGtag).toHaveBeenCalledTimes(2);
      expect(getLastDispatchedPath()).toBe("/features");
    });

    it("should track search query changes as distinct page views", () => {
      const mockGtag = vi.fn();
      window.gtag = mockGtag;

      trackRoute("/widgets", "?category=marketing", true);
      expect(mockGtag).toHaveBeenCalledTimes(1);

      // Same route and query -> suppressed
      trackRoute("/widgets", "?category=marketing", true);
      expect(mockGtag).toHaveBeenCalledTimes(1);

      // Changed query parameter -> tracked
      trackRoute("/widgets", "?category=chat", true);
      expect(mockGtag).toHaveBeenCalledTimes(2);
      expect(getLastDispatchedPath()).toBe("/widgets?category=chat");
    });
  });

  describe("trackEvent", () => {
    it("should dispatch custom event with send_to parameter", () => {
      const mockGtag = vi.fn();
      window.gtag = mockGtag;

      trackEvent("widget_create_click", {
        widget_type: "whatsapp",
      });

      expect(mockGtag).toHaveBeenCalledWith("event", "widget_create_click", {
        widget_type: "whatsapp",
        send_to: "G-4C1PP726EZ",
      });
    });
  });
});

