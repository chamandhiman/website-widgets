export type PopupType =
  | "classic"
  | "center"
  | "hero-image"
  | "image"
  | "split"
  | "discount"
  | "minimal"
  | "newsletter"
  | "slide-in"
  | "bottom-small"
  | "exit-intent"
  | "announcement"
  | "video"
  | "age-verification"
  | "custom-html";

export type PopupPosition = "center" | "top" | "bottom" | "left" | "right" | "bottom-right" | "bottom-left";
export type PopupSize = "small" | "medium" | "large";
export type OverlayStyle = "none" | "light" | "dark" | "blur";
export type TriggerType = "load" | "delay" | "scroll" | "click" | "exit-intent" | "time-on-page";
export type AnimationType = "fade" | "zoom" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "none";
export type FrequencyRule = "always" | "session" | "daily" | "weekly" | "once";
export type PageTarget = "all" | "homepage" | "custom";
export type CloseButtonStyle = "inside" | "outside" | "minimal" | "hidden";

export interface PopupWidgetConfig {
  // Metadata
  version: number;
  templateId: PopupType;

  // Content
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imagePosition: "top" | "side" | "background";
  primaryButtonText: string;
  primaryButtonUrl: string;
  openInNewTab: boolean;
  hasSecondaryButton: boolean;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  showCloseButton: boolean;
  closeOnOverlayClick: boolean;
  showIcon: boolean;
  iconName: string;
  footerText: string;

  // Offer / Discount & Badge
  couponCode?: string | undefined;
  discountBadge?: string | undefined;
  disclaimerText?: string | undefined;

  // Newsletter specific
  emailPlaceholder: string;
  newsletterButtonText: string;
  consentText: string;
  requireConsent: boolean;
  successMessage: string;

  // Video specific
  videoUrl: string;
  videoPlatform: "youtube" | "vimeo" | "mp4";
  autoplay: boolean;

  // Age Verification specific
  ageQuestion: string;
  confirmText: string;
  declineText: string;
  declineAction: "message" | "redirect";
  declineMessage: string;
  declineUrl: string;

  // Custom HTML specific
  customHtmlContent: string;

  // Layout & Sizing
  position: PopupPosition;
  size: PopupSize;
  width: number;
  autoHeight: boolean;
  padding: number;
  borderRadius: number;
  imageBorderRadius: number;

  // Styles & Themes
  bgColor: string;
  textColor: string;
  primaryButtonBg: string;
  primaryButtonTextColor: string;
  secondaryButtonBg: string;
  secondaryButtonTextColor: string;
  fontSize: string;
  fontWeight: string;
  textAlign: "left" | "center" | "right";
  shadow: "none" | "subtle" | "medium" | "large";
  overlayStyle: OverlayStyle;
  overlayColor: string;
  overlayOpacity: number;
  closeButtonStyle: CloseButtonStyle;
  customClass: string;

  // Triggers
  triggerType: TriggerType;
  delaySeconds: number;
  scrollPercentage: number;
  clickSelector: string;
  timeOnPageSeconds: number;

  // Display & Targeting
  pageTarget: PageTarget;
  includedPaths: string;
  excludedPaths: string;
  showDesktop: boolean;
  showTablet: boolean;
  showMobile: boolean;
  frequency: FrequencyRule;
  enableScheduling: boolean;
  startDate: string;
  endDate: string;

  // Animation
  entryAnimation: AnimationType;
  animationDuration: number; // in milliseconds

  // Advanced
  zIndex: number;
  customCss: string;
}

export const DEFAULT_POPUP_CONFIG: PopupWidgetConfig = {
  version: 1,
  templateId: "center",

  title: "Special Offer! 🎉",
  description: "Get 20% off on your first order. Use code WELCOME20 at checkout.",
  imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80",
  imageAlt: "Special gift offer",
  imagePosition: "top",
  primaryButtonText: "Shop Now",
  primaryButtonUrl: "https://example.com/shop",
  openInNewTab: true,
  hasSecondaryButton: false,
  secondaryButtonText: "No Thanks",
  secondaryButtonUrl: "#",
  showCloseButton: true,
  closeOnOverlayClick: true,
  showIcon: false,
  iconName: "gift",
  footerText: "*Valid for new customers on orders over $50",
  couponCode: "WELCOME20",
  discountBadge: "20% OFF",
  disclaimerText: "*Valid for new customers on orders over $50",

  emailPlaceholder: "Enter your email address...",
  newsletterButtonText: "Subscribe Now",
  consentText: "I agree to receive marketing emails and can unsubscribe anytime.",
  requireConsent: false,
  successMessage: "Thank you for subscribing! Check your inbox for your 20% discount code.",

  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  videoPlatform: "youtube",
  autoplay: false,

  ageQuestion: "Are You 18 or Older?",
  confirmText: "Yes, I am 18+",
  declineText: "No, I am under 18",
  declineAction: "message",
  declineMessage: "You must be 18 years or older to view this website.",
  declineUrl: "https://google.com",

  customHtmlContent: `<div style="text-align: center; padding: 12px;">
  <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 8px; color: #111827;">Custom HTML Popup</h3>
  <p style="font-size: 14px; color: #6B7280; margin-bottom: 16px;">This popup renders safe custom HTML. You can embed banners, custom forms, or styled announcements.</p>
  <button style="background: #8B5CF6; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer;">Explore More</button>
</div>`,

  position: "center",
  size: "medium",
  width: 520,
  autoHeight: true,
  padding: 28,
  borderRadius: 16,
  imageBorderRadius: 12,

  bgColor: "#FFFFFF",
  textColor: "#111827",
  primaryButtonBg: "#8B5CF6",
  primaryButtonTextColor: "#FFFFFF",
  secondaryButtonBg: "#F3F4F6",
  secondaryButtonTextColor: "#374151",
  fontSize: "14px",
  fontWeight: "normal",
  textAlign: "center",
  shadow: "large",
  overlayStyle: "dark",
  overlayColor: "#000000",
  overlayOpacity: 0.6,
  closeButtonStyle: "inside",
  customClass: "",

  triggerType: "load",
  delaySeconds: 1,
  scrollPercentage: 50,
  clickSelector: ".open-popup-btn",
  timeOnPageSeconds: 5,

  pageTarget: "all",
  includedPaths: "",
  excludedPaths: "",
  showDesktop: true,
  showTablet: true,
  showMobile: true,
  frequency: "session",
  enableScheduling: false,
  startDate: "",
  endDate: "",

  entryAnimation: "zoom",
  animationDuration: 300,

  zIndex: 99999,
  customCss: "",
};
