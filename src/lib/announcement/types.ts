export type AnnouncementTemplateId =
  | "classic"
  | "with-button"
  | "information"
  | "success"
  | "seasonal"
  | "minimal"
  | "gradient"
  | "countdown"
  | "link"
  | "multi-line";

export type AnnouncementPosition = "top" | "bottom";
export type AnnouncementIcon =
  | "megaphone"
  | "gift"
  | "info"
  | "tag"
  | "bell"
  | "star"
  | "flame"
  | "check"
  | "clock"
  | "none";

export interface CountdownLabels {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export interface AnnouncementBarConfig {
  // Template
  templateId: AnnouncementTemplateId;

  // 1. Content
  text: string;
  headline?: string;
  secondaryText?: string;
  icon: AnnouncementIcon;
  customEmoji?: string;

  // 2. Action (Optional)
  hasButton: boolean;
  buttonText: string;
  buttonLink: string;
  hasLink: boolean;
  linkText: string;
  linkUrl: string;
  openInNewTab: boolean;

  // 3. Style
  bgColor: string;
  textColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  fontSize: string; // e.g. "14px", "16px"
  fontWeight: string; // e.g. "normal", "semibold", "bold"
  textAlign: "center" | "left";
  padding: number; // in px
  borderRadius: number; // in px

  // 4. Position
  position: AnnouncementPosition;
  isSticky: boolean;

  // 5. Visibility
  pageTarget: "all" | "homepage" | "custom";
  customPaths?: string;
  showDesktop: boolean;
  showTablet: boolean;
  showMobile: boolean;

  // 6. Display Options
  showCloseButton: boolean;
  allowDismiss: boolean;
  dismissDays: number;
  animateSlideDown: boolean;
  displayDelay: number; // in seconds

  // Scheduling
  isScheduled: boolean;
  startDate?: string;
  endDate?: string;

  // Countdown settings
  hasCountdown: boolean;
  countdownTarget: string; // ISO date/time string e.g. "2027-04-30T23:59:59"
  countdownTimezone: "local" | "UTC";
  countdownLabels: CountdownLabels;
  countdownExpireAction: "hide" | "message" | "keep";
  countdownExpireMessage: string;
}

export const DEFAULT_ANNOUNCEMENT_CONFIG: AnnouncementBarConfig = {
  templateId: "classic",
  text: "2027 Winter and Spring Schedules are now open for enrollment!",
  icon: "megaphone",
  hasButton: false,
  buttonText: "Learn More",
  buttonLink: "https://example.com/enroll",
  hasLink: false,
  linkText: "Learn More",
  linkUrl: "https://example.com/schedules",
  openInNewTab: true,
  bgColor: "#0F172A", // Dark navy matching mockup
  textColor: "#FFFFFF",
  buttonBgColor: "#FACC15",
  buttonTextColor: "#0F172A",
  fontSize: "14px",
  fontWeight: "medium",
  textAlign: "center",
  padding: 12,
  borderRadius: 0,
  position: "top",
  isSticky: true,
  pageTarget: "all",
  showDesktop: true,
  showTablet: true,
  showMobile: true,
  showCloseButton: true,
  allowDismiss: true,
  dismissDays: 7,
  animateSlideDown: true,
  displayDelay: 0,
  isScheduled: false,
  hasCountdown: false,
  countdownTarget: "2027-04-30T23:59:59",
  countdownTimezone: "local",
  countdownLabels: {
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
  },
  countdownExpireAction: "message",
  countdownExpireMessage: "Registration has closed.",
};
