import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PhoneInput } from "@/components/whatsapp/PhoneInput";
import { WhatsAppLivePreview } from "@/components/whatsapp/WhatsAppLivePreview";
import { WhatsAppControls } from "@/components/whatsapp/WhatsAppControls";
import { WhatsAppInstallModal } from "@/components/whatsapp/WhatsAppInstallModal";
import { DEFAULT_WHATSAPP_CONFIG } from "@/lib/whatsapp/types";

describe("WhatsApp UI Components", () => {
  it("PhoneInput renders India by default and formats as typed", () => {
    const onNumChange = vi.fn();
    const onCountryChange = vi.fn();

    render(
      <PhoneInput
        countryCode="IN"
        nationalNumber="9876543210"
        onCountryChange={onCountryChange}
        onNumberChange={onNumChange}
      />
    );

    expect(screen.getByText("+91")).toBeDefined();
    const input = screen.getByDisplayValue("9876543210") as HTMLInputElement;
    expect(input).toBeDefined();

    // Type a new number
    fireEvent.change(input, { target: { value: "9876500000" } });
    expect(onNumChange).toHaveBeenCalled();
  });

  it("PhoneInput shows inline error when showErrorAlways is true and number is empty", () => {
    render(
      <PhoneInput
        countryCode="IN"
        nationalNumber=""
        onCountryChange={() => {}}
        onNumberChange={() => {}}
        showErrorAlways={true}
      />
    );

    expect(screen.getByText(/WhatsApp phone number is required/i)).toBeDefined();
  });

  it("WhatsAppLivePreview renders website mockup and floating widget", () => {
    render(
      <WhatsAppLivePreview
        config={DEFAULT_WHATSAPP_CONFIG}
        viewport="desktop"
      />
    );

    // Top text header is removed
    expect(screen.queryByText("Live Preview")).toBeNull();
    expect(screen.queryByText("See how your WhatsApp widget will look on your website.")).toBeNull();
    expect(screen.queryByText("Refresh Preview")).toBeNull();

    // Integrated icon controls exist
    expect(screen.getByLabelText("Desktop preview")).toBeDefined();
    expect(screen.getByLabelText("Tablet preview")).toBeDefined();
    expect(screen.getByLabelText("Mobile preview")).toBeDefined();
    expect(screen.getByLabelText("Refresh preview")).toBeDefined();

    // Mockup elements
    expect(screen.getByText("Your Website")).toBeDefined();
    expect(screen.getByText("Create Amazing Experiences")).toBeDefined();
    expect(screen.getByText("Priya Sharma")).toBeDefined();
    expect(screen.getByText("Support Team")).toBeDefined();
    expect(screen.getByText(/Hi there!/i)).toBeDefined();
    expect(screen.getByText("Chat with us")).toBeDefined();
  });

  it("WhatsAppControls renders position options and size buttons", () => {
    const onPos = vi.fn();
    const onSize = vi.fn();
    const onIcon = vi.fn();
    const onCustomIcon = vi.fn();

    render(
      <WhatsAppControls
        position="bottom-right"
        onPositionChange={onPos}
        buttonSize="medium"
        onButtonSizeChange={onSize}
        buttonIcon="whatsapp"
        onButtonIconChange={onIcon}
        customIconUrl=""
        onCustomIconChange={onCustomIcon}
      />
    );

    expect(screen.getByText("Position")).toBeDefined();
    expect(screen.getByText("Bottom Right")).toBeDefined();
    expect(screen.getByText("Bottom Left")).toBeDefined();
    expect(screen.getByText("Top Left")).toBeDefined();
    expect(screen.getByText("Top Right")).toBeDefined();

    // Click Top Left
    fireEvent.click(screen.getByText("Top Left"));
    expect(onPos).toHaveBeenCalledWith("top-left");

    // Click Small size
    fireEvent.click(screen.getByText("small"));
    expect(onSize).toHaveBeenCalledWith("small");
  });

  it("WhatsAppInstallModal displays correct embed code with widget id", () => {
    render(
      <WhatsAppInstallModal
        open={true}
        onOpenChange={() => {}}
        widgetId="wto_test_999"
        config={DEFAULT_WHATSAPP_CONFIG}
      />
    );

    expect(screen.getByText("Install WhatsApp Widget")).toBeDefined();
    expect(screen.getByText("wto_test_999")).toBeDefined();
    expect(screen.getByText(/data-widget-id="wto_test_999"/)).toBeDefined();
    expect(screen.getByText("Copy Code")).toBeDefined();
  });
});
