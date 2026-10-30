import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PopupTypeGallery } from "@/components/popup/PopupTypeGallery";
import { PopupLivePreview } from "@/components/popup/PopupLivePreview";
import { PopupConfigTabs } from "@/components/popup/PopupConfigTabs";
import { PopupInstallModal } from "@/components/popup/PopupInstallModal";
import { DEFAULT_POPUP_CONFIG } from "@/lib/popup/types";

describe("Popup Widget UI Components", () => {
  it("PopupTypeGallery renders all template options and responds to click", () => {
    const onSelect = vi.fn();
    render(
      <PopupTypeGallery
        selectedTemplate="classic"
        onSelectTemplate={onSelect}
      />
    );

    expect(screen.getByText("Choose a Popup Type")).toBeDefined();
    expect(screen.getByText("1. Classic Center Modal")).toBeDefined();
    expect(screen.getByText("2. Image Hero Popup")).toBeDefined();
    expect(screen.getByText("3. Split Image & Content")).toBeDefined();
    expect(screen.getByText("4. Discount Offer")).toBeDefined();
    expect(screen.getByText("5. Minimal Elegant")).toBeDefined();
    expect(screen.getByText("6. Newsletter Signup")).toBeDefined();
    expect(screen.getByText("7. Side Slide-In")).toBeDefined();
    expect(screen.getByText("8. Announcement Popup")).toBeDefined();

    // Click on Newsletter template
    fireEvent.click(screen.getByText("6. Newsletter Signup"));
    expect(onSelect).toHaveBeenCalled();
  });

  it("PopupLivePreview renders preview-only canvas with device controls and no bottom cards", () => {
    const onViewportChange = vi.fn();

    render(
      <PopupLivePreview
        config={DEFAULT_POPUP_CONFIG}
        viewport="desktop"
        onViewportChange={onViewportChange}
      />
    );

    // Header & Sample website elements
    expect(screen.getByText("Live Preview")).toBeDefined();
    expect(screen.getByText("Your Website")).toBeDefined();
    expect(screen.getByText("Build Amazing Websites")).toBeDefined();

    // Rendered popup content
    expect(screen.getByText("Special Offer! 🎉")).toBeDefined();
    expect(screen.getByText("Shop Now")).toBeDefined();

    // Device switchers & refresh button exist
    expect(screen.getByText("Refresh Preview")).toBeDefined();
    expect(screen.getByLabelText("Desktop preview")).toBeDefined();
    expect(screen.getByLabelText("Tablet preview")).toBeDefined();
    expect(screen.getByLabelText("Mobile preview")).toBeDefined();

    // Confirm NO configuration cards exist below preview
    expect(screen.queryByText("Popup Position")).toBeNull();
    expect(screen.queryByText("Popup Size")).toBeNull();
    expect(screen.queryByText("Overlay Style")).toBeNull();
  });

  it("PopupLivePreview renders distinct layout for Split template with image & CTA", () => {
    render(
      <PopupLivePreview
        config={{
          ...DEFAULT_POPUP_CONFIG,
          templateId: "split",
          title: "VIP Exclusive Access",
          discountBadge: "MEMBERS ONLY",
          couponCode: "VIPCLUB",
        }}
        viewport="desktop"
        onViewportChange={vi.fn()}
      />
    );

    expect(screen.getByText("VIP Exclusive Access")).toBeDefined();
    expect(screen.getByText("MEMBERS ONLY")).toBeDefined();
    expect(screen.getByText("VIPCLUB")).toBeDefined();
  });

  it("PopupConfigTabs renders 3 modern configuration tabs (Designs, Content, Preferences) and allows editing title", () => {
    const onUpdate = vi.fn();
    const onReset = vi.fn();

    render(
      <PopupConfigTabs
        config={DEFAULT_POPUP_CONFIG}
        widgetId="test_popup_123"
        updateConfig={onUpdate}
        onResetDefaults={onReset}
        defaultTab="content"
      />
    );

    // Modern 3 Tab buttons exist
    expect(screen.getByRole("tab", { name: "Designs" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "Content" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "Preferences" })).toBeDefined();

    // Content tab elements
    expect(screen.getByText("Basic Content")).toBeDefined();
    expect(screen.getByDisplayValue("Special Offer! 🎉")).toBeDefined();

    const titleInput = screen.getByDisplayValue("Special Offer! 🎉");
    fireEvent.change(titleInput, { target: { value: "Mega Sale 50% Off!" } });
    expect(onUpdate).toHaveBeenCalledWith("title", "Mega Sale 50% Off!");
  });

  it("PopupConfigTabs allows selecting a design in Designs tab", () => {
    const onSelectTemplate = vi.fn();

    render(
      <PopupConfigTabs
        config={DEFAULT_POPUP_CONFIG}
        widgetId="test_popup_123"
        updateConfig={vi.fn()}
        onResetDefaults={vi.fn()}
        onSelectTemplate={onSelectTemplate}
        defaultTab="designs"
      />
    );

    // Check designs tab content
    expect(screen.getByText("Select Popup Design")).toBeDefined();
    expect(screen.getByText("1. Classic Center Modal")).toBeDefined();
    expect(screen.getByText("3. Split Image & Content")).toBeDefined();
    expect(screen.getByText("4. Discount Offer")).toBeDefined();

    // Click on Split design
    fireEvent.click(screen.getByText("3. Split Image & Content"));
    expect(onSelectTemplate).toHaveBeenCalled();
  });

  it("PopupInstallModal renders simplified modal with standard embed script and copy button", () => {
    render(
      <PopupInstallModal
        isOpen={true}
        onClose={vi.fn()}
        widgetId="wto_popup_test_id"
        config={DEFAULT_POPUP_CONFIG}
      />
    );

    expect(screen.getByText("Install Widget")).toBeDefined();
    expect(screen.getByText(/data-widget-id="wto_popup_test_id"/)).toBeDefined();
    expect(screen.getByText("Copy Code")).toBeDefined();
    expect(screen.getByText("Done")).toBeDefined();
    expect(screen.queryByText("Architecture & Hosting Transparency Note")).toBeNull();
  });
});
