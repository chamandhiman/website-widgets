import {
  Star, Instagram, Facebook, MessageCircle, HelpCircle, Timer, Quote, Mail, PanelTop,
  CalendarDays, Share2, Youtube, Accessibility, Languages, MapPin, Megaphone, Code2,
  type LucideIcon,
} from "lucide-react";

export type Category = "Reviews" | "Social" | "Chat" | "Content" | "Forms" | "Promotion" | "Utility";
export type Kind = "page" | "floating";

export interface WidgetDef {
  type: string;
  name: string;
  description: string;
  category: Category;
  kind: Kind;
  icon: LucideIcon;
  ready: boolean;
}

export const PRIORITY_WIDGET_TYPES: readonly string[] = [
  "whatsapp-chat",
  "announcement-bar",
  "popup",
];

export function sortWidgetsByPriority(list: WidgetDef[]): WidgetDef[] {
  const priorityIndex = (type: string) => {
    const idx = PRIORITY_WIDGET_TYPES.indexOf(type);
    return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
  };

  return [...list].sort((a, b) => {
    const pa = priorityIndex(a.type);
    const pb = priorityIndex(b.type);
    if (pa !== pb) return pa - pb;
    return 0;
  });
}

const RAW_WIDGETS: WidgetDef[] = [
  { type: "google-reviews", name: "Google Reviews", description: "Show your best Google reviews to build trust.", category: "Reviews", kind: "page", icon: Star, ready: true },
  { type: "instagram-feed", name: "Instagram Feed", description: "Embed a stylish grid of your Instagram posts.", category: "Social", kind: "page", icon: Instagram, ready: false },
  { type: "facebook-feed", name: "Facebook Feed", description: "Display your Facebook page posts on your site.", category: "Social", kind: "page", icon: Facebook, ready: false },
  { type: "whatsapp-chat", name: "WhatsApp Chat", description: "Floating chat button that opens WhatsApp.", category: "Chat", kind: "floating", icon: MessageCircle, ready: true },
  { type: "faq", name: "FAQ Accordion", description: "Answer common questions in a tidy accordion.", category: "Content", kind: "page", icon: HelpCircle, ready: true },
  { type: "countdown", name: "Countdown Timer", description: "Create urgency with a live countdown.", category: "Promotion", kind: "page", icon: Timer, ready: true },
  { type: "testimonials", name: "Testimonials", description: "Highlight quotes from happy customers.", category: "Reviews", kind: "page", icon: Quote, ready: true },
  { type: "contact-form", name: "Contact Form", description: "Collect leads with a simple contact form.", category: "Forms", kind: "page", icon: Mail, ready: false },
  { type: "popup", name: "Popup Widget", description: "Create eye-catching popups to engage your visitors and increase conversions.", category: "Promotion", kind: "floating", icon: PanelTop, ready: true },
  { type: "event-calendar", name: "Event Calendar", description: "List upcoming events in a clean calendar.", category: "Content", kind: "page", icon: CalendarDays, ready: false },
  { type: "social-feed", name: "Social Media Feed", description: "Combine all your social channels in one feed.", category: "Social", kind: "page", icon: Share2, ready: false },
  { type: "youtube-gallery", name: "YouTube Gallery", description: "Showcase videos from your YouTube channel.", category: "Social", kind: "page", icon: Youtube, ready: false },
  { type: "accessibility", name: "Accessibility Widget", description: "Let visitors adjust contrast and text size.", category: "Utility", kind: "floating", icon: Accessibility, ready: false },
  { type: "language-switcher", name: "Language Switcher", description: "Floating menu to switch site language.", category: "Utility", kind: "floating", icon: Languages, ready: false },
  { type: "store-locator", name: "Store Locator", description: "Help customers find your nearest location.", category: "Utility", kind: "page", icon: MapPin, ready: false },
  { type: "announcement-bar", name: "Announcement Bar", description: "Slim top bar for news and promotions.", category: "Promotion", kind: "page", icon: Megaphone, ready: true },
  { type: "custom-html", name: "Custom HTML", description: "Drop in any custom HTML snippet.", category: "Utility", kind: "page", icon: Code2, ready: false },
];

export const WIDGETS: WidgetDef[] = sortWidgetsByPriority(RAW_WIDGETS);

export const CATEGORIES: ("All" | Category)[] = ["All", "Reviews", "Social", "Chat", "Content", "Forms", "Promotion", "Utility"];

export type FieldType = "text" | "textarea" | "color" | "select" | "range" | "toggle";
export type Group = "content" | "layout" | "theme";
export interface Field {
  key: string; label: string; type: FieldType; group: Group;
  options?: string[]; min?: number; max?: number; step?: number;
}
export type Config = Record<string, string | number | boolean>;

const common = (kind: Kind): Field[] => [
  ...(kind === "page"
    ? [{ key: "width", label: "Max width (px)", type: "range", group: "layout", min: 280, max: 1100, step: 10 } as Field]
    : []),
  { key: "radius", label: "Border radius", type: "range", group: "layout", min: 0, max: 32 },
  { key: "padding", label: "Spacing", type: "range", group: "layout", min: 4, max: 48 },
  { key: "accent", label: "Accent color", type: "color", group: "theme" },
  { key: "bg", label: "Background", type: "color", group: "theme" },
  { key: "text", label: "Text color", type: "color", group: "theme" },
];

const baseDefaults = { width: 720, radius: 16, padding: 24, accent: "#8b5cf6", bg: "#ffffff", text: "#1f2937" };

export const SCHEMAS: Record<string, { fields: Field[]; defaults: Config }> = {
  "google-reviews": {
    fields: [
      { key: "title", label: "Header title", type: "text", group: "content" },
      { key: "showHeader", label: "Show header", type: "toggle", group: "content" },
      { key: "showRating", label: "Show rating summary", type: "toggle", group: "content" },
      { key: "layout", label: "Review layout", type: "select", group: "layout", options: ["Grid", "List"] },
      { key: "columns", label: "Columns (grid)", type: "range", group: "layout", min: 1, max: 3 },
      { key: "starColor", label: "Star color", type: "color", group: "theme" },
    ],
    defaults: { ...baseDefaults, title: "What our customers say", showHeader: true, showRating: true, layout: "Grid", columns: 3, starColor: "#f59e0b" },
  },
  "whatsapp-chat": {
    fields: [
      { key: "phone", label: "WhatsApp number", type: "text", group: "content" },
      { key: "agent", label: "Agent name", type: "text", group: "content" },
      { key: "welcome", label: "Welcome text", type: "textarea", group: "content" },
      { key: "buttonText", label: "Button label", type: "text", group: "content" },
      { key: "position", label: "Floating position", type: "select", group: "layout", options: ["Bottom right", "Bottom left"] },
      { key: "startOpen", label: "Show chat bubble", type: "toggle", group: "layout" },
      { key: "buttonColor", label: "Button color", type: "color", group: "theme" },
    ],
    defaults: { ...baseDefaults, countryCode: "IN", callingCode: "91", phone: "", agent: "Priya Sharma", agentName: "Priya Sharma", agentRole: "Support Team", welcome: "Hi there! 👋\nHow can we help you today?", welcomeMessage: "Hi there! 👋\nHow can we help you today?", buttonText: "Chat with us", position: "bottom-right", startOpen: true, buttonColor: "#25D366", primaryColor: "#25D366" },
  },
  faq: {
    fields: [
      { key: "title", label: "Title", type: "text", group: "content" },
      { key: "items", label: "Questions (Q | A, one per line)", type: "textarea", group: "content" },
      { key: "openFirst", label: "Open first item", type: "toggle", group: "layout" },
    ],
    defaults: {
      ...baseDefaults, title: "Frequently asked questions", openFirst: true,
      items: "How long does shipping take? | Most orders arrive within 3–5 business days.\nCan I return an item? | Yes, returns are free within 30 days.\nDo you ship internationally? | We ship to over 40 countries."
    },
  },
  countdown: {
    fields: [
      { key: "title", label: "Headline", type: "text", group: "content" },
      { key: "target", label: "End date (YYYY-MM-DD)", type: "text", group: "content" },
      { key: "showSeconds", label: "Show seconds", type: "toggle", group: "layout" },
      { key: "style", label: "Style", type: "select", group: "layout", options: ["Boxes", "Minimal"] },
    ],
    defaults: { ...baseDefaults, title: "Summer sale ends in", target: "2026-12-31", showSeconds: true, style: "Boxes" },
  },
  testimonials: {
    fields: [
      { key: "title", label: "Title", type: "text", group: "content" },
      { key: "items", label: "Quotes (Name | Quote, one per line)", type: "textarea", group: "content" },
      { key: "columns", label: "Columns", type: "range", group: "layout", min: 1, max: 3 },
      { key: "showAvatars", label: "Show avatars", type: "toggle", group: "layout" },
    ],
    defaults: {
      ...baseDefaults, title: "Loved by thousands", columns: 2, showAvatars: true,
      items: "Emma R. | The setup took five minutes and our conversions went up.\nDavid K. | Beautiful design and super easy to customize.\nPriya S. | Our customers finally find answers on their own."
    },
  },
  "announcement-bar": {
    fields: [
      { key: "message", label: "Message", type: "text", group: "content" },
      { key: "linkText", label: "Link text", type: "text", group: "content" },
      { key: "closable", label: "Show close button", type: "toggle", group: "layout" },
      { key: "align", label: "Alignment", type: "select", group: "layout", options: ["Center", "Left"] },
    ],
    defaults: {
      ...baseDefaults,
      width: 1100,
      radius: 0,
      padding: 12,
      bg: "#0F172A",
      text: "#ffffff",
      accent: "#FACC15",
      message: "2027 Winter and Spring Schedules are now open for enrollment!",
      textValue: "2027 Winter and Spring Schedules are now open for enrollment!",
      linkText: "Learn More",
      closable: true,
      align: "Center",
      templateId: "classic",
      bgColor: "#0F172A",
      textColor: "#ffffff",
      position: "top",
    },
  },
  popup: {
    fields: [
      { key: "title", label: "Title", type: "text", group: "content" },
      { key: "description", label: "Description", type: "textarea", group: "content" },
      { key: "primaryButtonText", label: "Button text", type: "text", group: "content" },
      { key: "position", label: "Position", type: "select", group: "layout", options: ["Center", "Top", "Bottom", "Left", "Right"] },
    ],
    defaults: {
      ...baseDefaults,
      title: "Special Offer! 🎉",
      description: "Get 20% off on your first order. Use code WELCOME20 at checkout.",
      primaryButtonText: "Shop Now",
      position: "center",
      templateId: "center",
      size: "medium",
      overlayStyle: "dark",
      entryAnimation: "zoom",
      bgColor: "#FFFFFF",
      textColor: "#111827",
    },
  },
};

export function getSchema(type: string) {
  const def = WIDGETS.find((w) => w.type === type);
  const s = SCHEMAS[type];
  if (!def || !s) return null;
  return { def, fields: [...s.fields, ...common(def.kind)], defaults: s.defaults };
}

export interface SavedWidget { id: string; type: string; name: string; config: Config; updatedAt: number }
const KEY = "wto.savedWidgets";

export function loadSaved(): SavedWidget[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function saveWidget(w: SavedWidget) {
  const all = loadSaved().filter((x) => x.id !== w.id);
  localStorage.setItem(KEY, JSON.stringify([w, ...all]));
}
export function deleteWidget(id: string) {
  localStorage.setItem(KEY, JSON.stringify(loadSaved().filter((x) => x.id !== id)));
}

import { getWidgetScriptUrl } from "./embed";
export * from "./embed";

export function embedCode(w: { id: string; type: string; config: Config }) {
  const scriptUrl = getWidgetScriptUrl(w.type);
  return `<!-- WebToolOcean ${w.type} widget -->
<div class="wto-widget" data-widget="${w.type}" data-id="${w.id}"></div>
<script>
  window.WTO_DEMO_CONFIG = window.WTO_DEMO_CONFIG || {};
  window.WTO_DEMO_CONFIG["${w.id}"] = ${JSON.stringify(w.config)};
</script>
<script src="${scriptUrl}" async></script>`;
}

export function filterWidgets(list: WidgetDef[], q: string, cat: string) {
  const s = q.trim().toLowerCase();
  const filtered = list.filter((w) => (cat === "All" || w.category === cat) &&
    (!s || w.name.toLowerCase().includes(s) || w.description.toLowerCase().includes(s)));
  return sortWidgetsByPriority(filtered);
}
