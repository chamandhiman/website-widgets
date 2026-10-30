/**
 * Centralized Embed URL and Snippet Generator for WebToolOcean Widget Studio
 *
 * All widget embed scripts are hosted and served from:
 * https://cdn.widgets.webtoolocean.com/embed/{script-name}.js
 */

export const CDN_BASE_DOMAIN = "https://cdn.widgets.webtoolocean.com";
export const CDN_EMBED_BASE_URL = `${CDN_BASE_DOMAIN}/embed`;

const SCRIPT_NAME_MAP: Record<string, string> = {
  whatsapp: "whatsapp.js",
  "whatsapp-chat": "whatsapp.js",
  announcement: "announcement-bar.js",
  "announcement-bar": "announcement-bar.js",
  popup: "popup.js",
  "popup-widget": "popup.js",
  faq: "faq.js",
  "faq-accordion": "faq.js",
  countdown: "countdown.js",
  "countdown-timer": "countdown.js",
  "event-calendar": "event-calendar.js",
  calendar: "event-calendar.js",
  "testimonial-slider": "testimonial-slider.js",
  testimonials: "testimonial-slider.js",
  "logo-carousel": "logo-carousel.js",
  logos: "logo-carousel.js",
};

const CONFIG_WINDOW_KEY_MAP: Record<string, string> = {
  whatsapp: "WTO_WIDGET_CONFIGS",
  "whatsapp-chat": "WTO_WIDGET_CONFIGS",
  announcement: "WTO_ANNOUNCEMENT_CONFIGS",
  "announcement-bar": "WTO_ANNOUNCEMENT_CONFIGS",
  popup: "WTO_POPUP_CONFIGS",
  "popup-widget": "WTO_POPUP_CONFIGS",
  faq: "WTO_FAQ_CONFIGS",
  "faq-accordion": "WTO_FAQ_CONFIGS",
  countdown: "WTO_COUNTDOWN_CONFIGS",
  "countdown-timer": "WTO_COUNTDOWN_CONFIGS",
  "event-calendar": "WTO_EVENT_CALENDAR_CONFIGS",
  calendar: "WTO_EVENT_CALENDAR_CONFIGS",
  "testimonial-slider": "WTO_TESTIMONIAL_CONFIGS",
  testimonials: "WTO_TESTIMONIAL_CONFIGS",
  "logo-carousel": "WTO_LOGO_CAROUSEL_CONFIGS",
  logos: "WTO_LOGO_CAROUSEL_CONFIGS",
};

const WIDGET_DISPLAY_NAME_MAP: Record<string, string> = {
  whatsapp: "WhatsApp Chat",
  "whatsapp-chat": "WhatsApp Chat",
  announcement: "Announcement Bar",
  "announcement-bar": "Announcement Bar",
  popup: "Popup",
  "popup-widget": "Popup",
  faq: "FAQ Accordion",
  "faq-accordion": "FAQ Accordion",
  countdown: "Countdown Timer",
  "countdown-timer": "Countdown Timer",
  "event-calendar": "Event Calendar",
  calendar: "Event Calendar",
  "testimonial-slider": "Testimonial Slider",
  testimonials: "Testimonial Slider",
  "logo-carousel": "Logo Carousel",
  logos: "Logo Carousel",
};

/**
 * Returns the script filename for a given widget type.
 */
export function getWidgetScriptFileName(widgetType: string): string {
  const normalized = widgetType.toLowerCase().trim();
  return SCRIPT_NAME_MAP[normalized] ?? `${normalized}.js`;
}

/**
 * Returns the full embed script URL for a given widget type.
 * Supports switching between production CDN (cdn.widgets.webtoolocean.com) and local development origin.
 */
export function getWidgetScriptUrl(
  widgetType: string,
  options?: { hostMode?: "cdn" | "local"; localOrigin?: string }
): string {
  const fileName = getWidgetScriptFileName(widgetType);
  if (options?.hostMode === "local" && options.localOrigin) {
    const cleanOrigin = options.localOrigin.replace(/\/+$/, "");
    return `${cleanOrigin}/embed/${fileName}`;
  }
  return `${CDN_EMBED_BASE_URL}/${fileName}`;
}

export interface EmbedSnippetOptions {
  widgetType: string;
  widgetId: string;
  hostMode?: "cdn" | "local";
  localOrigin?: string;
}

/**
 * Generates the clean standard HTML script snippet for embedding a widget on external websites.
 * Output format matches:
 * <script
 *   src="https://cdn.widgets.webtoolocean.com/embed/{script}.js"
 *   data-widget-id="{widgetId}"
 *   async
 * ></script>
 */
export function getStandardEmbedSnippet({
  widgetType,
  widgetId,
  hostMode,
  localOrigin,
}: EmbedSnippetOptions): string {
  const scriptUrl = getWidgetScriptUrl(widgetType, { hostMode, localOrigin });
  return `<script
  src="${scriptUrl}"
  data-widget-id="${widgetId}"
  async
></script>`;
}

export interface StandaloneEmbedSnippetOptions extends EmbedSnippetOptions {
  config: unknown;
}

/**
 * Generates a self-contained inline configuration snippet for embedding without remote database dependency.
 */
export function getStandaloneEmbedSnippet({
  widgetType,
  widgetId,
  config,
  hostMode,
  localOrigin,
}: StandaloneEmbedSnippetOptions): string {
  const normalized = widgetType.toLowerCase().trim();
  const scriptUrl = getWidgetScriptUrl(widgetType, { hostMode, localOrigin });
  const windowKey = CONFIG_WINDOW_KEY_MAP[normalized] ?? "WTO_WIDGET_CONFIGS";
  const displayName = WIDGET_DISPLAY_NAME_MAP[normalized] ?? "Widget";
  const configJson = JSON.stringify(config, null, 2);

  return `<!-- WebToolOcean ${displayName} Widget -->
<script>
  window.${windowKey} = window.${windowKey} || {};
  window.${windowKey}["${widgetId}"] = ${configJson};
</script>
<script
  src="${scriptUrl}"
  data-widget-id="${widgetId}"
  async
></script>`;
}
