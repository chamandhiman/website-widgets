import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TestimonialSliderRenderer } from "@/components/testimonial/TestimonialSliderRenderer";
import { TestimonialSliderConfigTabs } from "@/components/testimonial/TestimonialSliderConfigTabs";
import { TestimonialSliderInstallModal } from "@/components/testimonial/TestimonialSliderInstallModal";
import {
  DEFAULT_TESTIMONIAL_CONFIG,
  TESTIMONIAL_DESIGNS,
  type TestimonialSliderConfig,
} from "@/lib/testimonial/types";

describe("TestimonialSliderRenderer Component", () => {
  it("renders Modern Cards design with title and testimonials", () => {
    render(<TestimonialSliderRenderer config={DEFAULT_TESTIMONIAL_CONFIG} />);
    expect(screen.getByText("What Our Customers Say")).toBeInTheDocument();
    expect(screen.getByText("Sophia Martinez")).toBeInTheDocument();
  });

  it("renders Minimal design", () => {
    const config: TestimonialSliderConfig = {
      ...DEFAULT_TESTIMONIAL_CONFIG,
      designId: "minimal",
    };
    render(<TestimonialSliderRenderer config={config} />);
    expect(screen.getByText("Sophia Martinez")).toBeInTheDocument();
  });

  it("renders Elegant design", () => {
    const config: TestimonialSliderConfig = {
      ...DEFAULT_TESTIMONIAL_CONFIG,
      designId: "elegant",
    };
    render(<TestimonialSliderRenderer config={config} />);
    expect(screen.getByText("Sophia Martinez")).toBeInTheDocument();
    expect(screen.getAllByText("Verified").length).toBeGreaterThan(0);
  });

  it("renders Dark design", () => {
    const config: TestimonialSliderConfig = {
      ...DEFAULT_TESTIMONIAL_CONFIG,
      designId: "dark",
    };
    render(<TestimonialSliderRenderer config={config} />);
    expect(screen.getByText("Sophia Martinez")).toBeInTheDocument();
  });

  it("renders Quote Focus design", () => {
    const config: TestimonialSliderConfig = {
      ...DEFAULT_TESTIMONIAL_CONFIG,
      designId: "quote-focus",
    };
    render(<TestimonialSliderRenderer config={config} />);
    expect(screen.getByText("Sophia Martinez")).toBeInTheDocument();
  });

  it("renders Compact design", () => {
    const config: TestimonialSliderConfig = {
      ...DEFAULT_TESTIMONIAL_CONFIG,
      designId: "compact",
    };
    render(<TestimonialSliderRenderer config={config} />);
    expect(screen.getByText("Sophia Martinez")).toBeInTheDocument();
  });

  it("renders empty state when there are no testimonials", () => {
    const config: TestimonialSliderConfig = {
      ...DEFAULT_TESTIMONIAL_CONFIG,
      testimonials: [],
    };
    render(<TestimonialSliderRenderer config={config} />);
    expect(screen.getByText("No Testimonials Added Yet")).toBeInTheDocument();
  });
});

describe("TestimonialSliderConfigTabs Component", () => {
  it("renders Designs tab with all 6 visual design templates", () => {
    const onChange = vi.fn();
    const onSelectDesign = vi.fn();

    render(
      <TestimonialSliderConfigTabs
        config={DEFAULT_TESTIMONIAL_CONFIG}
        onChange={onChange}
        onSelectDesign={onSelectDesign}
        defaultTab="designs"
      />
    );

    for (const design of TESTIMONIAL_DESIGNS) {
      expect(screen.getByText(design.name)).toBeInTheDocument();
    }
  });

  it("renders Content tab with section heading and Add button", () => {
    const onChange = vi.fn();
    const onSelectDesign = vi.fn();

    render(
      <TestimonialSliderConfigTabs
        config={DEFAULT_TESTIMONIAL_CONFIG}
        onChange={onChange}
        onSelectDesign={onSelectDesign}
        defaultTab="content"
      />
    );

    expect(screen.getByLabelText(/Section Heading/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add Testimonial/i })).toBeInTheDocument();
  });

  it("renders Preferences tab with slider behavior and display options", () => {
    const onChange = vi.fn();
    const onSelectDesign = vi.fn();

    render(
      <TestimonialSliderConfigTabs
        config={DEFAULT_TESTIMONIAL_CONFIG}
        onChange={onChange}
        onSelectDesign={onSelectDesign}
        defaultTab="preferences"
      />
    );

    expect(screen.getByLabelText(/Autoplay Slides/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Reviewer Photos \/ Avatars/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Star Ratings/i)).toBeInTheDocument();
  });
});

describe("TestimonialSliderInstallModal Component", () => {
  it("renders embed snippet with production CDN script", () => {
    render(
      <TestimonialSliderInstallModal
        open={true}
        onOpenChange={vi.fn()}
        widgetId="test-widget-456"
        config={DEFAULT_TESTIMONIAL_CONFIG}
      />
    );

    expect(screen.getByText(/Install Widget/i)).toBeInTheDocument();
    expect(
      screen.getByText((content) =>
        content.includes("https://cdn.widgets.webtoolocean.com/embed/testimonial-slider.js")
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /DONE/i })).toBeInTheDocument();
  });
});
