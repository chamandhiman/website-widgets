export type CalendarDesignId =
  | "minimal-list"
  | "modern-cards"
  | "monthly-grid"
  | "agenda"
  | "compact"
  | "featured";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime?: string | undefined; // HH:mm (24h)
  endTime?: string | undefined; // HH:mm (24h)
  location?: string | undefined;
  description?: string | undefined;
  imageUrl?: string | undefined;
  destinationUrl?: string | undefined;
}

export interface EventCalendarPreferences {
  upcomingOnly: boolean;
  maxEvents: number;
  showDescriptions: boolean;
  showLocations: boolean;
  showImages: boolean;
  dateFormat: "MMM D, YYYY" | "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
  timeFormat: "12h" | "24h";
  emptyStateMessage: string;
}

export interface EventCalendarConfig {
  designId: CalendarDesignId;
  title: string;
  description?: string | undefined;
  events: CalendarEvent[];
  upcomingOnly: boolean;
  maxEvents: number;
  showDescriptions: boolean;
  showLocations: boolean;
  showImages: boolean;
  dateFormat: "MMM D, YYYY" | "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
  timeFormat: "12h" | "24h";
  emptyStateMessage: string;
  accent?: string | undefined;
  bg?: string | undefined;
  text?: string | undefined;
  radius?: number | undefined;
}

export interface CalendarDesignDefinition {
  id: CalendarDesignId;
  name: string;
  badge: string;
  tagline: string;
  description: string;
}

export const CALENDAR_DESIGNS: CalendarDesignDefinition[] = [
  {
    id: "minimal-list",
    name: "Minimal List",
    badge: "Clean & Simple",
    tagline: "Vertical list with generous whitespace and elegant typography",
    description:
      "A distraction-free vertical layout highlighting event titles, dates, and locations with subtle borders.",
  },
  {
    id: "modern-cards",
    name: "Modern Cards",
    badge: "Recommended",
    tagline: "Individual cards with vibrant date badges and badges",
    description:
      "Eye-catching card grid displaying event date badges, image previews, and clean action buttons.",
  },
  {
    id: "monthly-grid",
    name: "Monthly Calendar",
    badge: "Traditional Grid",
    tagline: "Classic calendar month view with interactive date navigation",
    description:
      "A full calendar grid showing events on their specific calendar days with previous and next month controls.",
  },
  {
    id: "agenda",
    name: "Agenda",
    badge: "Chronological",
    tagline: "Chronological timeline view grouped by date for fast scanning",
    description:
      "Events organized by date headers with connected timeline indicators for effortless browsing.",
  },
  {
    id: "compact",
    name: "Compact",
    badge: "Space Saver",
    tagline: "Condensed list optimized for sidebars and small website sections",
    description:
      "A slim, space-efficient list format that fits perfectly in sidebars, footers, or tight content areas.",
  },
  {
    id: "featured",
    name: "Featured Events",
    badge: "Visual & Bold",
    tagline: "Large hero cards highlighting key event dates and media",
    description:
      "High-impact presentation featuring prominent banner images, date highlights, and prominent call-to-actions.",
  },
];

export const SAMPLE_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: "ev-1",
    title: "Global Web & AI Developers Summit 2027",
    date: "2027-04-15",
    startTime: "09:30",
    endTime: "17:00",
    location: "Main Convention Center & Virtual Stream",
    description:
      "Join world-class engineers, designers, and open-source creators for a full day of frontend innovation, AI workflows, and networking.",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
    destinationUrl: "https://example.com/summit",
  },
  {
    id: "ev-2",
    title: "Product Design & UX Masterclass",
    date: "2027-04-22",
    startTime: "14:00",
    endTime: "16:30",
    location: "Design Studio Room B (San Francisco)",
    description:
      "Interactive workshop on design tokens, micro-animations, and conversion-optimized component patterns.",
    imageUrl:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80",
    destinationUrl: "https://example.com/ux-masterclass",
  },
  {
    id: "ev-3",
    title: "Cloud Infrastructure & Edge Functions Workshop",
    date: "2027-05-04",
    startTime: "10:00",
    endTime: "13:00",
    location: "Online Zoom Webinar",
    description:
      "Deep dive into edge routing, distributed caching, and automated zero-downtime Cloudflare deployment pipelines.",
    imageUrl:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80",
    destinationUrl: "https://example.com/cloud-workshop",
  },
  {
    id: "ev-4",
    title: "Community Hackathon & Project Showcase",
    date: "2027-05-20",
    startTime: "09:00",
    endTime: "20:00",
    location: "Tech Innovation Hub, Austin TX",
    description:
      "Build, launch, and demo your project with mentor guidance, free food, and exciting community prizes.",
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
    destinationUrl: "https://example.com/hackathon",
  },
  {
    id: "ev-5",
    title: "Customer Growth & Retention Live AMA",
    date: "2027-06-08",
    startTime: "16:00",
    endTime: "17:15",
    location: "Live Webinar",
    description:
      "Live Q&A session discussing onboarding strategies, conversion tactics, and scalable user success metrics.",
    imageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    destinationUrl: "https://example.com/growth-ama",
  },
];

export const DEFAULT_EVENT_CALENDAR_CONFIG: EventCalendarConfig = {
  designId: "modern-cards",
  title: "Upcoming Events",
  description: "Browse our upcoming workshops, live webinars, and community meetups.",
  events: SAMPLE_CALENDAR_EVENTS,
  upcomingOnly: true,
  maxEvents: 10,
  showDescriptions: true,
  showLocations: true,
  showImages: true,
  dateFormat: "MMM D, YYYY",
  timeFormat: "12h",
  emptyStateMessage: "No upcoming events scheduled at this moment. Please check back soon!",
  accent: "#7c3aed",
  bg: "#ffffff",
  text: "#0f172a",
  radius: 16,
};

export function migrateCalendarConfig(raw: any): EventCalendarConfig {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_EVENT_CALENDAR_CONFIG };
  }

  const validDesignIds: CalendarDesignId[] = [
    "minimal-list",
    "modern-cards",
    "monthly-grid",
    "agenda",
    "compact",
    "featured",
  ];

  const designId = validDesignIds.includes(raw.designId)
    ? raw.designId
    : DEFAULT_EVENT_CALENDAR_CONFIG.designId;

  const events = Array.isArray(raw.events)
    ? raw.events.map((e: any, idx: number) => ({
        id: e.id || `ev-${idx + 1}`,
        title: e.title || "Untitled Event",
        date: e.date || "2027-01-01",
        startTime: e.startTime || "",
        endTime: e.endTime || "",
        location: e.location || "",
        description: e.description || "",
        imageUrl: e.imageUrl || "",
        destinationUrl: e.destinationUrl || "",
      }))
    : SAMPLE_CALENDAR_EVENTS;

  return {
    ...DEFAULT_EVENT_CALENDAR_CONFIG,
    ...raw,
    designId,
    events,
  };
}
