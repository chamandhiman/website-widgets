import {
  parsePhoneNumberFromString,
  isValidPhoneNumber,
  type CountryCode,
} from "libphonenumber-js/max";
import { findCountry } from "./countries";

export interface PhoneValidationResult {
  isValid: boolean;
  isIncomplete: boolean;
  isEmpty: boolean;
  error?: string;
  e164?: string;
  digitsOnly?: string;
  formatted?: string;
  example?: string;
}

/**
 * Formats a phone number strictly as (123)-456-7890 with numbers only, max 10 digits.
 */
export function formatTenDigitPhoneNumber(raw: string): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)})-${digits.slice(3)}`;
  return `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

/**
 * Format a national phone number as user types strictly as (123)-456-7890.
 */
export function formatAsYouType(raw: string, _countryCode?: string): string {
  return formatTenDigitPhoneNumber(raw);
}

/**
 * Normalizes pasted or typed input to strictly 10 digits formatted as (123)-456-7890.
 */
export function normalizePastedInput(
  rawInput: string,
  currentCountryCode: string
): { detectedCountry?: string; nationalNumber: string } {
  const trimmed = rawInput.trim();

  // If input starts with "+", attempt to parse full international number
  if (trimmed.startsWith("+")) {
    const parsed = parsePhoneNumberFromString(trimmed);
    if (parsed && parsed.country) {
      const natDigits = (parsed.nationalNumber || "").replace(/\D/g, "").slice(0, 10);
      return {
        detectedCountry: parsed.country,
        nationalNumber: formatTenDigitPhoneNumber(natDigits),
      };
    }
  }

  // Check if user accidentally pasted the selected calling code at the beginning
  const currCountry = findCountry(currentCountryCode);
  if (currCountry) {
    const allDigits = trimmed.replace(/\D/g, "");
    if (allDigits.startsWith(currCountry.callingCode) && allDigits.length > currCountry.callingCode.length + 5) {
      const stripped = allDigits.slice(currCountry.callingCode.length).slice(0, 10);
      return {
        nationalNumber: formatTenDigitPhoneNumber(stripped),
      };
    }
  }

  const digits = trimmed.replace(/\D/g, "").slice(0, 10);
  return {
    nationalNumber: formatTenDigitPhoneNumber(digits),
  };
}

/**
 * Validates a 10-digit phone number.
 */
export function validatePhoneNumber(
  rawNationalNumber: string,
  countryCode: string
): PhoneValidationResult {
  const country = findCountry(countryCode);
  const countryName = country?.name || countryCode;
  const callingCode = country?.callingCode || "91";
  const example = "(123)-456-7890";

  const digits = rawNationalNumber.replace(/\D/g, "").slice(0, 10);

  if (!digits) {
    return {
      isValid: false,
      isIncomplete: false,
      isEmpty: true,
      error: "WhatsApp phone number is required.",
      example,
    };
  }

  if (digits.length < 10) {
    return {
      isValid: false,
      isIncomplete: true,
      isEmpty: false,
      error: `Phone number is incomplete (expected 10 digits: ${example}).`,
      example,
    };
  }

  // Reject clearly invalid numbers like all zeros "0000000000" or starting with 0
  if (/^0+$/.test(digits) || digits === "0000000000") {
    return {
      isValid: false,
      isIncomplete: false,
      isEmpty: false,
      error: `Please enter a valid phone number for ${countryName} (e.g. +${callingCode} ${example}).`,
      example,
    };
  }

  // Validate with libphonenumber numbering plan
  const fullIntl = `+${callingCode}${digits}`;
  const iso = countryCode.toUpperCase() as CountryCode;
  const parsed = parsePhoneNumberFromString(fullIntl, iso);
  const isValid = Boolean(parsed && parsed.isValid() && isValidPhoneNumber(fullIntl, iso));

  if (!isValid) {
    return {
      isValid: false,
      isIncomplete: false,
      isEmpty: false,
      error: `Please enter a valid phone number for ${countryName} (e.g. +${callingCode} ${example}).`,
      example,
    };
  }

  const e164 = `+${callingCode}${digits}`;
  const digitsOnly = `${callingCode}${digits}`;

  return {
    isValid: true,
    isIncomplete: false,
    isEmpty: false,
    e164,
    digitsOnly,
    formatted: formatTenDigitPhoneNumber(digits),
    example,
  };
}

/**
 * Generates the official WhatsApp wa.me destination link.
 * Uses normalized international digits with no '+', spaces, or dashes.
 * Returns null if the number is invalid.
 */
export function generateWhatsAppLink(
  rawNationalNumber: string,
  countryCode: string,
  prefilledMessage?: string
): string | null {
  const result = validatePhoneNumber(rawNationalNumber, countryCode);
  if (!result.isValid || !result.digitsOnly) {
    return null;
  }

  const baseUrl = `https://wa.me/${result.digitsOnly}`;
  if (prefilledMessage && prefilledMessage.trim()) {
    return `${baseUrl}?text=${encodeURIComponent(prefilledMessage.trim())}`;
  }
  return baseUrl;
}

/**
 * Masks a phone number for display in saved summaries.
 * E.g., "+91 (987)-654-3210" -> "+91 (98•)-•••-3210"
 */
export function maskPhoneNumber(phoneWithOrWithoutCode: string, callingCode?: string): string {
  if (!phoneWithOrWithoutCode) return "";

  const digits = phoneWithOrWithoutCode.replace(/\D/g, "");
  if (digits.length <= 4) return phoneWithOrWithoutCode;

  const prefix = callingCode ? `+${callingCode.replace(/\D/g, "")} ` : "";
  const first2 = digits.slice(0, 2);
  const last4 = digits.slice(-4);
  const maskedMiddle = "•••";

  return `${prefix}${first2}${maskedMiddle} ${last4}`;
}
