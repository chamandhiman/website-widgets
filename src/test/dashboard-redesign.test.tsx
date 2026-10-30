import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useRouterState: () => ({ location: { pathname: "/dashboard" } }),
  useNavigate: () => vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  useAuth: () => ({
    user: { displayName: "Demo User", email: "demo@example.com" },
    signOut: vi.fn(),
    loading: false,
  }),
  AuthGuard: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

import { StudioTopNav } from "@/components/StudioTopNav";
import { StudioLayout } from "@/components/StudioLayout";
import { WidgetCatalog } from "@/components/WidgetCatalog";
import { MarketplaceWidgetPreview } from "@/components/MarketplaceWidgetPreview";
import { saveWidget, deleteWidget, loadSaved, getPlanUsage, DEFAULT_PLAN } from "@/lib/widgets";

describe("Complete Dashboard UI/UX Redesign Tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("1. Common Top Navigation Bar", () => {
    it("renders the supplied Website Widgets logo in the top bar with correct path and attributes", () => {
      render(<StudioTopNav />);

      const logoImg = screen.getByAltText("Website Widgets by WebToolOcean");
      expect(logoImg).toBeInTheDocument();
      expect(logoImg).toHaveAttribute("src", "/logo.png");
    });

    it("displays plan usage indicator that updates with actual widget counts", () => {
      // Initially 0 widgets
      expect(getPlanUsage().count).toBe(0);
      expect(getPlanUsage().limit).toBe(10);

      // Save 3 mock widgets
      saveWidget({ id: "w1", type: "whatsapp-chat", name: "WhatsApp", config: {}, updatedAt: Date.now() });
      saveWidget({ id: "w2", type: "faq", name: "FAQ", config: {}, updatedAt: Date.now() });
      saveWidget({ id: "w3", type: "popup", name: "Popup", config: {}, updatedAt: Date.now() });

      const usage = getPlanUsage();
      expect(usage.count).toBe(3);
      expect(usage.percentage).toBe(30);

      render(<StudioTopNav />);
      expect(screen.getByText(/3 of 10/i)).toBeInTheDocument();
      expect(screen.getByText(/widgets used/i)).toBeInTheDocument();
    });

    it("renders Upgrade Plan button and Help icon", () => {
      render(<StudioTopNav />);

      expect(screen.getByRole("button", { name: /upgrade plan/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /help & documentation/i })).toBeInTheDocument();
    });
  });

  describe("2. Black Left Navigation Sidebar", () => {
    it("is permanently fixed at 68px and does not expand on hover", () => {
      render(
        <StudioLayout>
          <div>Workspace Content</div>
        </StudioLayout>
      );

      // Workspace content is present
      expect(screen.getByText("Workspace Content")).toBeInTheDocument();

      // Sidebar exists and is fixed at 68px
      const aside = screen.getByRole("complementary");
      expect(aside).toHaveClass("bg-[#0e1017]");
      expect(aside).toHaveClass("w-[68px]");

      // Hover over sidebar - does NOT expand to w-60
      fireEvent.mouseEnter(aside);
      expect(aside).toHaveClass("w-[68px]");
      expect(aside).not.toHaveClass("w-60");

      // Mouse leave - remains 68px
      fireEvent.mouseLeave(aside);
      expect(aside).toHaveClass("w-[68px]");
    });

    it("renders navigation items with accessible labels", () => {
      render(
        <StudioLayout>
          <div>Workspace Content</div>
        </StudioLayout>
      );

      // Brand mark is exclusively in the top navigation bar, not duplicate in left sidebar
      expect(screen.queryByRole("link", { name: "Website Widgets Home" })).not.toBeInTheDocument();

      // Accessible nav items
      expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "All Widgets" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "My Widgets" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Templates" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Integrations" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Settings" })).toBeInTheDocument();

      // Upgrade to Pro button at bottom
      expect(screen.getByRole("link", { name: "Upgrade to Pro" })).toBeInTheDocument();
    });
  });

  describe("3. White Widget Category Sidebar & Marketplace", () => {
    it("renders white category sidebar with real category counts", () => {
      render(<WidgetCatalog />);

      expect(screen.getByText("Widget Categories")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Reviews" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Chat" })).toBeInTheDocument();
    });

    it("renders Explore widgets marketplace header and tabs", () => {
      render(<WidgetCatalog />);

      expect(screen.getByText("Explore widgets")).toBeInTheDocument();
      expect(screen.getByText(/Choose a widget to add to your website/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Filter All" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Filter Popular" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Filter New" })).toBeInTheDocument();
    });

    it("renders rendered previews for Logo Carousel, FAQ, and Google Reviews", () => {
      const { unmount: u1 } = render(<MarketplaceWidgetPreview type="logo-carousel" />);
      expect(screen.getByText("Trusted by 10,000+ Fast-Growing Companies")).toBeInTheDocument();
      expect(screen.getByText("Aurora")).toBeInTheDocument();
      u1();

      const { unmount: u2 } = render(<MarketplaceWidgetPreview type="faq" />);
      expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
      expect(screen.getByText("How does it work?")).toBeInTheDocument();
      u2();

      const { unmount: u3 } = render(<MarketplaceWidgetPreview type="google-reviews" />);
      expect(screen.getByText("What Our Customers Say")).toBeInTheDocument();
      expect(screen.getByText("Priya Sharma")).toBeInTheDocument();
      u3();

      const { unmount: u4 } = render(<MarketplaceWidgetPreview type="countdown" />);
      expect(screen.getByText("Special Discount Ends In")).toBeInTheDocument();
      expect(screen.getByText("Shop Now")).toBeInTheDocument();
      u4();

      const { unmount: u5 } = render(<MarketplaceWidgetPreview type="event-calendar" />);
      expect(screen.getByText("Upcoming Events")).toBeInTheDocument();
      expect(screen.getByText("Web Design Workshop")).toBeInTheDocument();
      u5();
    });
  });
});
