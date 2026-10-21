import { getCountries, getCountryCallingCode, type CountryCode } from "libphonenumber-js/max";

export interface CountryInfo {
  code: CountryCode;
  name: string;
  callingCode: string;
  flag: string;
  example: string;
}

const REGION_NAMES = new Intl.DisplayNames(["en"], { type: "region" });

function isoToFlagEmoji(iso: string): string {
  return String.fromCodePoint(...iso.toUpperCase().split("").map((c) => 127397 + c.charCodeAt(0)));
}

// Well-known phone examples for common countries
const KNOWN_EXAMPLES: Record<string, string> = {
  IN: "(123)-456-7890",
  US: "(555) 123-4567",
  GB: "7911 123456",
  CA: "(555) 123-4567",
  AU: "412 345 678",
  AE: "50 123 4567",
  SA: "50 123 4567",
  DE: "151 1234567",
  FR: "6 12 34 56 78",
  SG: "8123 4567",
  BR: "11 98765-4321",
  MX: "55 1234 5678",
  ZA: "71 123 4567",
  NG: "802 123 4567",
  PK: "300 1234567",
  BD: "1711-234567",
  ID: "812-3456-7890",
  MY: "12-345 6789",
  PH: "917 123 4567",
  NZ: "21 123 4567",
  JP: "90 1234 5678",
  ES: "612 34 56 78",
  IT: "312 345 6789",
  NL: "6 12345678",
  SE: "70 123 45 67",
  CH: "78 123 45 67",
  IE: "85 123 4567",
};

// Priority countries to show at the top of the selector list
const PRIORITY_CODES = ["IN", "US", "GB", "CA", "AU", "AE", "SA", "DE", "FR", "SG"];

export const ALL_COUNTRIES: CountryInfo[] = (() => {
  const allCodes = getCountries();
  const list: CountryInfo[] = [];

  for (const code of allCodes) {
    try {
      const callingCode = getCountryCallingCode(code);
      const name = REGION_NAMES.of(code) || code;
      const flag = isoToFlagEmoji(code);
      const example = KNOWN_EXAMPLES[code] || "(123)-456-7890";
      list.push({ code, name, callingCode, flag, example });
    } catch {
      // Ignore unsupported pseudo-regions
    }
  }

  // Sort: Priority countries first, then alphabetically by country name
  return list.sort((a, b) => {
    const aPriority = PRIORITY_CODES.indexOf(a.code);
    const bPriority = PRIORITY_CODES.indexOf(b.code);
    if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;
    if (aPriority !== -1) return -1;
    if (bPriority !== -1) return 1;
    return a.name.localeCompare(b.name);
  });
})();

export function findCountry(codeOrCallingCode: string): CountryInfo | undefined {
  const upper = codeOrCallingCode.toUpperCase().replace("+", "");
  return ALL_COUNTRIES.find((c) => c.code === upper || c.callingCode === upper);
}
