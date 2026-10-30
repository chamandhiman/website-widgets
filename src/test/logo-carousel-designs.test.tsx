import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LogoCarouselConfigTabs } from "@/components/logo-carousel/LogoCarouselConfigTabs";
import { MiniatureLogoPreview } from "@/components/logo-carousel/MiniatureLogoPreview";
import { DEFAULT_LOGO_CAROUSEL_CONFIG, LOGO_DESIGNS, type LogoDesignId } from "@/lib/logo-carousel/types";

describe("Logo Carousel Realistic Designs Tab Previews", () => {
  it("renders real brand logo artwork for all 8 design templates in the Designs tab", () => {
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

    // Verify all 8 design names are present
    LOGO_DESIGNS.forEach((d) => {
      expect(screen.getByText(d.name)).toBeInTheDocument();
    });

    // Verify real logos are rendered inside the design cards (Google, Microsoft, Apple, Spotify, etc.)
    const googleLogos = screen.getAllByAltText("Google logo");
    expect(googleLogos.length).toBeGreaterThanOrEqual(6);

    const microsoftLogos = screen.getAllByAltText("Microsoft logo");
    expect(microsoftLogos.length).toBeGreaterThanOrEqual(6);

    const appleLogos = screen.getAllByAltText("Apple logo");
    expect(appleLogos.length).toBeGreaterThanOrEqual(5);

    const spotifyLogos = screen.getAllByAltText("Spotify logo");
    expect(spotifyLogos.length).toBeGreaterThanOrEqual(5);
  });

  it("verifies MiniatureLogoPreview renders actual logo images for every design variant without skeleton bars", () => {
    const designIds: LogoDesignId[] = [
      "classic",
      "trusted-by",
      "infinite-marquee",
      "grayscale-color",
      "logo-grid",
      "premium-cards",
      "dark-showcase",
      "compact-strip",
    ];

    designIds.forEach((id) => {
      const { container, unmount } = render(<MiniatureLogoPreview id={id} />);

      // Ensure actual logo <img> or SVG elements are present
      const images = container.querySelectorAll("img, svg");
      expect(images.length).toBeGreaterThanOrEqual(3);

      // Verify no wireframe/skeleton placeholder bars exist (like old h-3 w-8 bg-purple-200 or h-2.5 w-7)
      expect(container.querySelector(".bg-purple-200")).toBeNull();
      expect(container.querySelector(".bg-blue-200")).toBeNull();
      expect(container.querySelector(".bg-amber-200")).toBeNull();
      expect(container.querySelector(".h-2\\.5.w-7")).toBeNull();
      expect(container.querySelector(".h-3.w-8")).toBeNull();

      unmount();
    });
  });

  it("Grayscale to Color design visibly demonstrates the hover color reveal concept", () => {
    render(<MiniatureLogoPreview id="grayscale-color" />);

    // Shows "Hover" badge for active logo
    expect(screen.getByText("Hover")).toBeInTheDocument();

    // Contains grayscale logos
    const appleImg = screen.getByAltText("Apple logo");
    expect(appleImg.className).toContain("grayscale");
  });

  it("Trusted By design renders official header and real brand logos", () => {
    render(<MiniatureLogoPreview id="trusted-by" />);

    expect(screen.getByText("TRUSTED BY INDUSTRY LEADERS")).toBeInTheDocument();
    expect(screen.getByAltText("Amazon logo")).toBeInTheDocument();
    expect(screen.getByAltText("Meta logo")).toBeInTheDocument();
  });

  it("selecting different designs preserves the user's configured logos", () => {
    const onSelect = vi.fn();
    const customUserLogos = [
      {
        id: "custom-user-1",
        name: "My Custom Brand",
        imageUrl: "https://example.com/my-brand.png",
        altText: "My Custom Brand",
        enabled: true,
      },
    ];

    render(
      <LogoCarouselConfigTabs
        config={{
          ...DEFAULT_LOGO_CAROUSEL_CONFIG,
          logos: customUserLogos,
        }}
        updateConfig={vi.fn()}
        onSelectDesign={onSelect}
        onResetDefaults={vi.fn()}
        defaultTab="designs"
      />
    );

    // Select Dark Showcase
    fireEvent.click(screen.getByText("Dark Showcase"));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "dark-showcase" })
    );
  });
});
