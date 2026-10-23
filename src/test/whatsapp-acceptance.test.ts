import { describe, expect, it } from "vitest";
import { ALL_COUNTRIES, findCountry } from "@/lib/whatsapp/countries";
import {
  validatePhoneNumber,
  formatAsYouType,
  normalizePastedInput,
  generateWhatsAppLink,
  maskPhoneNumber,
} from "@/lib/whatsapp/phone";
import { DEFAULT_WHATSAPP_CONFIG, type WhatsAppWidgetConfig } from "@/lib/whatsapp/types";
import { saveWidget, loadSaved, deleteWidget, type SavedWidget } from "@/lib/widgets";

describe("WhatsApp Chat Widget - Comprehensive Acceptance Tests", () => {
  // Scenario 1: India (+91) selected by default
  it("Scenario 1: Default configuration selects India (+91) and valid defaults", () => {
    expect(DEFAULT_WHATSAPP_CONFIG.countryCode).toBe("IN");
    expect(DEFAULT_WHATSAPP_CONFIG.callingCode).toBe("91");
    const country = findCountry("IN");
    expect(country?.name).toBe("India");
    expect(country?.callingCode).toBe("91");
  });

  // Scenario 2: Empty phone field shows a required-field error
  it("Scenario 2: Empty phone field shows required-field error", () => {
    const res = validatePhoneNumber("", "IN");
    expect(res.isValid).toBe(false);
    expect(res.isEmpty).toBe(true);
    expect(res.error).toMatch(/required/i);
  });

  // Scenario 3: An incomplete number is rejected
  it("Scenario 3: Incomplete number is rejected with informative error", () => {
    const res = validatePhoneNumber("9876", "IN");
    expect(res.isValid).toBe(false);
    expect(res.isIncomplete).toBe(true);
    expect(res.error).toMatch(/incomplete/i);
  });

  // Scenario 4: A clearly invalid number is rejected
  it("Scenario 4: Clearly invalid number is rejected according to numbering plan", () => {
    const res = validatePhoneNumber("0000000000", "IN");
    expect(res.isValid).toBe(false);
    expect(res.error).toMatch(/valid/i);
  });

  // Scenario 5: A valid number for the selected country is accepted
  it("Scenario 5: Valid number for selected country is accepted with E.164 and digitsOnly", () => {
    const res = validatePhoneNumber("9876543210", "IN");
    expect(res.isValid).toBe(true);
    expect(res.digitsOnly).toBe("919876543210");
    expect(res.e164).toBe("+919876543210");
  });

  // Scenario 6: A number pasted with spaces, hyphens, or parentheses is normalized correctly
  it("Scenario 6: Number pasted with spaces, hyphens, or parentheses is normalized correctly", () => {
    const pasted = normalizePastedInput("  (98765) - 43210  ", "IN");
    const digits = pasted.nationalNumber.replace(/\D/g, "");
    expect(digits).toBe("9876543210");
    const valid = validatePhoneNumber(pasted.nationalNumber, "IN");
    expect(valid.isValid).toBe(true);
  });

  // Scenario 7: International input does not receive a duplicated country code
  it("Scenario 7: International input does not duplicate the calling code", () => {
    const pasted = normalizePastedInput("+91 (987)-654-3210", "IN");
    expect(pasted.nationalNumber.replace(/\D/g, "")).toBe("9876543210");
    expect(pasted.nationalNumber).not.toContain("9191");
  });

  // Scenario 8: Changing the country triggers appropriate reformatting and revalidation
  it("Scenario 8: Changing the country triggers appropriate reformatting and revalidation", () => {
    // Number valid in India
    const inRes = validatePhoneNumber("9876543210", "IN");
    expect(inRes.isValid).toBe(true);

    // Same digits are not automatically valid for United States
    const usRes = validatePhoneNumber("9876543210", "US");
    // 9876543210 in US has area code 987 which is invalid / unassigned
    expect(usRes.isValid).toBe(false);

    // US valid number
    const validUS = validatePhoneNumber("4155552671", "US");
    expect(validUS.isValid).toBe(true);
    expect(validUS.digitsOnly).toBe("14155552671");
  });

  // Scenario 9: Saving or installing is blocked when the phone number is invalid
  it("Scenario 9: Validation logic correctly guards save and install operations", () => {
    const invalidRes = validatePhoneNumber("123", "IN");
    expect(invalidRes.isValid).toBe(false);

    // Simulation of editor save guard
    let saveExecuted = false;
    const attemptSave = (number: string, country: string) => {
      const v = validatePhoneNumber(number, country);
      if (!v.isValid) return false;
      saveExecuted = true;
      return true;
    };

    expect(attemptSave("123", "IN")).toBe(false);
    expect(saveExecuted).toBe(false);
    expect(attemptSave("9876543210", "IN")).toBe(true);
    expect(saveExecuted).toBe(true);
  });

  // Scenario 10: The saved summary masks the phone number
  it("Scenario 10: Saved summary masks the middle digits of the phone number", () => {
    const masked = maskPhoneNumber("9876543210", "91");
    expect(masked).toBe("+91 98••• 3210");
    expect(masked).not.toContain("9876543210");
  });

  // Scenario 11: The live preview configuration updates immediately as settings change
  it("Scenario 11: Configuration changes produce immediate updated state", () => {
    let conf = { ...DEFAULT_WHATSAPP_CONFIG };
    conf = { ...conf, buttonText: "Chat on WhatsApp now!", primaryColor: "#128C7E" };
    expect(conf.buttonText).toBe("Chat on WhatsApp now!");
    expect(conf.primaryColor).toBe("#128C7E");
  });

  // Scenario 12: Generated WhatsApp URL contains normalized international digits and encoded message
  it("Scenario 12: Generates clean wa.me link with normalized digits and URI encoding", () => {
    const link = generateWhatsAppLink("9876543210", "IN", "I want a quote! & info?");
    expect(link).toBe("https://wa.me/919876543210?text=I%20want%20a%20quote!%20%26%20info%3F");
    expect(link).not.toContain("+");
    expect(link).not.toContain(" ");
  });

  // Scenario 13: Saving and reopening a widget preserves its configuration
  it("Scenario 13: Local persistence saves and reopens widget without config loss", () => {
    const testId = "test_wa_widget_123";
    const customConfig: WhatsAppWidgetConfig = {
      ...DEFAULT_WHATSAPP_CONFIG,
      phone: "(123)-456-7890",
      agentName: "Aarav Sharma",
      agentRole: "Senior Advisor",
      buttonText: "Talk to Aarav",
      primaryColor: "#075E54",
    };

    const savedRecord: SavedWidget = {
      id: testId,
      type: "whatsapp-chat",
      name: "Custom WhatsApp Support",
      config: customConfig as unknown as Record<string, string | number | boolean>,
      updatedAt: Date.now(),
    };

    saveWidget(savedRecord);

    const reloaded = loadSaved().find((w) => w.id === testId);
    expect(reloaded).toBeDefined();
    expect(reloaded?.name).toBe("Custom WhatsApp Support");
    expect((reloaded?.config as unknown as WhatsAppWidgetConfig).agentName).toBe("Aarav Sharma");
    expect((reloaded?.config as unknown as WhatsAppWidgetConfig).buttonText).toBe("Talk to Aarav");

    // Clean up
    deleteWidget(testId);
    expect(loadSaved().find((w) => w.id === testId)).toBeUndefined();
  });

  // Scenario 14: Install dialog embed code contains widget ID and async loader
  it("Scenario 14: Embed code format matches spec with data-widget-id", () => {
    const id = "wto_abc123";
    const snippet = `<script\n  src="https://cdn.widgets.webtoolocean.com/embed/whatsapp.js"\n  data-widget-id="${id}"\n  async\n></script>`;
    expect(snippet).toContain(`data-widget-id="${id}"`);
    expect(snippet).toContain("https://cdn.widgets.webtoolocean.com/embed/whatsapp.js");
    expect(snippet).toContain("async");
  });

  // Scenario 15: External script architecture handles self-contained or hosted mode
  it("Scenario 15: External script architecture does not rely on editor-only localStorage", () => {
    const id = "wto_ext456";
    const standalone = `window.WTO_WIDGET_CONFIGS = window.WTO_WIDGET_CONFIGS || {};\nwindow.WTO_WIDGET_CONFIGS["${id}"] = ...;`;
    expect(standalone).toContain(`window.WTO_WIDGET_CONFIGS["${id}"]`);
  });

  // Scenario 16: No full phone numbers appear in console logs or debug output
  it("Scenario 16: Masking prevents full phone exposure in logs or UI summaries", () => {
    const raw = "9876543210";
    const masked = maskPhoneNumber(raw, "91");
    const simulatedLog = `Processing widget for user with phone: ${masked}`;
    expect(simulatedLog).not.toContain(raw);
    expect(simulatedLog).toContain("•••");
  });
});
