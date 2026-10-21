import { describe, expect, it } from "vitest";
import { ALL_COUNTRIES, findCountry } from "@/lib/whatsapp/countries";
import {
  validatePhoneNumber,
  formatAsYouType,
  normalizePastedInput,
  generateWhatsAppLink,
  maskPhoneNumber,
} from "@/lib/whatsapp/phone";

describe("WhatsApp Phone Validation and Handling", () => {
  it("defaults to India (+91) with correct metadata", () => {
    const inCountry = findCountry("IN");
    expect(inCountry).toBeDefined();
    expect(inCountry?.callingCode).toBe("91");
    expect(inCountry?.name).toBe("India");
    expect(inCountry?.flag).toBe("🇮🇳");
  });

  it("identifies empty phone numbers and provides required error", () => {
    const result = validatePhoneNumber("", "IN");
    expect(result.isValid).toBe(false);
    expect(result.isEmpty).toBe(true);
    expect(result.error).toContain("required");
  });

  it("identifies incomplete numbers and rejects them", () => {
    const result = validatePhoneNumber("98765", "IN");
    expect(result.isValid).toBe(false);
    expect(result.isIncomplete).toBe(true);
    expect(result.error).toContain("incomplete");
  });

  it("rejects invalid numbers for the selected country", () => {
    const result = validatePhoneNumber("0000000000", "IN");
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("valid");
  });

  it("accepts valid Indian phone numbers", () => {
    const result = validatePhoneNumber("9876543210", "IN");
    expect(result.isValid).toBe(true);
    expect(result.digitsOnly).toBe("919876543210");
    expect(result.e164).toBe("+919876543210");
  });

  it("formats numbers as user types according to country plan", () => {
    const formatted = formatAsYouType("9876543210", "IN");
    expect(formatted).toBe("(987)-654-3210");
  });

  it("normalizes pasted numbers with spaces, parentheses, hyphens, and leading +", () => {
    const pasted = normalizePastedInput("+91 (987) 65-43210", "IN");
    expect(pasted.nationalNumber.replace(/\D/g, "")).toBe("9876543210");
  });

  it("prevents duplicate country code when user pastes with international prefix", () => {
    const pasted = normalizePastedInput("+91 (987)-654-3210", "IN");
    // Should detect country or strip redundant 91
    expect(pasted.nationalNumber.replace(/\D/g, "")).toBe("9876543210");
    expect(pasted.nationalNumber).not.toContain("9191");
  });

  it("detects country change when user pastes international number for another country", () => {
    const pasted = normalizePastedInput("+1 415 555 2671", "IN");
    expect(pasted.detectedCountry).toBe("US");
    expect(pasted.nationalNumber.replace(/\D/g, "")).toBe("4155552671");
  });

  it("generates correct WhatsApp wa.me links with normalized digits and encoded text", () => {
    const link = generateWhatsAppLink("9876543210", "IN", "Hello! How can we help you?");
    expect(link).toBe("https://wa.me/919876543210?text=Hello!%20How%20can%20we%20help%20you%3F");

    // Pre-filled message with emojis & special characters
    const complexLink = generateWhatsAppLink("9876543210", "IN", "Hi there 👋 How can we help?");
    expect(complexLink).toContain("https://wa.me/919876543210?text=Hi%20there%20%F0%9F%91%8B%20How%20can%20we%20help%3F");
  });

  it("refuses to generate a working WhatsApp destination from an invalid number", () => {
    const link = generateWhatsAppLink("123", "IN", "Hi");
    expect(link).toBeNull();
  });

  it("masks phone numbers cleanly for saved summaries", () => {
    const masked = maskPhoneNumber("9876543210", "91");
    expect(masked).toBe("+91 98••• 3210");
    expect(masked).not.toContain("9876543210");
  });
});
