import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Megaphone } from "lucide-react";
import { WidgetEditorHeader } from "@/components/editor/WidgetEditorHeader";

describe("WidgetEditorHeader Component", () => {
  it("renders back arrow button with tooltip and title", () => {
    const handleBack = vi.fn();
    render(
      <WidgetEditorHeader
        onBack={handleBack}
        backTooltip="Back to widgets"
        icon={<Megaphone data-testid="icon" />}
        title="Announcement Bar"
        subtitle="Create and customize an announcement bar for your website."
        statusText="Ready"
        onInstall={() => {}}
        onPublish={() => {}}
      />
    );

    // Back arrow button with aria-label
    const backBtn = screen.getByLabelText("Back to widgets");
    expect(backBtn).toBeDefined();

    fireEvent.click(backBtn);
    expect(handleBack).toHaveBeenCalledTimes(1);

    // Check widget title & badge
    expect(screen.getByText("Announcement Bar")).toBeDefined();
    expect(screen.getByText("Ready")).toBeDefined();
    expect(
      screen.getByText("Create and customize an announcement bar for your website.")
    ).toBeDefined();

    // Action buttons
    expect(screen.getByText("Install Widget")).toBeDefined();
    expect(screen.getByText("Publish")).toBeDefined();
  });

  it("calls onInstall when Install Widget button is clicked", () => {
    const handleInstall = vi.fn();
    render(
      <WidgetEditorHeader
        onBack={() => {}}
        icon={<Megaphone />}
        title="WhatsApp Chat"
        onInstall={handleInstall}
        onPublish={() => {}}
      />
    );

    const installBtn = screen.getByRole("button", { name: /install widget/i });
    fireEvent.click(installBtn);
    expect(handleInstall).toHaveBeenCalledTimes(1);
  });

  it("calls onPublish when Publish button is clicked", () => {
    const handlePublish = vi.fn();
    render(
      <WidgetEditorHeader
        onBack={() => {}}
        icon={<Megaphone />}
        title="Announcement Bar"
        onInstall={() => {}}
        onPublish={handlePublish}
      />
    );

    const publishBtn = screen.getByRole("button", { name: /publish/i });
    fireEvent.click(publishBtn);
    expect(handlePublish).toHaveBeenCalledTimes(1);
  });

  it("disables Publish button and shows publishing spinner when isPublishing is true", () => {
    const handlePublish = vi.fn();
    render(
      <WidgetEditorHeader
        onBack={() => {}}
        icon={<Megaphone />}
        title="Announcement Bar"
        isPublishing={true}
        onInstall={() => {}}
        onPublish={handlePublish}
      />
    );

    const publishBtn = screen.getByRole("button", { name: /publishing.../i });
    expect(publishBtn).toBeDefined();
    expect(publishBtn.hasAttribute("disabled")).toBe(true);

    // Clicking when disabled should not trigger onPublish (duplicate prevention)
    fireEvent.click(publishBtn);
    expect(handlePublish).not.toHaveBeenCalled();
  });
});
