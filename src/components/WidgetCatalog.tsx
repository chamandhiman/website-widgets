import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Search,
  Plus,
  ExternalLink,
  Layers,
  Sparkles,
  Star,
  Users,
  MessageCircle,
  FileText,
  Megaphone,
  BookOpen,
  Wrench,
  Filter,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, WIDGETS, SCHEMAS, type WidgetDef, type Category, getPlanUsage } from "@/lib/widgets";
import { MarketplaceWidgetPreview } from "./MarketplaceWidgetPreview";
import { WhatsAppLivePreview, WhatsAppIcon } from "@/components/whatsapp/WhatsAppLivePreview";
import { DEFAULT_WHATSAPP_CONFIG } from "@/lib/whatsapp/types";
import { AnnouncementLivePreview } from "@/components/announcement/AnnouncementLivePreview";
import { DEFAULT_ANNOUNCEMENT_CONFIG } from "@/lib/announcement/types";
import { PopupLivePreview } from "@/components/popup/PopupLivePreview";
import { DEFAULT_POPUP_CONFIG } from "@/lib/popup/types";
import { FaqLivePreview } from "@/components/faq/FaqLivePreview";
import { DEFAULT_FAQ_CONFIG } from "@/lib/faq/types";
import { CountdownLivePreview } from "@/components/countdown/CountdownLivePreview";
import { DEFAULT_COUNTDOWN_CONFIG } from "@/lib/countdown/types";
import { EventCalendarLivePreview } from "@/components/calendar/EventCalendarLivePreview";
import { DEFAULT_EVENT_CALENDAR_CONFIG } from "@/lib/calendar/types";
import { TestimonialSliderLivePreview } from "@/components/testimonial/TestimonialSliderLivePreview";
import { DEFAULT_TESTIMONIAL_CONFIG } from "@/lib/testimonial/types";
import { LogoCarouselLivePreview } from "@/components/logo-carousel/LogoCarouselLivePreview";
import { DEFAULT_LOGO_CAROUSEL_CONFIG } from "@/lib/logo-carousel/types";
import { WidgetPreview } from "@/components/WidgetPreview";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Category metadata with icons & friendly titles matching CATEGORIES
const CATEGORY_ITEMS: { id: "All" | Category; label: string; icon: any }[] = [
  { id: "All", label: "All Widgets", icon: Layers },
  { id: "Social", label: "Social", icon: Users },
  { id: "Reviews", label: "Reviews", icon: Star },
  { id: "Chat", label: "Chat", icon: MessageCircle },
  { id: "Forms", label: "Forms", icon: FileText },
  { id: "Promotion", label: "Promotion", icon: Megaphone },
  { id: "Content", label: "Content", icon: BookOpen },
  { id: "Utility", label: "Utility", icon: Wrench },
];

// Curated icon colors for widget cards
const WIDGET_ICON_STYLES: Record<string, string> = {
  "google-reviews": "bg-red-50 text-red-600 border border-red-100",
  "instagram-feed": "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white",
  "event-calendar": "bg-red-50 text-red-600 border border-red-100",
  "logo-carousel": "bg-purple-50 text-[#7c3aed] border border-purple-100",
  faq: "bg-teal-50 text-teal-600 border border-teal-100",
  countdown: "bg-amber-50 text-amber-600 border border-amber-100",
  "whatsapp-chat": "bg-emerald-50 text-emerald-600 border border-emerald-100",
  "announcement-bar": "bg-purple-50 text-purple-600 border border-purple-100",
  popup: "bg-pink-50 text-pink-600 border border-pink-100",
  "testimonial-slider": "bg-indigo-50 text-indigo-600 border border-indigo-100",
  testimonials: "bg-indigo-50 text-indigo-600 border border-indigo-100",
  "contact-form": "bg-blue-50 text-blue-600 border border-blue-100",
  "facebook-feed": "bg-blue-50 text-blue-600 border border-blue-100",
  "social-feed": "bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-100",
  "youtube-gallery": "bg-red-50 text-red-600 border border-red-100",
  accessibility: "bg-cyan-50 text-cyan-600 border border-cyan-100",
  "language-switcher": "bg-purple-50 text-purple-600 border border-purple-100",
  "store-locator": "bg-emerald-50 text-emerald-600 border border-emerald-100",
  "custom-html": "bg-slate-100 text-slate-700 border border-slate-200",
};

export function WidgetCatalog() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"All" | Category>("All");
  const [filterTab, setFilterTab] = useState<"all" | "popular" | "new">("all");
  const [sortBy, setSortBy] = useState<"popular" | "name" | "newest">("popular");
  const [demoWidget, setDemoWidget] = useState<WidgetDef | null>(null);
  const [demoMobile, setDemoMobile] = useState(false);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);

  // Calculate count for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: WIDGETS.length };
    WIDGETS.forEach((w) => {
      counts[w.category] = (counts[w.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter and sort widgets
  const filteredList = useMemo(() => {
    const query = q.trim().toLowerCase();

    let list = WIDGETS.filter((w) => {
      // 1. Category Filter
      if (cat !== "All" && w.category !== cat) return false;

      // 2. Search Filter
      if (query) {
        const matchesName = w.name.toLowerCase().includes(query);
        const matchesDesc = w.description.toLowerCase().includes(query);
        const matchesType = w.type.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesType) return false;
      }

      // 3. Tab Filter (All / Popular / New)
      if (filterTab === "popular" && w.badge !== "Popular" && w.badge !== "Trending") {
        return false;
      }
      if (filterTab === "new" && w.badge !== "New") {
        return false;
      }

      return true;
    });

    // 4. Sorting
    if (sortBy === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "newest") {
      list = [...list].sort((a, b) => (b.badge === "New" ? 1 : 0) - (a.badge === "New" ? 1 : 0));
    }

    return list;
  }, [q, cat, filterTab, sortBy]);

  const handleCreateClick = (w: WidgetDef) => {
    const usage = getPlanUsage();
    if (usage.count >= usage.limit) {
      toast.error(`You have reached the free plan limit (${usage.limit} widgets). Please upgrade to create more.`);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-4rem)]">
      {/* ================= 3. WHITE WIDGET CATEGORY SIDEBAR ================= */}
      {/* Desktop Category Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-slate-200/90 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 select-none">
        {/* Top: Search widgets input */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search widgets..."
            className="h-10 w-full pl-9 pr-4 rounded-xl border-slate-200 bg-slate-50/50 text-xs shadow-2xs placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-purple-500/20 focus-visible:border-purple-500"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Heading: Widget Categories */}
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100 mb-3 px-2">
          Widget Categories
        </h3>

        {/* Category List */}
        <nav className="flex flex-col gap-1">
          {CATEGORY_ITEMS.map((item) => {
            const isActive = cat === item.id;
            const count = categoryCounts[item.id] || 0;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCat(item.id)}
                aria-label={item.id === "All" ? "All" : item.id}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-150",
                  isActive
                    ? "bg-[#7c3aed]/10 text-[#7c3aed] font-bold shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-[#7c3aed]" : "text-slate-400 group-hover:text-slate-600"
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {/* Counter Badge */}
                <span
                  className={cn(
                    "grid h-5 min-w-[20px] place-items-center rounded-full px-1.5 text-[10px] font-bold",
                    isActive
                      ? "bg-[#7c3aed] text-white"
                      : "bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile/Tablet Category Drawer Header */}
      <div className="lg:hidden flex items-center justify-between gap-3 p-4 bg-white border-b border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search..."
            className="h-9 w-full pl-8 pr-3 rounded-lg text-xs border-slate-200 bg-slate-50"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCategoryDrawerOpen(!categoryDrawerOpen)}
          className="h-9 gap-1.5 text-xs rounded-lg border-slate-200 text-slate-700"
        >
          <Filter className="h-3.5 w-3.5" />
          <span>{cat === "All" ? "Categories" : cat}</span>
        </Button>
      </div>

      {/* Mobile Category Dropdown Bar */}
      {categoryDrawerOpen && (
        <div className="lg:hidden flex flex-wrap gap-1.5 p-3 bg-white border-b border-slate-200 animate-in fade-in duration-150">
          {CATEGORY_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCat(item.id);
                setCategoryDrawerOpen(false);
              }}
              aria-label={item.id === "All" ? "All" : item.id}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                cat === item.id
                  ? "bg-[#7c3aed] text-white font-bold"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              )}
            >
              {item.label} ({categoryCounts[item.id] || 0})
            </button>
          ))}
        </div>
      )}

      {/* ================= 4. MAIN WORKSPACE — CLEAN WIDGET MARKETPLACE ================= */}
      <section className="flex-1 p-5 md:p-8 lg:p-9 bg-[#f8fafc] dark:bg-zinc-950 overflow-y-auto">
        {/* Marketplace Header: Explore widgets + Subtitle + Filters & Sort */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-zinc-100">
            Explore widgets
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed dark:text-zinc-400">
            Choose a widget to add to your website. Beautiful designs, easy setup, and no coding required.
          </p>

          {/* Filter Toolbar: Filter Pills on Left, Sort on Right */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/70 dark:border-zinc-800">
            {/* Filter Tabs: All, Popular, New */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFilterTab("all")}
                aria-label="Filter All"
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-150",
                  filterTab === "all"
                    ? "bg-[#7c3aed] text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterTab("popular")}
                aria-label="Filter Popular"
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-150",
                  filterTab === "popular"
                    ? "bg-[#7c3aed] text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                Popular
              </button>
              <button
                type="button"
                onClick={() => setFilterTab("new")}
                aria-label="Filter New"
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-150",
                  filterTab === "new"
                    ? "bg-[#7c3aed] text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                New
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">Sort:</span>
              <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
                <SelectTrigger className="h-8.5 w-36 rounded-xl border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-2xs">
                  <SelectValue placeholder="Sort widgets" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  <SelectItem value="popular" className="text-xs">Most Popular</SelectItem>
                  <SelectItem value="newest" className="text-xs">Newest</SelectItem>
                  <SelectItem value="name" className="text-xs">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* ================= RESPONSIVE WIDGET CARDS GRID ================= */}
        {filteredList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
            <p className="text-base font-bold text-slate-800 mb-1">No widgets match your search</p>
            <p className="text-xs text-slate-500 mb-4">Try clearing your search or switching categories.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQ("");
                setCat("All");
                setFilterTab("all");
              }}
              className="text-xs rounded-xl"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((w) => {
              const iconStyle =
                WIDGET_ICON_STYLES[w.type] ||
                "bg-purple-50 text-[#7c3aed] border border-purple-100";
              const isWhatsApp = w.type === "whatsapp-chat";
              const designsCount = w.designsCount || (w.ready ? 6 : 2);

              return (
                <article
                  key={w.type}
                  className="group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200"
                >
                  {/* 1. REALISTIC VISUAL PREVIEW CONTAINER */}
                  <div className="relative h-[185px] w-full rounded-xl bg-slate-50/70 border border-slate-100 mb-4 overflow-hidden flex flex-col justify-center">
                    <MarketplaceWidgetPreview type={w.type} />
                  </div>

                  {/* 2. HEADER ROW: Icon + Widget Name + Badge */}
                  <div className="flex items-center gap-3 mb-1.5">
                    <div
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-xl shadow-2xs",
                        iconStyle
                      )}
                    >
                      {isWhatsApp ? (
                        <WhatsAppIcon className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <w.icon className="h-5 w-5" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
                        {w.name}
                      </h3>

                      {w.badge && (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider shrink-0",
                            w.badge === "Popular" && "bg-rose-50 text-rose-600 border border-rose-200/80",
                            w.badge === "New" && "bg-purple-50 text-purple-600 border border-purple-200/80",
                            w.badge === "Trending" && "bg-pink-50 text-pink-600 border border-pink-200/80"
                          )}
                        >
                          {w.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 3. CONCISE 2-LINE DESCRIPTION */}
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                    {w.description}
                  </p>

                  {/* 4. FOOTER ROW: Designs Count + Add Widget Button */}
                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium select-none">
                      <Layers className="h-3.5 w-3.5 text-slate-400" />
                      <span>{designsCount}+ Designs</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {w.ready ? (
                        <>
                          {/* Add Widget Button: matching mockup + test regex /create widget/i */}
                          <Link
                            to="/editor/$type"
                            params={{ type: w.type }}
                            onClick={() => handleCreateClick(w)}
                            aria-label={`Create Widget ${w.name}`}
                            className="flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-800 shadow-2xs hover:bg-[#7c3aed] hover:text-white hover:border-[#7c3aed] transition-all active:scale-98"
                          >
                            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                            <span>Add widget</span>
                            <span className="sr-only">Create Widget</span>
                          </Link>

                          {/* Quick View Demo Button */}
                          <button
                            type="button"
                            onClick={() => setDemoWidget(w)}
                            title="View interactive demo"
                            aria-label={`View Demo ${w.name}`}
                            className="flex h-7.5 w-7.5 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span className="sr-only">View Demo</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ================= FUNCTIONAL DEMO MODAL ================= */}
        {demoWidget && (
          <Dialog open={Boolean(demoWidget)} onOpenChange={(open) => !open && setDemoWidget(null)}>
            <DialogContent className="max-w-3xl overflow-hidden p-0 gap-0 sm:rounded-2xl border-slate-200">
              <DialogHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <DialogTitle className="text-lg font-bold text-slate-900">
                    {demoWidget.name} — Interactive Preview
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500 mt-0.5">
                    Live demo showing responsive layout and interactive controls.
                  </DialogDescription>
                </div>
              </DialogHeader>

              <div className="p-6 bg-slate-50 flex items-center justify-center min-h-[300px] overflow-auto">
                {demoWidget.type === "whatsapp-chat" ? (
                  <WhatsAppLivePreview config={DEFAULT_WHATSAPP_CONFIG} />
                ) : demoWidget.type === "announcement-bar" ? (
                  <AnnouncementLivePreview config={DEFAULT_ANNOUNCEMENT_CONFIG} />
                ) : demoWidget.type === "popup" ? (
                  <PopupLivePreview config={DEFAULT_POPUP_CONFIG} />
                ) : demoWidget.type === "faq" ? (
                  <FaqLivePreview config={DEFAULT_FAQ_CONFIG} />
                ) : demoWidget.type === "countdown" ? (
                  <CountdownLivePreview config={DEFAULT_COUNTDOWN_CONFIG} />
                ) : demoWidget.type === "event-calendar" ? (
                  <EventCalendarLivePreview config={DEFAULT_EVENT_CALENDAR_CONFIG} />
                ) : demoWidget.type === "testimonial-slider" || demoWidget.type === "testimonials" ? (
                  <TestimonialSliderLivePreview config={DEFAULT_TESTIMONIAL_CONFIG} />
                ) : demoWidget.type === "logo-carousel" ? (
                  <LogoCarouselLivePreview config={DEFAULT_LOGO_CAROUSEL_CONFIG} />
                ) : (
                  <WidgetPreview
                    type={demoWidget.type}
                    c={SCHEMAS[demoWidget.type]?.defaults ?? {}}
                    mobile={demoMobile}
                  />
                )}
              </div>

              <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between">
                <span className="text-xs text-slate-500">Ready to add this to your website?</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setDemoWidget(null)} className="text-xs">
                    Close
                  </Button>
                  <Button asChild size="sm" className="bg-[#7c3aed] text-white text-xs">
                    <Link to="/editor/$type" params={{ type: demoWidget.type }}>
                      + Add Widget
                    </Link>
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </section>
    </div>
  );
}
