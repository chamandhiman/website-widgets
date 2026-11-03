import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { loadSaved } from "@/lib/widgets";
import {
  Search,
  ArrowRight,
  Check,
  Zap,
  Globe,
  Layers,
  LayoutTemplate,
  MessageCircle,
  Megaphone,
  Clock,
  Mail,
  Quote,
  Star,
  Users,
  Briefcase,
  Target,
  LayoutGrid,
  MoreHorizontal,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  SlidersHorizontal,
  ShieldCheck,
  Code2,
  X,
  Eye,
  Plus,
  Compass,
  FileText,
  Share2,
  HelpCircle,
  CalendarDays,
  Menu as MenuIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Website Widgets by WebToolOcean – Add Powerful Widgets to Any Website in Minutes" },
      {
        name: "description",
        content:
          "Live chat, popups, forms, announcements and 50+ ready-to-use widgets. No coding required. Lightweight, fast, and works on any website.",
      },
      { property: "og:title", content: "Website Widgets by WebToolOcean" },
      {
        property: "og:description",
        content:
          "Live chat, popups, forms, announcements and 50+ ready-to-use widgets. No coding required. Lightweight and fast.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LandingPage,
});

/* ==========================================================================
   WIDGET DATA & CATEGORIES
   ========================================================================== */

export interface LandingWidget {
  id: string;
  name: string;
  description: string;
  category: "Business" | "Marketing" | "Engagement" | "Conversion" | "Utilities" | "Social" | "Reviews" | "Chat" | "Content" | "Forms";
  type: string;
  badge?: "NEW" | "POPULAR" | "HOT";
  icon: any;
  ready?: boolean;
}

const ALL_WIDGETS_CATALOG: LandingWidget[] = [
  // Curated Popular 6 (matching reference mockup)
  {
    id: "whatsapp-chat",
    name: "WhatsApp Live Chat",
    description: "Let visitors chat with you instantly on WhatsApp.",
    category: "Chat",
    type: "whatsapp-chat",
    badge: "NEW",
    icon: MessageCircle,
    ready: true,
  },
  {
    id: "announcement-bar",
    name: "Announcement Bar",
    description: "Show important updates, offers and announcements.",
    category: "Marketing",
    type: "announcement-bar",
    badge: "NEW",
    icon: Megaphone,
    ready: true,
  },
  {
    id: "countdown",
    name: "Countdown Timer",
    description: "Create urgency with a live countdown timer.",
    category: "Conversion",
    type: "countdown",
    badge: "POPULAR",
    icon: Clock,
    ready: true,
  },
  {
    id: "contact-form",
    name: "Contact Form",
    description: "Get messages and leads directly from your website.",
    category: "Forms",
    type: "contact-form",
    icon: Mail,
    ready: true,
  },
  {
    id: "popup",
    name: "Newsletter Popup",
    description: "Grow your email list with a beautiful popup.",
    category: "Conversion",
    type: "popup",
    badge: "POPULAR",
    icon: Target,
    ready: true,
  },
  {
    id: "testimonial-slider",
    name: "Testimonial Slider",
    description: "Show real customer reviews and build trust.",
    category: "Reviews",
    type: "testimonial-slider",
    badge: "HOT",
    icon: Quote,
    ready: true,
  },

  // Additional Real & Supported Widgets in Library
  {
    id: "google-reviews",
    name: "Google Reviews",
    description: "Embed trusted Google reviews directly onto your pages.",
    category: "Reviews",
    type: "google-reviews",
    badge: "POPULAR",
    icon: Star,
    ready: true,
  },
  {
    id: "event-calendar",
    name: "Event Calendar",
    description: "Present events, schedules and agendas in a clean calendar.",
    category: "Content",
    type: "event-calendar",
    badge: "NEW",
    icon: CalendarDays,
    ready: true,
  },
  {
    id: "logo-carousel",
    name: "Logo Carousel",
    description: "Display partner logos, client brands and technology badges.",
    category: "Marketing",
    type: "logo-carousel",
    badge: "POPULAR",
    icon: Layers,
    ready: true,
  },
  {
    id: "faq",
    name: "FAQ Accordion",
    description: "Answer common visitor questions in a tidy expandable list.",
    category: "Content",
    type: "faq",
    icon: HelpCircle,
    ready: true,
  },
  {
    id: "instagram-feed",
    name: "Instagram Feed",
    description: "Add posts and reels from your Instagram account or hashtag.",
    category: "Social",
    type: "instagram-feed",
    icon: Users,
    ready: false,
  },
  {
    id: "facebook-feed",
    name: "Facebook Feed",
    description: "Display your Facebook page updates and social community posts.",
    category: "Social",
    type: "facebook-feed",
    icon: Share2,
    ready: false,
  },
  {
    id: "social-feed",
    name: "Social Media Feed",
    description: "Combine all your social media channels into one live stream.",
    category: "Social",
    type: "social-feed",
    icon: Share2,
    ready: false,
  },
  {
    id: "youtube-gallery",
    name: "YouTube Gallery",
    description: "Showcase videos and tutorials from your YouTube channel.",
    category: "Content",
    type: "youtube-gallery",
    icon: Eye,
    ready: false,
  },
  {
    id: "accessibility",
    name: "Accessibility Widget",
    description: "Let visitors adjust contrast, font size and reading guides.",
    category: "Utilities",
    type: "accessibility",
    icon: LayoutGrid,
    ready: false,
  },
  {
    id: "language-switcher",
    name: "Language Switcher",
    description: "Floating switcher to translate your website for global users.",
    category: "Utilities",
    type: "language-switcher",
    icon: Globe,
    ready: false,
  },
  {
    id: "store-locator",
    name: "Store Locator",
    description: "Help customers find your nearest stores and office locations.",
    category: "Business",
    type: "store-locator",
    icon: Briefcase,
    ready: false,
  },
  {
    id: "pricing-table",
    name: "Pricing Table",
    description: "Compare your plans, packages and features side by side.",
    category: "Business",
    type: "pricing-table",
    icon: Briefcase,
    ready: false,
  },
  {
    id: "cookie-consent",
    name: "Cookie Consent",
    description: "GDPR & CCPA compliant cookie notice banner with preferences.",
    category: "Utilities",
    type: "cookie-consent",
    icon: ShieldCheck,
    ready: false,
  },
  {
    id: "back-to-top",
    name: "Back to Top Button",
    description: "Smooth floating button to bring visitors back to page top.",
    category: "Utilities",
    type: "back-to-top",
    icon: Zap,
    ready: false,
  },
  {
    id: "custom-html",
    name: "Custom HTML",
    description: "Drop in any custom code, tracking pixel or embedded script.",
    category: "Utilities",
    type: "custom-html",
    icon: Code2,
    ready: false,
  },
];

// Sidebar filter categories
const EXPLORER_CATEGORIES = [
  { id: "All", name: "All Widgets", count: "50+", icon: Layers },
  { id: "Business", name: "Business", count: "10", icon: Briefcase },
  { id: "Marketing", name: "Marketing", count: "12", icon: Megaphone },
  { id: "Engagement", name: "Engagement", count: "8", icon: Users },
  { id: "Conversion", name: "Conversion", count: "9", icon: Target },
  { id: "Utilities", name: "Utilities", count: "7", icon: LayoutGrid },
  { id: "Social", name: "Social", count: "6", icon: Share2 },
  { id: "Reviews", name: "Reviews", count: "5", icon: Star },
  { id: "Chat", name: "Chat", count: "5", icon: MessageCircle },
  { id: "Forms", name: "Forms", count: "6", icon: FileText },
  { id: "Content", name: "Content", count: "8", icon: LayoutTemplate },
];

// Explore by Category Tiles
const CATEGORY_TILES = [
  {
    id: "Business",
    name: "Business",
    count: "10 widgets",
    icon: Briefcase,
    color: "bg-purple-50 text-purple-600 border-purple-100/70 hover:bg-purple-100/60",
    iconColor: "text-purple-600",
  },
  {
    id: "Marketing",
    name: "Marketing",
    count: "12 widgets",
    icon: Megaphone,
    color: "bg-pink-50 text-pink-600 border-pink-100/70 hover:bg-pink-100/60",
    iconColor: "text-pink-600",
  },
  {
    id: "Engagement",
    name: "Engagement",
    count: "8 widgets",
    icon: Users,
    color: "bg-blue-50 text-blue-600 border-blue-100/70 hover:bg-blue-100/60",
    iconColor: "text-blue-600",
  },
  {
    id: "Conversion",
    name: "Conversion",
    count: "9 widgets",
    icon: Target,
    color: "bg-amber-50 text-amber-700 border-amber-100/70 hover:bg-amber-100/60",
    iconColor: "text-amber-600",
  },
  {
    id: "Utilities",
    name: "Utilities",
    count: "7 widgets",
    icon: LayoutGrid,
    color: "bg-emerald-50 text-emerald-700 border-emerald-100/70 hover:bg-emerald-100/60",
    iconColor: "text-emerald-600",
  },
  {
    id: "All",
    name: "More",
    count: "View all →",
    icon: MoreHorizontal,
    color: "bg-slate-50 text-slate-700 border-slate-200/70 hover:bg-slate-100",
    iconColor: "text-slate-600",
  },
];

/* ==========================================================================
   LANDING PAGE COMPONENT
   ========================================================================== */

function LandingPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Explicit log out state: if user signs out in session, respect logged-out state
  const [loggedOut, setLoggedOut] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return sessionStorage.getItem("ww_logged_out") === "true";
      } catch {
        return false;
      }
    }
    return false;
  });

  // If a real Firebase user signs in, clear logged-out flag
  useEffect(() => {
    if (user && typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("ww_logged_out");
      } catch {}
      setLoggedOut(false);
    }
  }, [user]);

  // Active user: real Firebase user if signed in, or default reference user "just test" unless explicitly logged out
  const activeUser = loggedOut
    ? null
    : user || {
        uid: "default-user",
        displayName: "just test",
        email: "wejusttest365@gmail.com",
        photoURL: null,
      };

  // Header state
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Widget Explorer state
  const [selectedCat, setSelectedCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const explorerSectionRef = useRef<HTMLElement>(null);

  // Live modal preview state
  const [previewWidget, setPreviewWidget] = useState<LandingWidget | null>(null);

  // Policy & info modal state
  const [policyModal, setPolicyModal] = useState<"privacy" | "terms" | "cookies" | "about" | null>(null);

  // Handle Add Widget: prompt with a toast if unauthenticated
  const handleAddWidget = (widgetType: string) => {
    if (!user) {
      toast("Please login to create widgets", {
        description: "Sign in to customize, save, and install widgets on your website.",
        action: {
          label: "Sign In",
          onClick: () => navigate({ to: "/login" }),
        },
      });
      return;
    }
    navigate({ to: "/editor/$type", params: { type: widgetType } });
  };

  // Live countdown ticker state: "02:13:56"
  const [timeRemaining, setTimeRemaining] = useState({ hours: 2, minutes: 13, seconds: 56 });

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  // Close profile dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen]);

  // Live countdown second interval
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 2, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format2 = (n: number) => String(n).padStart(2, "0");

  // Number of user's saved widgets
  const savedCount = useMemo(() => {
    try {
      const saved = loadSaved();
      return saved.length || 2;
    } catch {
      return 2;
    }
  }, []);

  // Filtered widgets for explorer
  const displayedWidgets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = ALL_WIDGETS_CATALOG;

    if (selectedCat !== "All") {
      list = list.filter((w) => w.category === selectedCat);
    }

    if (q) {
      list = list.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.description.toLowerCase().includes(q) ||
          w.category.toLowerCase().includes(q)
      );
    }

    // If default view with no search, show top 6 curated popular widgets
    if (selectedCat === "All" && !q) {
      return list.slice(0, 6);
    }

    return list;
  }, [selectedCat, searchQuery]);

  const handleSelectCategory = (catId: string) => {
    setSelectedCat(catId);
    if (explorerSectionRef.current) {
      explorerSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const userName = activeUser?.displayName || activeUser?.email?.split("@")[0] || "just test";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#faf9ff] text-slate-900 font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* ====================================================================
          1. HEADER – CENTERED FLOATING PILL CONTAINER (APPROX 90-92% WIDTH, NOT FULL WIDTH)
          ==================================================================== */}
      <div className="sticky top-3 sm:top-4 z-40 w-full px-4 sm:px-6 flex justify-center pointer-events-none">
        <header className="pointer-events-auto w-[92%] max-w-[1440px] bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-lg shadow-purple-900/5 rounded-[40px] px-5 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-4 transition-all">
          {/* Left: Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img
              src="/logo.png"
              alt="Website Widgets by WebToolOcean"
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </Link>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-sm font-semibold text-slate-600">
            <Link to="/templates" className="hover:text-purple-600 transition-colors">
              Templates
            </Link>
            <a href="#features" className="hover:text-purple-600 transition-colors">
              Features
            </a>
            <Link to="/widgets" className="hover:text-purple-600 transition-colors">
              Widgets
            </Link>
            <a href="#pricing" className="hover:text-purple-600 transition-colors">
              Pricing
            </a>
            <a href="#benefits" className="hover:text-purple-600 transition-colors">
              Help
            </a>
          </nav>

          {/* Right: Auth Profile / Logged-out State */}
          <div className="flex items-center gap-3 shrink-0">
            {activeUser ? (
              <div className="relative" ref={profileDropdownRef}>
                {/* Profile Trigger Button - clicking ONLY toggles the dropdown, NEVER navigates */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileOpen((prev) => !prev);
                  }}
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border border-slate-200/70 hover:border-purple-300 bg-white hover:bg-slate-50 transition-all shadow-sm cursor-pointer select-none"
                >
                  {activeUser.photoURL ? (
                    <img
                      src={activeUser.photoURL}
                      alt={userName}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-purple-100"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                      {userInitial}
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate hidden sm:inline-block">
                    {userName}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Small Anchored Dropdown Menu:
                    - Positioned immediately below the profile trigger (absolute right-0 top-full mt-2.5)
                    - Compact width 275px (within 260-290px requirement)
                    - Rounded-2xl (16px), subtle border, soft shadow, z-50
                    - NO modal backdrop or overlay; page behind remains visible and usable */}
                {profileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-2.5 w-[275px] rounded-2xl border border-slate-200/80 bg-white p-2 shadow-2xl shadow-purple-900/15 z-50 animate-in fade-in zoom-in-95 duration-150 select-none text-left"
                  >
                    {/* 1. User avatar, username, and email */}
                    <div className="p-3 bg-slate-50/80 rounded-xl mb-1.5">
                      <div className="flex items-center gap-3">
                        {activeUser.photoURL ? (
                          <img
                            src={activeUser.photoURL}
                            alt={userName}
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-200"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-slate-800 text-white font-bold text-sm flex items-center justify-center">
                            {userInitial}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {userName}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {activeUser.email || "wejusttest365@gmail.com"}
                          </p>
                          {/* 2. Free Plan / Pro Plan badge */}
                          <span className="inline-block mt-1 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                            FREE PLAN
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 3. Divider */}
                    <div className="h-px bg-slate-100 my-1" />

                    {/* 4. Dashboard – Manage your widgets */}
                    <div className="space-y-0.5">
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-left rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                            <LayoutDashboard className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">Dashboard</p>
                            <p className="text-[11px] text-slate-500">Manage your widgets</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
                      </Link>

                      {/* 5. My Websites */}
                      <Link
                        to="/my-widgets"
                        onClick={() => setProfileOpen(false)}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-left rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <Globe className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">My Websites</p>
                            <p className="text-[11px] text-slate-500">
                              {savedCount} {savedCount === 1 ? "website" : "websites"}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </Link>

                      {/* 6. Explore Widgets */}
                      <Link
                        to="/widgets"
                        onClick={() => setProfileOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                      >
                        <div className="h-8 w-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center group-hover:bg-pink-100 transition-colors">
                          <Compass className="h-4 w-4" />
                        </div>
                        <p className="text-sm font-medium text-slate-800">Explore Widgets</p>
                      </Link>
                    </div>

                    {/* 7. Divider */}
                    <div className="h-px bg-slate-100 my-1" />

                    {/* 8. Sign Out */}
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        setLoggedOut(true);
                        if (typeof window !== "undefined") {
                          try {
                            sessionStorage.setItem("ww_logged_out", "true");
                          } catch {}
                        }
                        signOut();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-xl text-rose-600 hover:bg-rose-50 text-sm font-semibold transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Logged-out state: Sign In and Get Started inside the floating pill */
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-3.5 py-1.5 rounded-full hover:bg-slate-100/70 transition-colors cursor-pointer"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-white px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 hover:opacity-95 shadow-md shadow-purple-500/20 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Drawer (Anchored below floating header) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-4 right-4 z-40 rounded-3xl border border-slate-200/80 bg-white/95 backdrop-blur-xl p-5 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
          <Link
            to="/templates"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-800 hover:text-purple-600 py-1"
          >
            Templates
          </Link>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-800 hover:text-purple-600 py-1"
          >
            Features
          </a>
          <Link
            to="/widgets"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-800 hover:text-purple-600 py-1"
          >
            Widgets
          </Link>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-800 hover:text-purple-600 py-1"
          >
            Pricing
          </a>
          <a
            href="#benefits"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-800 hover:text-purple-600 py-1"
          >
            Help
          </a>
        </div>
      )}

      {/* ====================================================================
          2. HERO SECTION
          ==================================================================== */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
        {/* Ambient background glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[500px] w-[1000px] rounded-full bg-gradient-to-b from-purple-200/30 via-violet-100/20 to-transparent blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase text-purple-700 bg-purple-50 border border-purple-100 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-pulse" />
                WEBSITE WIDGETS
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-slate-900 tracking-tight leading-[1.08] mb-6">
                Add{" "}
                <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
                  powerful widgets
                </span>{" "}
                to any website in minutes.
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-8 max-w-xl font-normal">
                Live chat, popups, forms, announcements and 50+ ready-to-use widgets. No coding
                required. Lightweight and fast.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Link
                  to="/widgets"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg shadow-purple-500/25 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Explore Widgets</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/templates"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 shadow-sm hover:shadow transition-all"
                >
                  View Templates
                </Link>
              </div>

              {/* Three Benefit Indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span>No coding</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span>Lightweight</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span>Works on any website</span>
                </div>
              </div>
            </div>

            {/* Right Visual: Product Illustration Mockup matching reference image */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="relative w-full max-w-lg lg:max-w-none">
                {/* Glow backdrop */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-purple-300/30 via-pink-200/20 to-indigo-300/30 blur-2xl -z-10" />

                {/* Editor Browser Frame */}
                <div className="rounded-3xl border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-2xl shadow-purple-900/10 overflow-hidden">
                  {/* Top Browser Bar */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-slate-50/80 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="max-w-[200px] mx-auto h-5 rounded-md bg-white border border-slate-200/60 px-2 flex items-center text-[10px] text-slate-400 truncate">
                        widgets.webtoolocean.com/preview
                      </div>
                    </div>
                  </div>

                  {/* Inner Workspace Canvas */}
                  <div className="p-5 sm:p-7 relative bg-gradient-to-br from-slate-50/50 via-white to-purple-50/20 min-h-[360px] flex items-center justify-center">
                    {/* Left Icon Rail */}
                    <div className="absolute left-3 top-6 bottom-6 w-9 rounded-xl bg-white border border-slate-100 shadow-sm hidden sm:flex flex-col items-center py-3 gap-3 text-slate-400">
                      <div className="h-6 w-6 rounded-lg bg-slate-800 text-white flex items-center justify-center text-xs">
                        ⊞
                      </div>
                      <Layers className="h-4 w-4 text-slate-400" />
                      <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                      <Compass className="h-4 w-4 text-slate-400" />
                    </div>

                    {/* Central Selected Website Canvas with Dashed Bounding Box */}
                    <div className="sm:ml-10 sm:mr-32 relative border-2 border-dashed border-purple-500 rounded-2xl p-5 bg-white shadow-xl shadow-purple-900/5 max-w-[260px] sm:max-w-[280px]">
                      {/* Sale Tag */}
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-sm">
                        Sale 50% OFF
                      </div>

                      {/* Product Preview Image & Content */}
                      <div className="flex flex-col items-center text-center mt-2">
                        <div className="h-24 w-24 rounded-2xl bg-gradient-to-tr from-purple-50 via-rose-50 to-indigo-50 flex items-center justify-center text-4xl shadow-inner mb-3">
                          🪑
                        </div>
                        <h4 className="text-sm font-bold text-slate-800">Velvet Armchair</h4>
                        <p className="text-xs text-slate-400 mt-0.5">$189.00</p>
                        <button
                          type="button"
                          className="mt-3 text-xs font-semibold px-4 py-1.5 rounded-lg bg-slate-900 text-white shadow-sm"
                        >
                          Shop Now
                        </button>
                      </div>

                      {/* Transform Corner Handles */}
                      <div className="absolute -top-1.5 -left-1.5 h-3 w-3 bg-white border-2 border-purple-600 rounded-sm" />
                      <div className="absolute -top-1.5 -right-1.5 h-3 w-3 bg-white border-2 border-purple-600 rounded-sm" />
                      <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-white border-2 border-purple-600 rounded-sm" />
                      <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-white border-2 border-purple-600 rounded-sm" />

                      {/* Purple Cursor pointer */}
                      <div className="absolute -bottom-4 -right-4 z-20">
                        <svg
                          className="w-8 h-8 text-purple-600 drop-shadow-md"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M4 0l16 12-7 2 4 8-3 2-4-8-6 5z" />
                        </svg>
                      </div>
                    </div>

                    {/* Floating Add Widget Panel on Right */}
                    <div className="absolute right-3 top-6 w-40 sm:w-44 rounded-2xl bg-white/95 backdrop-blur-md border border-purple-100 shadow-xl shadow-purple-900/10 p-3 z-10 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900">Add Widget</span>
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </div>

                      {/* Widget List items */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 p-1.5 rounded-lg bg-emerald-50/70 border border-emerald-100/60">
                          <div className="h-5 w-5 rounded-md bg-[#25D366] text-white flex items-center justify-center text-[10px]">
                            💬
                          </div>
                          <span className="text-[11px] font-semibold text-emerald-900 truncate">
                            WhatsApp
                          </span>
                        </div>

                        <div className="flex items-center gap-2 p-1.5 rounded-lg bg-purple-50/70 border border-purple-100/60">
                          <div className="h-5 w-5 rounded-md bg-purple-600 text-white flex items-center justify-center text-[10px]">
                            📣
                          </div>
                          <span className="text-[11px] font-semibold text-purple-900 truncate">
                            Announcement
                          </span>
                        </div>

                        <div className="flex items-center gap-2 p-1.5 rounded-lg bg-blue-50/70 border border-blue-100/60">
                          <div className="h-5 w-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px]">
                            ✉️
                          </div>
                          <span className="text-[11px] font-semibold text-blue-900 truncate">
                            Contact Form
                          </span>
                        </div>

                        <div className="flex items-center gap-2 p-1.5 rounded-lg bg-amber-50/70 border border-amber-100/60">
                          <div className="h-5 w-5 rounded-md bg-amber-500 text-white flex items-center justify-center text-[10px]">
                            ⏱️
                          </div>
                          <span className="text-[11px] font-semibold text-amber-900 truncate">
                            Countdown
                          </span>
                        </div>
                      </div>

                      <Link
                        to="/widgets"
                        className="mt-2 block w-full py-1 text-center rounded-lg bg-purple-50 hover:bg-purple-100 text-[11px] font-bold text-purple-700 transition-colors"
                      >
                        + More Widgets
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. STATISTICS STRIP
          ==================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-purple-900/5 p-6 sm:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            {/* Stat 1 */}
            <div className="flex items-center gap-4 pt-4 lg:pt-0">
              <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">50+</p>
                <p className="text-xs text-slate-500 font-medium">Ready Widgets</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-4 pt-4 lg:pt-0 lg:pl-8">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
                <LayoutTemplate className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">100+</p>
                <p className="text-xs text-slate-500 font-medium">Website Templates</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-4 pt-4 lg:pt-0 lg:pl-8">
              <div className="h-12 w-12 rounded-2xl bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-100 flex items-center justify-center shrink-0">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">1-Click</p>
                <p className="text-xs text-slate-500 font-medium">Setup</p>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-4 pt-4 lg:pt-0 lg:pl-8">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                  Works Everywhere
                </p>
                <p className="text-xs text-slate-500 font-medium">Any website or platform</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. MAIN WIDGET EXPLORER – SIDEBAR LAYOUT (Core Feature)
          ==================================================================== */}
      <section
        id="features"
        ref={explorerSectionRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-28"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Category & Filter Sidebar (approx 240px) */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-purple-900/5 p-5 sticky top-28">
              {/* Search input */}
              <div className="relative mb-4">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search widgets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Categories list */}
              <div className="space-y-1">
                {EXPLORER_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCat === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCat(cat.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                        isActive
                          ? "bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/20"
                          : "text-slate-700 hover:bg-slate-50 hover:text-purple-600"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`h-4 w-4 shrink-0 ${
                            isActive ? "text-white" : "text-slate-400"
                          }`}
                        />
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Widget Content Area */}
          <main className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {selectedCat === "All" && !searchQuery ? "Popular Widgets" : `${selectedCat} Widgets`}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Explore our most used and loved widgets for websites.
                </p>
              </div>

              <Link
                to="/widgets"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors shrink-0 group"
              >
                <span>View All Widgets</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Widget Cards Grid (3 cards per row on desktop) */}
            {displayedWidgets.length === 0 ? (
              <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
                <Search className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                <p className="text-base font-bold text-slate-800">No widgets found</p>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your search query or select another category.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCat("All");
                    setSearchQuery("");
                  }}
                  className="mt-4 text-xs font-semibold text-purple-600 hover:underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedWidgets.map((widget) => {
                  return (
                    <div
                      key={widget.id}
                      className="group rounded-3xl border border-slate-100 bg-white shadow-xl shadow-purple-900/5 hover:shadow-2xl hover:shadow-purple-900/10 transition-all flex flex-col justify-between overflow-hidden p-5"
                    >
                      <div>
                        {/* Upper Preview Area */}
                        <div className="relative h-36 rounded-2xl bg-gradient-to-br from-slate-50 to-purple-50/40 border border-slate-100/80 flex items-center justify-center p-4 mb-4 overflow-hidden">
                          {/* Badge */}
                          {widget.badge && (
                            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-purple-600 text-white shadow-sm">
                              {widget.badge}
                            </div>
                          )}

                          {/* Render Realistic Widget Preview Thumbnail */}
                          {widget.id === "whatsapp-chat" && (
                            <div className="flex flex-col items-center">
                              <div className="h-14 w-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 transition-transform group-hover:scale-110">
                                <svg
                                  className="h-8 w-8 fill-current"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.587 1.961.954 3.018.954h.001c3.18 0 5.767-2.587 5.768-5.766.001-3.18-2.585-5.767-5.766-5.767zm0 10.372h-.001c-.902 0-1.786-.242-2.556-.7l-.183-.109-1.897.498.506-1.849-.12-.191c-.503-.799-.768-1.73-.767-2.687.001-2.502 2.036-4.537 4.539-4.537 2.503 0 4.538 2.035 4.539 4.538-.001 2.502-2.036 4.537-4.538 4.537z" />
                                </svg>
                              </div>
                            </div>
                          )}

                          {widget.id === "announcement-bar" && (
                            <div className="w-full">
                              <div className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 text-white text-[11px] font-semibold text-center shadow-md flex items-center justify-center gap-1.5 truncate">
                                <span>New Update! Check out our new features</span>
                                <ArrowRight className="h-3 w-3 shrink-0" />
                              </div>
                            </div>
                          )}

                          {widget.id === "countdown" && (
                            <div className="w-full max-w-[200px] bg-slate-900 text-white rounded-xl p-2.5 text-center shadow-lg">
                              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                                Sale Ends In
                              </p>
                              <div className="font-mono text-base font-black text-purple-300 tracking-wider">
                                {format2(timeRemaining.hours)} : {format2(timeRemaining.minutes)} :{" "}
                                {format2(timeRemaining.seconds)}
                              </div>
                            </div>
                          )}

                          {widget.id === "contact-form" && (
                            <div className="w-full max-w-[190px] bg-white rounded-xl border border-slate-200/80 p-2.5 shadow-sm space-y-1.5">
                              <div className="h-4 rounded bg-slate-100 border border-slate-200/50 px-2 text-[9px] text-slate-400 flex items-center">
                                Name
                              </div>
                              <div className="h-4 rounded bg-slate-100 border border-slate-200/50 px-2 text-[9px] text-slate-400 flex items-center">
                                Email
                              </div>
                              <div className="h-4 rounded bg-purple-600 text-white text-[8px] font-bold flex items-center justify-center">
                                Send Message
                              </div>
                            </div>
                          )}

                          {widget.id === "popup" && (
                            <div className="w-full max-w-[210px] bg-white rounded-xl border border-slate-200/80 p-2.5 text-center shadow-lg">
                              <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-1 text-xs">
                                ✉️
                              </div>
                              <p className="text-[11px] font-black text-slate-800">
                                Subscribe to newsletter
                              </p>
                              <div className="mt-1.5 flex gap-1">
                                <div className="h-4 flex-1 rounded bg-slate-100 px-1 text-[8px] text-slate-400 flex items-center">
                                  Enter email...
                                </div>
                                <div className="h-4 w-4 rounded bg-purple-600 text-white text-[8px] flex items-center justify-center">
                                  →
                                </div>
                              </div>
                            </div>
                          )}

                          {widget.id === "testimonial-slider" && (
                            <div className="w-full max-w-[210px] bg-white rounded-xl border border-slate-200/80 p-2.5 shadow-sm text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <div className="h-5 w-5 rounded-full bg-slate-200 text-[10px] font-bold flex items-center justify-center">
                                  👤
                                </div>
                                <div className="text-[10px] text-amber-500 font-bold">★★★★★</div>
                              </div>
                              <p className="text-[9px] text-slate-500 italic line-clamp-1">
                                “Clean, fast and easy to setup on our site!”
                              </p>
                            </div>
                          )}

                          {/* Fallback for other widgets */}
                          {![
                            "whatsapp-chat",
                            "announcement-bar",
                            "countdown",
                            "contact-form",
                            "popup",
                            "testimonial-slider",
                          ].includes(widget.id) && (
                            <div className="flex flex-col items-center gap-2">
                              <div className="h-12 w-12 rounded-2xl bg-white border border-purple-100 text-purple-600 flex items-center justify-center shadow-sm">
                                <widget.icon className="h-6 w-6" />
                              </div>
                              <span className="text-xs font-semibold text-slate-600">
                                {widget.name}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                          {widget.name}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                          {widget.description}
                        </p>
                      </div>

                      {/* Bottom Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 mt-5 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setPreviewWidget(widget)}
                          className="w-full py-2 px-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-slate-400" />
                          <span>Preview</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddWidget(widget.type)}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/20 text-center flex items-center justify-center gap-1 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Widget</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </section>

      {/* ====================================================================
          5. EXPLORE BY CATEGORY SECTION
          ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-28">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Find the right widget for your project.
            </p>
          </div>

          <Link
            to="/widgets"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors shrink-0 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORY_TILES.map((tile) => {
            const Icon = tile.icon;
            return (
              <button
                key={tile.id}
                type="button"
                onClick={() => handleSelectCategory(tile.id)}
                className={`flex flex-col items-center text-center p-6 rounded-3xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${tile.color} group`}
              >
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <Icon className={`h-6 w-6 ${tile.iconColor}`} />
                </div>
                <h4 className="text-sm font-bold text-slate-900">{tile.name}</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{tile.count}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ====================================================================
          6. BENEFITS SECTION
          ==================================================================== */}
      <section id="benefits" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-28">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-purple-900/5 p-8 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x divide-slate-100">
            {/* Benefit 1 */}
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
                <Code2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Easy Setup</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Add widgets to your site in seconds. Paste one snippet and customize visually.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-start gap-4 md:pl-8">
              <div className="h-12 w-12 rounded-2xl bg-pink-50 text-pink-600 border border-pink-100 flex items-center justify-center shrink-0">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Lightweight & Fast</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Optimized for performance, zero layout shift and sub-millisecond execution.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex items-start gap-4 md:pl-8">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Works Everywhere</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Compatible with WordPress, Shopify, Webflow, Wix, Squarespace or custom HTML.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. PRICING SECTION
          ==================================================================== */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-28 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-purple-600 bg-purple-100/70 px-3 py-1 rounded-full mb-3">
            Pricing Plans
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            Start for free and scale as your traffic grows. No credit card required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Free Plan */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-900">Free Plan</h3>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Everything you need to try out widgets on your website.
              </p>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">$0</span>
                <span className="text-xs font-semibold text-slate-500">/ forever</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Up to 10 active widgets</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>All standard widget types</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Instant CDN embed script</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Full mobile responsiveness</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Community support</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100">
              <Link
                to="/widgets"
                className="w-full block py-2.5 px-4 rounded-xl border border-slate-200 text-center text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </div>

          {/* Pro Plan (Featured) */}
          <div className="relative rounded-3xl border-2 border-purple-600 bg-gradient-to-b from-purple-50/40 via-white to-white p-7 sm:p-8 flex flex-col justify-between shadow-xl shadow-purple-900/10">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm">
              Most Popular
            </span>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-purple-900">Pro Plan</h3>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Unlimited power and styling for growing businesses.
              </p>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">$9</span>
                <span className="text-xs font-semibold text-slate-500">/ month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-purple-600 font-bold shrink-0" />
                  <span className="font-semibold text-slate-900">Unlimited website widgets</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-purple-600 font-bold shrink-0" />
                  <span>All 8+ premium design templates</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-purple-600 font-bold shrink-0" />
                  <span>Remove "WebToolOcean" watermark</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-purple-600 font-bold shrink-0" />
                  <span>Priority CDN edge routing & speed</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-purple-600 font-bold shrink-0" />
                  <span>Custom CSS and fine-tuned themes</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-purple-600 font-bold shrink-0" />
                  <span>Priority email & chat support</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-purple-100">
              <button
                type="button"
                onClick={() => {
                  toast.success("Thank you for your interest! Pro billing checkout is launching soon.");
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>

          {/* Agency Plan */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-900">Agency</h3>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                For digital agencies managing multiple client websites.
              </p>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">$29</span>
                <span className="text-xs font-semibold text-slate-500">/ month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-900">Unlimited client websites</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Multi-account client workspaces</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>White-label embed script option</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Dedicated SLA & uptime guarantee</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Dedicated account manager</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100">
              <a
                href="mailto:support@webtoolocean.com?subject=Agency%20Plan%20Inquiry"
                className="w-full block py-2.5 px-4 rounded-xl border border-slate-200 text-center text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          8. FINAL CTA SECTION
          ==================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-28">
        <div className="relative rounded-3xl bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 p-8 sm:p-14 text-center text-white shadow-2xl shadow-purple-900/20 overflow-hidden">
          {/* Subtle background decorative shapes */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-pink-400/20 blur-2xl" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 text-white">
              Ready to enhance your website?
            </h2>
            <p className="text-base sm:text-lg text-purple-100 font-medium mb-8">
              Start adding powerful widgets today. No credit card required.
            </p>
            <Link
              to="/widgets"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base bg-white text-slate-900 hover:bg-slate-50 shadow-xl transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>Explore Widgets</span>
              <ArrowRight className="h-5 w-5 text-purple-600" />
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================
          8. FOOTER – CLEAN 4 COLUMNS, STRICTLY NO NEWSLETTER
          ==================================================================== */}
      <footer className="border-t border-slate-200/80 bg-white pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
            {/* Column 1 – Brand (Spans 2 columns on lg) */}
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="inline-block">
                <img
                  src="/logo.png"
                  alt="Website Widgets by WebToolOcean"
                  className="h-9 w-auto object-contain"
                />
              </Link>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                A complete widget library to make your website more engaging, interactive and
                conversion friendly.
              </p>

              {/* Supported Social Media Icons */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                  aria-label="Twitter / X"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2 – Product */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-4">
                Product
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li>
                  <Link to="/widgets" className="hover:text-purple-600 transition-colors">
                    Widgets
                  </Link>
                </li>
                <li>
                  <Link to="/templates" className="hover:text-purple-600 transition-colors">
                    Templates
                  </Link>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-purple-600 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <Link to="/integrations" className="hover:text-purple-600 transition-colors">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 – Resources */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-4">
                Resources
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li>
                  <Link to="/widgets" className="hover:text-purple-600 transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:support@webtoolocean.com"
                    className="hover:text-purple-600 transition-colors"
                  >
                    Support
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-purple-600 transition-colors">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4 – Company */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-4">
                Company
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li>
                  <button
                    type="button"
                    onClick={() => setPolicyModal("about")}
                    className="hover:text-purple-600 transition-colors text-left cursor-pointer"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <a
                    href="https://webtoolocean.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-purple-600 transition-colors inline-flex items-center gap-1"
                  >
                    <span>WebToolOcean.com</span>
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:contact@webtoolocean.com"
                    className="hover:text-purple-600 transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Legal Links */}
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 WebToolOcean. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setPolicyModal("privacy")}
                className="hover:text-purple-600 transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => setPolicyModal("terms")}
                className="hover:text-purple-600 transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
              <button
                type="button"
                onClick={() => setPolicyModal("cookies")}
                className="hover:text-purple-600 transition-colors cursor-pointer"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ====================================================================
          9. WIDGET LIVE PREVIEW MODAL
          ==================================================================== */}
      {previewWidget && (
        <Dialog open={Boolean(previewWidget)} onOpenChange={() => setPreviewWidget(null)}>
          <DialogContent className="max-w-xl p-6 rounded-3xl bg-white border border-slate-100 shadow-2xl">
            <DialogHeader className="mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
                  <previewWidget.icon className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    {previewWidget.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500">
                    {previewWidget.category} • Free & ready to install
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Interactive Preview Body */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6 flex items-center justify-center min-h-[220px]">
              {previewWidget.id === "whatsapp-chat" && (
                <div className="w-full max-w-sm rounded-2xl bg-white border border-slate-100 p-4 shadow-xl shadow-emerald-900/10 space-y-3">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <div className="h-10 w-10 rounded-full bg-[#25D366] text-white flex items-center justify-center text-lg">
                      💬
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Support Team</p>
                      <p className="text-[11px] text-emerald-600 font-medium">● Typically replies instantly</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700 leading-relaxed">
                    Hi there! 👋 How can we help you customize your website widgets today?
                  </div>
                  <a
                    href="https://wa.me"
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full py-2 text-center rounded-xl bg-[#25D366] text-white text-xs font-bold shadow-md hover:opacity-95"
                  >
                    Start Chat on WhatsApp
                  </a>
                </div>
              )}

              {previewWidget.id === "announcement-bar" && (
                <div className="w-full space-y-3">
                  <div className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 text-white text-xs font-bold text-center shadow-lg flex items-center justify-center gap-2">
                    <span>🎉 Special Launch Discount: Get 30% OFF Pro Plans this week!</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-center text-[11px] text-slate-400">
                    Previewing top announcement banner style.
                  </p>
                </div>
              )}

              {previewWidget.id === "countdown" && (
                <div className="w-full max-w-sm rounded-2xl bg-slate-900 text-white p-6 text-center shadow-2xl">
                  <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">
                    Flash Sale Ends In
                  </p>
                  <div className="font-mono text-3xl font-black text-white tracking-widest mb-4">
                    {format2(timeRemaining.hours)} : {format2(timeRemaining.minutes)} :{" "}
                    {format2(timeRemaining.seconds)}
                  </div>
                  <div className="flex justify-center gap-6 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    <span>Hours</span>
                    <span>Minutes</span>
                    <span>Seconds</span>
                  </div>
                </div>
              )}

              {previewWidget.id === "popup" && (
                <div className="w-full max-w-sm rounded-2xl bg-white border border-purple-100 p-6 text-center shadow-xl">
                  <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-2 text-lg">
                    ✉️
                  </div>
                  <h4 className="text-base font-black text-slate-900">Unlock 15% Off</h4>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Subscribe to receive product updates and member discounts.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      readOnly
                      value="example@company.com"
                      className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
                    >
                      Join
                    </button>
                  </div>
                </div>
              )}

              {previewWidget.id === "testimonial-slider" && (
                <div className="w-full max-w-sm rounded-2xl bg-white border border-slate-100 p-6 shadow-xl text-center">
                  <div className="text-amber-400 text-sm font-bold mb-2">★★★★★</div>
                  <p className="text-xs text-slate-700 italic leading-relaxed mb-3">
                    “Website Widgets helped us increase visitor engagement by 40% in our first week.
                    Setup was super fast without writing code!”
                  </p>
                  <p className="text-xs font-bold text-slate-900">Sarah Jenkins</p>
                  <p className="text-[10px] text-slate-400">Head of Marketing, SaaSify</p>
                </div>
              )}

              {![
                "whatsapp-chat",
                "announcement-bar",
                "countdown",
                "popup",
                "testimonial-slider",
              ].includes(previewWidget.id) && (
                <div className="text-center p-4">
                  <div className="h-16 w-16 rounded-3xl bg-white border border-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3 shadow-md">
                    <previewWidget.icon className="h-8 w-8" />
                  </div>
                  <h4 className="text-base font-bold text-slate-800">{previewWidget.name}</h4>
                  <p className="text-xs text-slate-500 max-w-xs mt-1">
                    {previewWidget.description}
                  </p>
                </div>
              )}
            </div>

            {/* Modal actions */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setPreviewWidget(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const type = previewWidget.type;
                  setPreviewWidget(null);
                  handleAddWidget(type);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Add & Customize Widget</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ====================================================================
          10. LEGAL & ABOUT MODAL DIALOG
          ==================================================================== */}
      {policyModal && (
        <Dialog open={Boolean(policyModal)} onOpenChange={() => setPolicyModal(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border-slate-200 bg-white shadow-2xl">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl sm:text-2xl font-black text-slate-900">
                {policyModal === "privacy" && "Privacy Policy"}
                {policyModal === "terms" && "Terms of Service"}
                {policyModal === "cookies" && "Cookie Policy"}
                {policyModal === "about" && "About Website Widgets by WebToolOcean"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Last updated: November 2026 • WebToolOcean
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {policyModal === "privacy" && (
                <>
                  <p>
                    At WebToolOcean, we respect your privacy and are committed to protecting your personal data.
                    This Privacy Policy explains how our widget services handle information.
                  </p>
                  <h4 className="font-bold text-slate-800 text-sm pt-2">Data Collection & Usage</h4>
                  <p>
                    When visitors view widgets embedded on client sites, our CDN serves lightweight scripts and assets.
                    We do not sell personal information or build cross-site tracking profiles. Any information submitted
                    via contact or form widgets is transmitted securely to the widget owner.
                  </p>
                  <h4 className="font-bold text-slate-800 text-sm pt-2">Security</h4>
                  <p>
                    All API communications and widget delivery use modern TLS encryption. We maintain strict access
                    controls and industry-standard security safeguards.
                  </p>
                </>
              )}

              {policyModal === "terms" && (
                <>
                  <p>
                    By using Website Widgets provided by WebToolOcean, you agree to these Terms of Service.
                  </p>
                  <h4 className="font-bold text-slate-800 text-sm pt-2">Service Usage</h4>
                  <p>
                    You may embed widgets on your authorized domains. You agree not to use the widgets for unlawful
                    activities, transmitting malicious scripts, or violating third-party intellectual property.
                  </p>
                  <h4 className="font-bold text-slate-800 text-sm pt-2">Service Availability</h4>
                  <p>
                    We deliver widgets via high-speed global edge networks. We strive for 99.9% uptime and continuous
                    service enhancements.
                  </p>
                </>
              )}

              {policyModal === "cookies" && (
                <>
                  <p>
                    This Cookie Policy explains how cookies and browser storage are utilized by Website Widgets.
                  </p>
                  <h4 className="font-bold text-slate-800 text-sm pt-2">Essential Functionality</h4>
                  <p>
                    Some widgets, such as announcement bars and popups, use local browser storage to remember when a
                    visitor has dismissed a notification so it is not shown repeatedly during the same session.
                  </p>
                  <p>
                    We do not use invasive third-party tracking cookies or store personally identifiable data in cookies.
                  </p>
                </>
              )}

              {policyModal === "about" && (
                <>
                  <p>
                    Website Widgets by WebToolOcean empowers creators, businesses, and agencies to embed
                    high-converting, responsive interactive widgets onto any website with a single JavaScript snippet.
                  </p>
                  <h4 className="font-bold text-slate-800 text-sm pt-2">Our Mission</h4>
                  <p>
                    To eliminate complex custom code and heavy plugins by providing modern, lightweight, beautifully
                    crafted widgets that load in milliseconds and work smoothly across WordPress, Shopify, Webflow,
                    Squarespace, and custom platforms.
                  </p>
                  <h4 className="font-bold text-slate-800 text-sm pt-2">Get in Touch</h4>
                  <p>
                    Have questions or custom widget requests? Contact our team at{" "}
                    <a href="mailto:support@webtoolocean.com" className="text-purple-600 font-bold hover:underline">
                      support@webtoolocean.com
                    </a>.
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setPolicyModal(null)}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

