import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LogoCarouselConfigTabs } from "@/components/logo-carousel/LogoCarouselConfigTabs";
import { LogoCarouselLivePreview } from "@/components/logo-carousel/LogoCarouselLivePreview";
import { LogoCarouselRenderer } from "@/components/logo-carousel/LogoCarouselRenderer";
import { LogoCarouselInstallModal } from "@/components/logo-carousel/LogoCarouselInstallModal";
import { DEFAULT_LOGO_CAROUSEL_CONFIG, LOGO_DESIGNS } from "@/lib/logo-carousel/types";

describe("Logo Carousel UI Components", () => {
  it("LogoCarouselConfigTabs renders 3 primary tabs: Designs, Content, Preferences", () => {
    const onUpdate = vi.fn();
    const onReset = vi.fn();

    render(
      <LogoCarouselConfigTabs
        config={DEFAULT_LOGO_CAROUSEL_CONFIG}
        updateConfig={onUpdate}
        onResetDefaults={onReset}
        defaultTab="designs"
      />
    );

    // Verify 3 tabs exist
    expect(screen.getByRole("tab", { name: "Designs" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "Content" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "Preferences" })).toBeDefined();

    // Verify all 8 design templates are present
    expect(screen.getByText("Select Carousel Design")).toBeDefined();
    expect(screen.getByText("Classic Logo Carousel")).toBeDefined();
    expect(screen.getByText("Trusted By")).toBeDefined();
    expect(screen.getByText("Infinite Marquee")).toBeDefined();
    expect(screen.getByText("Grayscale to Color")).toBeDefined();
    expect(screen.getByText("Logo Grid")).toBeDefined();
    expect(screen.getByText("Premium Cards")).toBeDefined();
    expect(screen.getByText("Dark Showcase")).toBeDefined();
    expect(screen.getByText("Compact Partner Strip")).toBeDefined();
  });

  it("LogoCarouselConfigTabs allows selecting a design template", () => {
    const onSelect = vi.fn();

    render(
      <LogoCarouselConfigTabs
        config={DEFAULT_LOGO_CAROUSEL_CONFIG}
        updateConfig={vi.fn()}
        onSelectDesign={onSelect}
        onResetDefaults={vi.fn()}
        defaultTab="designs"
      />
    );

    fireEvent.click(screen.getByText("Infinite Marquee"));
    expect(onSelect).toHaveBeenCalled();
  });

  it("LogoCarouselConfigTabs Content tab allows editing title, adding and editing logos", () => {
    const onUpdate = vi.fn();

    render(
      <LogoCarouselConfigTabs
        config={DEFAULT_LOGO_CAROUSEL_CONFIG}
        updateConfig={onUpdate}
        onResetDefaults={vi.fn()}
        defaultTab="content"
      />
    );

    expect(screen.getByText("Section Heading")).toBeDefined();
    expect(
      screen.getByDisplayValue("Trusted by 10,000+ Fast-Growing Companies")
    ).toBeDefined();

    // Change title
    const titleInput = screen.getByDisplayValue(
      "Trusted by 10,000+ Fast-Growing Companies"
    );
    fireEvent.change(titleInput, { target: { value: "Our Featured Partners" } });
    expect(onUpdate).toHaveBeenCalledWith("title", "Our Featured Partners");

    // Add Logo button
    const addBtn = screen.getByText("Add Logo");
    fireEvent.click(addBtn);
    expect(onUpdate).toHaveBeenCalled();
  });

  it("LogoCarouselConfigTabs Preferences tab hides carousel behavior controls when Logo Grid is active", () => {
    const { rerender } = render(
      <LogoCarouselConfigTabs
        config={{
          ...DEFAULT_LOGO_CAROUSEL_CONFIG,
          designId: "classic",
        }}
        updateConfig={vi.fn()}
        onResetDefaults={vi.fn()}
        defaultTab="preferences"
      />
    );

    // In Classic mode, carousel controls are visible
    expect(screen.getByText("Carousel Behavior")).toBeDefined();
    expect(screen.getByText("Autoplay")).toBeDefined();

    // Switch to Logo Grid mode
    rerender(
      <LogoCarouselConfigTabs
        config={{
          ...DEFAULT_LOGO_CAROUSEL_CONFIG,
          designId: "logo-grid",
        }}
        updateConfig={vi.fn()}
        onResetDefaults={vi.fn()}
        defaultTab="preferences"
      />
    );

    // In Logo Grid mode, carousel-specific controls must be hidden
    expect(screen.queryByText("Carousel Behavior")).toBeNull();
    expect(screen.getByText("Grid Columns")).toBeDefined();
  });

  it("LogoCarouselLivePreview renders preview frame and device switchers", () => {
    const onVpChange = vi.fn();

    render(
      <LogoCarouselLivePreview
        config={DEFAULT_LOGO_CAROUSEL_CONFIG}
        viewport="desktop"
        onViewportChange={onVpChange}
      />
    );

    expect(screen.getByText("Live Preview")).toBeDefined();
    expect(screen.getByText("Refresh Preview")).toBeDefined();
    expect(screen.getByLabelText("Desktop preview")).toBeDefined();
    expect(screen.getByLabelText("Tablet preview")).toBeDefined();
    expect(screen.getByLabelText("Mobile preview")).toBeDefined();
    expect(screen.getByText("example.com/partners")).toBeDefined();
  });

  it("LogoCarouselRenderer renders logos and handles infinite marquee duplicate track", () => {
    render(
      <LogoCarouselRenderer
        config={{
          ...DEFAULT_LOGO_CAROUSEL_CONFIG,
          designId: "infinite-marquee",
        }}
        viewport="desktop"
      />
    );

    // Primary logos rendered
    expect(screen.getByText("Trusted by 10,000+ Fast-Growing Companies")).toBeDefined();
    const apexLogos = screen.getAllByAltText("Apex Cloud logo");
    expect(apexLogos.length).toBeGreaterThanOrEqual(2); // Track 1 and duplicate Track 2
  });

  it("LogoCarouselInstallModal renders standard CDN embed script and Done button", () => {
    render(
      <LogoCarouselInstallModal
        open={true}
        onOpenChange={vi.fn()}
        widgetId="wto_logo_test_123"
        config={DEFAULT_LOGO_CAROUSEL_CONFIG}
      />
    );

    expect(screen.getByText("Install Logo Carousel")).toBeDefined();
    expect(screen.getByText(/data-widget-id="wto_logo_test_123"/)).toBeDefined();
    expect(screen.getByText(/cdn\.widgets\.webtoolocean\.com\/embed\/logo-carousel\.js/)).toBeDefined();
    expect(screen.getByText("Copy Code")).toBeDefined();
    expect(screen.getByText("Done")).toBeDefined();
  });
});
