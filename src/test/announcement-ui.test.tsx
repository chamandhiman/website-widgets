import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AnnouncementTemplateGallery } from "@/components/announcement/AnnouncementTemplateGallery";
import { AnnouncementLivePreview } from "@/components/announcement/AnnouncementLivePreview";
import { AnnouncementFormControls } from "@/components/announcement/AnnouncementFormControls";
import { AnnouncementConfigTabs } from "@/components/announcement/AnnouncementConfigTabs";
import { AnnouncementInstallModal } from "@/components/announcement/AnnouncementInstallModal";
import { DEFAULT_ANNOUNCEMENT_CONFIG } from "@/lib/announcement/types";

describe("Announcement Bar UI Components", () => {
  it("AnnouncementTemplateGallery renders all 10 template options and responds to selection", () => {
    const onSelect = vi.fn();
    render(
      <AnnouncementTemplateGallery
        selectedTemplateId="classic"
        onSelectTemplate={onSelect}
      />
    );

    expect(screen.getByText("Choose a Design Template")).toBeDefined();
    expect(screen.getByText("1. Classic")).toBeDefined();
    expect(screen.getByText("2. With Button")).toBeDefined();
    expect(screen.getByText("3. Information")).toBeDefined();
    expect(screen.getByText("4. Success")).toBeDefined();
    expect(screen.getByText("5. Seasonal")).toBeDefined();
    expect(screen.getByText("6. Minimal")).toBeDefined();
    expect(screen.getByText("7. Gradient")).toBeDefined();
    expect(screen.getByText("8. Countdown")).toBeDefined();
    expect(screen.getByText("9. Announcement + Link")).toBeDefined();
    expect(screen.getByText("10. Multi-line")).toBeDefined();

    // Select Seasonal
    fireEvent.click(screen.getByText("5. Seasonal"));
    expect(onSelect).toHaveBeenCalled();
  });

  it("AnnouncementLivePreview renders sample website and bar with dummy branding", () => {
    render(
      <AnnouncementLivePreview
        config={DEFAULT_ANNOUNCEMENT_CONFIG}
        viewport="desktop"
      />
    );

    expect(screen.getByText("Live Preview")).toBeDefined();
    expect(screen.getByText("APEX")).toBeDefined();
    expect(screen.getByText("ACADEMY")).toBeDefined();
    expect(screen.getByText("STUDENT PORTAL")).toBeDefined();
    expect(screen.getByText("Modern Skills Academy")).toBeDefined();
    expect(screen.getByText(/2027 Winter and Spring Schedules/)).toBeDefined();
  });

  it("AnnouncementFormControls renders all 6 numbered configuration sections", () => {
    const onChange = vi.fn();
    render(
      <AnnouncementFormControls
        config={DEFAULT_ANNOUNCEMENT_CONFIG}
        onChange={onChange}
      />
    );

    // Section 1
    expect(screen.getByText("Content")).toBeDefined();
    // Section 2
    expect(screen.getByText("Action (Optional)")).toBeDefined();
    // Section 3
    expect(screen.getByText("Style")).toBeDefined();
    // Section 4
    expect(screen.getByText("Position")).toBeDefined();
    expect(screen.getByText("Top of Website")).toBeDefined();
    expect(screen.getByText("Bottom of Website")).toBeDefined();
    // Section 5
    expect(screen.getByText("Visibility")).toBeDefined();
    // Section 6
    expect(screen.getByText("Display Options")).toBeDefined();
    expect(screen.getByText("Show Close Button")).toBeDefined();
  });

  it("AnnouncementInstallModal renders widget ID, script snippets, and copy button", () => {
    render(
      <AnnouncementInstallModal
        open={true}
        onOpenChange={() => {}}
        widgetId="wto_announcement_demo_1"
        config={DEFAULT_ANNOUNCEMENT_CONFIG}
      />
    );

    expect(screen.getByText("Install Announcement Bar")).toBeDefined();
    expect(screen.getByText("wto_announcement_demo_1")).toBeDefined();
    expect(screen.getByText(/data-widget-id="wto_announcement_demo_1"/)).toBeDefined();
    expect(screen.getByText("Copy Code")).toBeDefined();
  });

  it("AnnouncementConfigTabs renders Design and Preferences tabs, template switches, and settings", () => {
    const onChange = vi.fn();
    const onSelectTemplate = vi.fn();

    render(
      <AnnouncementConfigTabs
        config={DEFAULT_ANNOUNCEMENT_CONFIG}
        onChange={onChange}
        onSelectTemplate={onSelectTemplate}
      />
    );

    // Two tabs exist
    expect(screen.getByRole("tab", { name: /Design/i })).toBeDefined();
    expect(screen.getByRole("tab", { name: /Preferences/i })).toBeDefined();

    // Design tab is active by default with switches
    expect(screen.getByText("Select Template Preset")).toBeDefined();
    expect(screen.getByRole("switch", { name: /Select 1. Classic/i })).toBeDefined();
    expect(screen.getByRole("switch", { name: /Select 2. With Button/i })).toBeDefined();

    // Switch to Preferences tab
    const prefTab = screen.getByRole("tab", { name: /Preferences/i });
    fireEvent.pointerDown(prefTab, { button: 0, ctrlKey: false });
    fireEvent.keyDown(prefTab, { key: "Enter" });

    // Settings sections appear
    expect(screen.getByText("Content")).toBeDefined();
    expect(screen.getByText("Announcement Text")).toBeDefined();
    expect(screen.getByText("Appearance")).toBeDefined();
    expect(screen.getByText("Position")).toBeDefined();
    expect(screen.getByText("Visibility")).toBeDefined();
    expect(screen.getByText("Display Options")).toBeDefined();
  });
});
