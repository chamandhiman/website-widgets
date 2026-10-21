import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PopupTypeGallery } from "@/components/popup/PopupTypeGallery";
import { PopupLivePreview } from "@/components/popup/PopupLivePreview";
import { PopupConfigTabs } from "@/components/popup/PopupConfigTabs";
import { PopupInstallModal } from "@/components/popup/PopupInstallModal";
import { DEFAULT_POPUP_CONFIG } from "@/lib/popup/types";

describe("Popup Widget UI Components", () => {
  it("PopupTypeGallery renders all 10 template options and responds to click", () => {
    const onSelect = vi.fn();
    render(
      <PopupTypeGallery
        selectedTemplate="center"
        onSelectTemplate={onSelect}
      />
    );

    expect(screen.getByText("Choose a Popup Type")).toBeDefined();
    expect(screen.getByText("1. Center Popup")).toBeDefined();
    expect(screen.getByText("2. Newsletter Popup")).toBeDefined();
    expect(screen.getByText("3. Image Popup")).toBeDefined();
    expect(screen.getByText("4. Bottom Small")).toBeDefined();
    expect(screen.getByText("5. Slide In Popup")).toBeDefined();
    expect(screen.getByText("6. Exit Intent Popup")).toBeDefined();
    expect(screen.getByText("7. Announcement")).toBeDefined();
    expect(screen.getByText("8. Video Popup")).toBeDefined();
    expect(screen.getByText("9. Age Verification")).toBeDefined();
    expect(screen.getByText("10. Custom HTML")).toBeDefined();

    // Click on Newsletter template
    fireEvent.click(screen.getByText("2. Newsletter Popup"));
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

  it("PopupConfigTabs renders 4 configuration tabs and allows editing title", () => {
    const onUpdate = vi.fn();
    const onReset = vi.fn();

    render(
      <PopupConfigTabs
        config={DEFAULT_POPUP_CONFIG}
        widgetId="test_popup_123"
        updateConfig={onUpdate}
        onResetDefaults={onReset}
      />
    );

    // Tab buttons exist
    expect(screen.getByRole("tab", { name: "Setup" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "Style" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "Position" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "Trigger" })).toBeDefined();

    // Setup tab elements
    expect(screen.getByText("Popup Style")).toBeDefined();
    expect(screen.getByDisplayValue("Special Offer! 🎉")).toBeDefined();

    const titleInput = screen.getByDisplayValue("Special Offer! 🎉");
    fireEvent.change(titleInput, { target: { value: "Mega Sale 50% Off!" } });
    expect(onUpdate).toHaveBeenCalledWith("title", "Mega Sale 50% Off!");
  });

  it("PopupInstallModal displays widget ID and script snippet", () => {
    render(
      <PopupInstallModal
        isOpen={true}
        onClose={vi.fn()}
        widgetId="wto_popup_test_id"
        config={DEFAULT_POPUP_CONFIG}
      />
    );

    expect(screen.getByText("Install Popup Widget")).toBeDefined();
    expect(screen.getByText("wto_popup_test_id")).toBeDefined();
    expect(screen.getByText(/data-widget-id="wto_popup_test_id"/)).toBeDefined();
  });
});
