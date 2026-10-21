import { useState, useId, useMemo, useRef } from "react";
import { ChevronDown, Search, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { ALL_COUNTRIES, type CountryInfo, findCountry } from "@/lib/whatsapp/countries";
import {
  formatAsYouType,
  formatTenDigitPhoneNumber,
  normalizePastedInput,
  validatePhoneNumber,
  type PhoneValidationResult,
} from "@/lib/whatsapp/phone";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
  countryCode: string;
  nationalNumber: string;
  onCountryChange: (country: CountryInfo) => void;
  onNumberChange: (nationalNumber: string, validation: PhoneValidationResult) => void;
  onBlur?: () => void;
  showErrorAlways?: boolean;
}

const DEFAULT_FALLBACK_COUNTRY: CountryInfo = {
  code: "IN",
  name: "India",
  callingCode: "91",
  flag: "🇮🇳",
  example: "(123)-456-7890",
};

export function PhoneInput({
  countryCode,
  nationalNumber,
  onCountryChange,
  onNumberChange,
  onBlur,
  showErrorAlways = false,
}: PhoneInputProps) {
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [touched, setTouched] = useState(false);
  const [hideDigits, setHideDigits] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentCountry = useMemo(
    () => findCountry(countryCode) || ALL_COUNTRIES[0] || DEFAULT_FALLBACK_COUNTRY,
    [countryCode]
  );

  const validation = useMemo(
    () => validatePhoneNumber(nationalNumber, countryCode),
    [nationalNumber, countryCode]
  );

  const filteredCountries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ALL_COUNTRIES;
    return ALL_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.callingCode.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow action/navigation keys
    if (
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "Tab" ||
      e.key === "Escape" ||
      e.key === "Enter" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "Home" ||
      e.key === "End" ||
      e.ctrlKey ||
      e.metaKey
    ) {
      return;
    }

    // Numbers only
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    // Limit to strictly 10 digits
    const digits = nationalNumber.replace(/\D/g, "");
    const input = inputRef.current;
    const hasSelection =
      input &&
      input.selectionStart !== null &&
      input.selectionEnd !== null &&
      input.selectionStart !== input.selectionEnd;
    if (digits.length >= 10 && !hasSelection) {
      e.preventDefault();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const formatted = formatTenDigitPhoneNumber(rawVal);
    const validResult = validatePhoneNumber(formatted, countryCode);
    onNumberChange(formatted, validResult);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const normalized = normalizePastedInput(pastedText, countryCode);

    if (normalized.detectedCountry && normalized.detectedCountry !== countryCode) {
      const newCountry = findCountry(normalized.detectedCountry);
      if (newCountry) {
        onCountryChange(newCountry);
        const validResult = validatePhoneNumber(normalized.nationalNumber, newCountry.code);
        onNumberChange(normalized.nationalNumber, validResult);
        return;
      }
    }

    const validResult = validatePhoneNumber(normalized.nationalNumber, countryCode);
    onNumberChange(normalized.nationalNumber, validResult);
  };

  const handleCountrySelect = (c: CountryInfo) => {
    onCountryChange(c);
    setOpen(false);
    setSearch("");
    // Reformat and revalidate with new country
    const reformatted = formatAsYouType(nationalNumber, c.code);
    const validResult = validatePhoneNumber(reformatted, c.code);
    onNumberChange(reformatted, validResult);
    if (inputRef.current) inputRef.current.focus();
  };

  const showError = (touched || showErrorAlways) && !validation.isValid;
  const showSuccess = touched && validation.isValid;

  // Mask display value if user toggled privacy hide
  const displayValue = useMemo(() => {
    if (!hideDigits || !nationalNumber) return nationalNumber;
    return nationalNumber.replace(/\d/g, "•");
  }, [hideDigits, nationalNumber]);

  return (
    <div className="space-y-1.5">
      <div className="relative flex rounded-xl border bg-background shadow-xs transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        {/* Country Selector Dropdown */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 border-r px-3 py-2 text-sm font-medium hover:bg-muted/50 focus:outline-none"
              aria-label={`Select country, currently ${currentCountry.name} (+${currentCountry.callingCode})`}
            >
              <span className="text-xl leading-none">{currentCountry.flag}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground opacity-70" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2" align="start">
            <div className="mb-2 flex items-center gap-2 rounded-lg border bg-muted/40 px-2.5 py-1.5 text-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country or code..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto space-y-0.5">
              {filteredCountries.length === 0 ? (
                <div className="p-3 text-center text-xs text-muted-foreground">No countries found</div>
              ) : (
                filteredCountries.map((c) => {
                  const isSelected = c.code === currentCountry.code;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleCountrySelect(c)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                        isSelected && "bg-accent/60 font-semibold text-primary"
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-base">{c.flag}</span>
                        <span className="truncate">{c.name}</span>
                      </div>
                      <span className="ml-2 font-mono text-xs text-muted-foreground shrink-0">
                        +{c.callingCode}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Calling code prefix indicator */}
        <div className="flex items-center pl-3 pr-1 text-sm font-semibold text-muted-foreground select-none">
          +{currentCountry.callingCode}
        </div>

        {/* National Number Input */}
        <Input
          ref={inputRef}
          id={inputId}
          type={hideDigits ? "password" : "text"}
          inputMode="numeric"
          maxLength={14}
          value={hideDigits ? nationalNumber : displayValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={() => {
            setTouched(true);
            onBlur?.();
          }}
          placeholder="(123)-456-7890"
          className="border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm font-medium tracking-wide font-mono"
          aria-invalid={showError}
          aria-describedby={showError ? `${inputId}-error` : undefined}
        />

        {/* Privacy toggle / Validation icon */}
        <div className="flex items-center gap-1 pr-2.5">
          <button
            type="button"
            onClick={() => setHideDigits((h) => !h)}
            title={hideDigits ? "Reveal phone number" : "Hide phone number"}
            aria-label={hideDigits ? "Reveal phone number" : "Hide phone number"}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {hideDigits ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          {showSuccess && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
        </div>
      </div>

      {/* Inline validation errors or country-specific hint */}
      {showError ? (
        <p id={`${inputId}-error`} className="flex items-center gap-1.5 text-xs font-medium text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{validation.error}</span>
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Enter 10-digit WhatsApp number (e.g. +{currentCountry.callingCode} (123)-456-7890)
        </p>
      )}
    </div>
  );
}
