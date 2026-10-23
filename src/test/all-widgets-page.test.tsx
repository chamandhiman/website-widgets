import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useRouterState: () => ({ location: { pathname: "/widgets" } }),
  useNavigate: () => vi.fn(),
}));

import { WidgetCatalog } from "@/components/WidgetCatalog";
import { getStoredUser, saveStoredUser } from "@/components/StudioTopNav";
import { WIDGETS, CATEGORIES } from "@/lib/widgets";

describe("Redesigned All Widgets Page & Shared Top Nav", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Category Filters and Search Toolbar", () => {
    it("displays all 8 categories in the exact required order", () => {
      const expected = [
        "All",
        "Reviews",
        "Social",
        "Chat",
        "Content",
        "Forms",
        "Promotion",
        "Utility",
      ];
      expect(CATEGORIES).toEqual(expected);
    });

    it("renders the category buttons and compact search input with correct placeholder", () => {
      render(<WidgetCatalog />);

      for (const cat of CATEGORIES) {
        expect(screen.getByRole("button", { name: cat })).toBeInTheDocument();
      }

      const searchInput = screen.getByPlaceholderText("Search widgets...");
      expect(searchInput).toBeInTheDocument();
    });

    it("filters widgets by category and search", () => {
      render(<WidgetCatalog />);

      const chatBtn = screen.getByRole("button", { name: "Chat" });
      fireEvent.click(chatBtn);

      expect(screen.getByText("WhatsApp Chat")).toBeInTheDocument();
      expect(screen.queryByText("Google Reviews")).not.toBeInTheDocument();

      const allBtn = screen.getByRole("button", { name: "All" });
      fireEvent.click(allBtn);

      const searchInput = screen.getByPlaceholderText("Search widgets...");
      fireEvent.change(searchInput, { target: { value: "Popup" } });

      expect(screen.getByText("Popup Widget")).toBeInTheDocument();
      expect(screen.queryByText("Google Reviews")).not.toBeInTheDocument();
    });
  });

  describe("Widget Priority Ordering", () => {
    it("places WhatsApp Chat, Announcement Bar, and Popup Widget as first 3 cards in exact order", () => {
      expect(WIDGETS[0]?.type).toBe("whatsapp-chat");
      expect(WIDGETS[0]?.name).toBe("WhatsApp Chat");

      expect(WIDGETS[1]?.type).toBe("announcement-bar");
      expect(WIDGETS[1]?.name).toBe("Announcement Bar");

      expect(WIDGETS[2]?.type).toBe("popup");
      expect(WIDGETS[2]?.name).toBe("Popup Widget");
    });
  });

  describe("Widget Card Elements", () => {
    it("renders Create Widget and View Demo buttons for ready widgets", () => {
      render(<WidgetCatalog />);

      const createButtons = screen.getAllByRole("link", { name: /create widget/i });
      expect(createButtons.length).toBeGreaterThanOrEqual(3);

      const viewDemoButtons = screen.getAllByRole("button", { name: /view demo/i });
      expect(viewDemoButtons.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("StudioTopNav Auth State", () => {
    it("returns null when no user is stored in localStorage", () => {
      expect(getStoredUser()).toBeNull();
    });

    it("stores and retrieves authenticated user", () => {
      saveStoredUser({
        name: "Chaman Dhiman",
        email: "chaman@webtoolocean.com",
        initials: "CD",
      });

      const user = getStoredUser();
      expect(user).not.toBeNull();
      expect(user?.name).toBe("Chaman Dhiman");
      expect(user?.initials).toBe("CD");

      saveStoredUser(null);
      expect(getStoredUser()).toBeNull();
    });
  });
});
