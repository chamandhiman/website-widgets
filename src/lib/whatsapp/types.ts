export type WidgetPosition = "bottom-right" | "bottom-left" | "top-left" | "top-right";
export type WidgetSize = "small" | "medium" | "large";
export type ButtonIconType = "whatsapp" | "message-circle" | "speech-bubble" | "phone" | "custom";

export interface WhatsAppWidgetConfig {
  // Phone & country
  countryCode: string; // ISO 2-letter, e.g. "IN", "US", "GB"
  callingCode: string; // e.g. "91", "1", "44"
  phone: string; // National formatted or input digits, e.g. "98765 43210"

  // Content
  chatMessage: string;
  agentName: string;
  agentRole: string;
  agentAvatar: string;
  showAgent: boolean;
  buttonText: string;
  welcomeMessage: string;
  prefilledMessage: string;

  // Display & layout
  position: WidgetPosition;
  visibilityDesktop: boolean;
  visibilityMobile: boolean;
  showChatPopup: boolean;
  displayDelay: number; // in seconds

  // Style
  primaryColor: string;
  buttonSize: WidgetSize;
  buttonIcon: ButtonIconType;
  customIconUrl: string;
  borderRadius: number;
  spacing: number;

  // Behavior
  openInNewTab: boolean;
  autoOpenGreeting: boolean;
  greetingDelay: number; // in seconds

  // Advanced
  customCssClass: string;
  zIndex: number;
}

export const DEFAULT_WHATSAPP_CONFIG: WhatsAppWidgetConfig = {
  countryCode: "IN",
  callingCode: "91",
  phone: "",
  chatMessage: "Hello! How can we help you?",
  agentName: "Priya Sharma",
  agentRole: "Support Team",
  agentAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  showAgent: true,
  buttonText: "Chat with us",
  welcomeMessage: "Hi there! 👋\nHow can we help you today?",
  prefilledMessage: "I would like to know more about your services.",
  position: "bottom-right",
  visibilityDesktop: true,
  visibilityMobile: true,
  showChatPopup: true,
  displayDelay: 0,
  primaryColor: "#25D366",
  buttonSize: "medium",
  buttonIcon: "whatsapp",
  customIconUrl: "",
  borderRadius: 16,
  spacing: 20,
  openInNewTab: true,
  autoOpenGreeting: false,
  greetingDelay: 3,
  customCssClass: "",
  zIndex: 99999,
};
