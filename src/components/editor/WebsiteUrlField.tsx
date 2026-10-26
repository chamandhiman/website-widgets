/**
 * WebsiteUrlField — shared Website URL input for all widget editors.
 *
 * Accepts an optional URL string, validates it, and surfaces inline errors.
 * Does not affect widget embed URLs or CDN configuration.
 */
import { Globe, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface WebsiteUrlFieldProps {
  value: string;
  onChange: (value: string) => void;
  /** Additional class names for the wrapper div */
  className?: string;
}

/**
 * Validate a website URL string.
 * Returns `null` if valid/empty, or an error message string if invalid.
 */
export function validateWebsiteUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null; // Optional field — blank is fine

  // Normalise bare domains like "example.com" → "https://example.com"
  const withProtocol = trimmed.includes("://") ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    // Must have a valid hostname with at least one dot
    if (!url.hostname || !url.hostname.includes(".")) {
      return "Enter a valid website domain, e.g. example.com";
    }
    return null;
  } catch {
    return "Enter a valid website URL, e.g. https://example.com";
  }
}

/**
 * Normalise user input so bare domains get https:// prepended when saving.
 * If the value is blank, returns "".
 */
export function normaliseWebsiteUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return trimmed.includes("://") ? trimmed : `https://${trimmed}`;
}

export function WebsiteUrlField({ value, onChange, className }: WebsiteUrlFieldProps) {
  const error = validateWebsiteUrl(value);
  const hasValue = value.trim().length > 0;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor="website-url-field" className="flex items-center gap-1.5 text-sm font-medium">
          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
          Website URL
          <span className="text-[11px] font-normal text-muted-foreground/70">(optional)</span>
        </Label>
        {hasValue && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear website URL"
            className="text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <Input
        id="website-url-field"
        type="url"
        inputMode="url"
        autoComplete="url"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://www.example.com"
        aria-describedby={error ? "website-url-error" : "website-url-hint"}
        className={cn(
          "h-9 text-sm",
          error ? "border-destructive/70 focus-visible:ring-destructive/40" : ""
        )}
      />

      {error ? (
        <p id="website-url-error" className="text-[11px] text-destructive leading-snug">
          {error}
        </p>
      ) : (
        <p id="website-url-hint" className="text-[11px] text-muted-foreground/70 leading-snug">
          Enter the website where you plan to use this widget.
        </p>
      )}
    </div>
  );
}
