import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Route } from "@/routes/index";

// Mock @tanstack/react-router Link and useNavigate
vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    Link: ({ to, children, ...props }: any) => (
      <a href={to || "#"} {...props}>
        {children}
      </a>
    ),
    useNavigate: () => vi.fn(),
  };
});

// Mock useAuth
const mockUser = {
  uid: "test-user-123",
  displayName: "just test",
  email: "wejusttest365@gmail.com",
  photoURL: null,
};

let currentAuthUser: any = mockUser;
const mockSignOut = vi.fn();
const mockToast = vi.fn();

vi.mock("sonner", () => ({
  toast: Object.assign((...args: any[]) => mockToast(...args), {
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

vi.mock("@/lib/auth", () => ({
  useAuth: () => ({
    user: currentAuthUser,
    signOut: mockSignOut,
    loading: false,
    isFirebaseConfigured: true,
  }),
}));

describe("Premium SaaS Landing Page Redesign", () => {
  it("renders header with logo, navigation links, and logged-in user dropdown", () => {
    currentAuthUser = mockUser;
    const LandingComponent = Route.options.component!;
    const { container } = render(<LandingComponent />);

    const header = container.querySelector("header")!;
    expect(header).toBeInTheDocument();

    // Logo inside header
    const headerLogo = within(header).getByAltText("Website Widgets by WebToolOcean");
    expect(headerLogo).toBeInTheDocument();

    // Center Nav inside header
    expect(within(header).getByRole("link", { name: "Templates" })).toBeInTheDocument();
    expect(within(header).getByRole("link", { name: "Features" })).toBeInTheDocument();
    expect(within(header).getByRole("link", { name: "Widgets" })).toBeInTheDocument();
    expect(within(header).getByRole("link", { name: "Pricing" })).toBeInTheDocument();
    expect(within(header).getByRole("link", { name: "Help" })).toBeInTheDocument();

    // User trigger in header
    const userTrigger = within(header).getByRole("button", { name: /just test/i });
    expect(userTrigger).toBeInTheDocument();

    // Clicking trigger opens profile dropdown
    fireEvent.click(userTrigger);
    expect(screen.getByText("wejusttest365@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("FREE PLAN")).toBeInTheDocument();
    expect(screen.getByText("Manage your widgets")).toBeInTheDocument();
    expect(screen.getByText("Sign out")).toBeInTheDocument();
  });

  it("renders Log in dropdown button and Get Started button when user signs out or is logged out", () => {
    currentAuthUser = null;
    sessionStorage.setItem("ww_logged_out", "true");
    const LandingComponent = Route.options.component!;
    const { container } = render(<LandingComponent />);

    const header = container.querySelector("header")!;
    const logInBtn = within(header).getByRole("button", { name: "Log in" });
    expect(logInBtn).toBeInTheDocument();
    expect(within(header).getByRole("link", { name: "Get Started" })).toBeInTheDocument();

    // Clicking Log in opens modern Google sign-in dropdown
    fireEvent.click(logInBtn);
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    expect(screen.getByText("WEBTOOLOCEAN")).toBeInTheDocument();
    expect(screen.getByText("Verified")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Continue with Google/i })).toBeInTheDocument();
    expect(screen.getByText("OAuth 2.0 Account Chooser")).toBeInTheDocument();
    expect(screen.getByText("Fast access")).toBeInTheDocument();

    sessionStorage.removeItem("ww_logged_out");
  });

  it("transitions to logged-out state when user clicks Sign out in profile dropdown", () => {
    currentAuthUser = mockUser;
    const LandingComponent = Route.options.component!;
    const { container } = render(<LandingComponent />);

    const header = container.querySelector("header")!;
    const userTrigger = within(header).getByRole("button", { name: /just test/i });
    fireEvent.click(userTrigger);

    const signOutBtn = screen.getByRole("button", { name: /Sign out/i });
    fireEvent.click(signOutBtn);

    expect(mockSignOut).toHaveBeenCalled();
    expect(within(header).getByRole("button", { name: "Log in" })).toBeInTheDocument();
    expect(within(header).getByRole("link", { name: "Get Started" })).toBeInTheDocument();
    sessionStorage.removeItem("ww_logged_out");
  });

  it("renders hero section with eyebrow, heading, CTAs, and 3 benefits", () => {
    currentAuthUser = mockUser;
    const LandingComponent = Route.options.component!;
    render(<LandingComponent />);

    expect(screen.getByText("WEBSITE WIDGETS")).toBeInTheDocument();
    expect(screen.getByText("powerful widgets")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Explore Widgets/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("link", { name: /View Templates/i })).toBeInTheDocument();

    expect(screen.getByText("No coding")).toBeInTheDocument();
    expect(screen.getByText("Lightweight")).toBeInTheDocument();
    expect(screen.getByText("Works on any website")).toBeInTheDocument();
  });

  it("renders statistics strip with 4 key metrics", () => {
    const LandingComponent = Route.options.component!;
    render(<LandingComponent />);

    expect(screen.getAllByText("50+").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Ready Widgets")).toBeInTheDocument();
    expect(screen.getByText("100+")).toBeInTheDocument();
    expect(screen.getByText("Website Templates")).toBeInTheDocument();
    expect(screen.getByText("1-Click")).toBeInTheDocument();
    expect(screen.getByText("Setup")).toBeInTheDocument();
    expect(screen.getAllByText("Works Everywhere").length).toBeGreaterThanOrEqual(1);
  });

  it("renders widget explorer with category sidebar and popular widgets", () => {
    const LandingComponent = Route.options.component!;
    render(<LandingComponent />);

    // Sidebar search and categories
    expect(screen.getByPlaceholderText("Search widgets...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /All Widgets/i })).toBeInTheDocument();

    // 6 popular cards
    expect(screen.getAllByText("WhatsApp Live Chat").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Announcement Bar").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Countdown Timer").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Contact Form").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Newsletter Popup").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Testimonial Slider").length).toBeGreaterThanOrEqual(1);
  });

  it("filters widgets when searching in the explorer", () => {
    const LandingComponent = Route.options.component!;
    render(<LandingComponent />);

    const searchInput = screen.getByPlaceholderText("Search widgets...");
    fireEvent.change(searchInput, { target: { value: "whatsapp" } });

    expect(screen.getByText("WhatsApp Live Chat")).toBeInTheDocument();
    expect(screen.queryByText("Countdown Timer")).not.toBeInTheDocument();
  });

  it("renders explore by category section with 6 tiles", () => {
    const LandingComponent = Route.options.component!;
    render(<LandingComponent />);

    expect(screen.getByText("Explore by Category")).toBeInTheDocument();
    expect(screen.getByText("Find the right widget for your project.")).toBeInTheDocument();

    expect(screen.getAllByRole("button", { name: /Business/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("button", { name: /Conversion/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("button", { name: /Engagement/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("button", { name: /Utilities/i }).length).toBeGreaterThanOrEqual(1);
  }, 20000);

  it("renders transparent pricing section with Free, Pro, and Agency plans", () => {
    const LandingComponent = Route.options.component!;
    render(<LandingComponent />);

    expect(screen.getByText("Simple, Transparent Pricing")).toBeInTheDocument();
    expect(screen.getByText("Free Plan")).toBeInTheDocument();
    expect(screen.getByText("Pro Plan")).toBeInTheDocument();
    expect(screen.getByText("Agency")).toBeInTheDocument();
    expect(screen.getByText("$0")).toBeInTheDocument();
    expect(screen.getByText("$9")).toBeInTheDocument();
    expect(screen.getByText("$29")).toBeInTheDocument();
  });

  it("shows toast prompt when unauthenticated user clicks Add Widget", () => {
    currentAuthUser = null;
    const LandingComponent = Route.options.component!;
    render(<LandingComponent />);

    const addWidgetButtons = screen.getAllByRole("button", { name: /Add Widget/i });
    expect(addWidgetButtons.length).toBeGreaterThan(0);
    const firstButton = addWidgetButtons[0];
    expect(firstButton).toBeDefined();
    if (!firstButton) {
      throw new Error("Expected at least one Add Widget button");
    }
    fireEvent.click(firstButton);

    expect(mockToast).toHaveBeenCalledWith(
      "Please login to create widgets",
      expect.objectContaining({
        description: expect.stringContaining("Sign in to customize"),
      })
    );
  });

  it("renders 3 horizontal benefit cards", () => {
    const LandingComponent = Route.options.component!;
    render(<LandingComponent />);

    expect(screen.getByText("Easy Setup")).toBeInTheDocument();
    expect(screen.getByText("Lightweight & Fast")).toBeInTheDocument();
    expect(screen.getAllByText("Works Everywhere").length).toBeGreaterThanOrEqual(1);
  });

  it("renders final CTA banner", () => {
    const LandingComponent = Route.options.component!;
    render(<LandingComponent />);

    expect(screen.getByText("Ready to enhance your website?")).toBeInTheDocument();
    expect(screen.getByText("Start adding powerful widgets today. No credit card required.")).toBeInTheDocument();
  });

  it("renders footer without any newsletter or email subscription inputs", () => {
    const LandingComponent = Route.options.component!;
    const { container } = render(<LandingComponent />);

    // Footer columns
    const footer = container.querySelector("footer")!;
    expect(footer).toBeInTheDocument();
    expect(within(footer).getByText("Product")).toBeInTheDocument();
    expect(within(footer).getByText("Resources")).toBeInTheDocument();
    expect(within(footer).getByText("Company")).toBeInTheDocument();
    expect(within(footer).getByText("© 2026 WebToolOcean. All rights reserved.")).toBeInTheDocument();
    expect(within(footer).getByText("Privacy Policy")).toBeInTheDocument();
    expect(within(footer).getByText("Terms of Service")).toBeInTheDocument();
    expect(within(footer).getByText("Cookie Policy")).toBeInTheDocument();

    // STRICT CHECK: Footer must NOT have any newsletter or email subscription form
    expect(footer.querySelector("input[type='email']")).toBeNull();
    expect(footer.textContent).not.toContain("Subscribe");
    expect(footer.textContent).not.toContain("Newsletter");
    expect(footer.textContent).not.toContain("Get Updates");

    // STRICT CHECK: Footer menu must NOT contain "My Account" or "Sign In"
    expect(within(footer).queryByText("My Account")).toBeNull();
    expect(within(footer).queryByText("Sign In")).toBeNull();
  });
});
