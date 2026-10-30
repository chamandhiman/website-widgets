import { useState } from "react";
import {
  LayoutTemplate,
  Type,
  Sliders,
  Sparkles,
  Check,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  CALENDAR_DESIGNS,
  type CalendarDesignDefinition,
  type CalendarEvent,
  type EventCalendarConfig,
} from "@/lib/calendar/types";
import { formatCalendarDate, formatTimeRange } from "@/lib/calendar/calendarUtils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface EventCalendarConfigTabsProps {
  config: EventCalendarConfig;
  onChange: <K extends keyof EventCalendarConfig>(key: K, value: EventCalendarConfig[K]) => void;
  onSelectDesign: (design: CalendarDesignDefinition) => void;
  defaultTab?: string;
}

export function EventCalendarConfigTabs({
  config,
  onChange,
  onSelectDesign,
  defaultTab = "designs",
}: EventCalendarConfigTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Event modal state (Add / Edit)
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState<Partial<CalendarEvent>>({
    title: "",
    date: new Date().toISOString().slice(0, 10),
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    imageUrl: "",
    destinationUrl: "",
  });

  const handleOpenAddEvent = () => {
    setEditingEventId(null);
    setEventForm({
      title: "",
      date: new Date().toISOString().slice(0, 10),
      startTime: "10:00",
      endTime: "12:00",
      location: "",
      description: "",
      imageUrl: "",
      destinationUrl: "",
    });
    setEventModalOpen(true);
  };

  const handleOpenEditEvent = (event: CalendarEvent) => {
    setEditingEventId(event.id);
    setEventForm({ ...event });
    setEventModalOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    const updated = (config.events || []).filter((e) => e.id !== id);
    onChange("events", updated);
    toast.success("Event deleted");
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title?.trim()) {
      toast.error("Event title is required");
      return;
    }
    if (!eventForm.date?.trim()) {
      toast.error("Event date is required");
      return;
    }

    const currentEvents = config.events || [];

    if (editingEventId) {
      // Update existing
      const updated = currentEvents.map((ev) =>
        ev.id === editingEventId ? ({ ...ev, ...eventForm } as CalendarEvent) : ev
      );
      onChange("events", updated);
      toast.success("Event updated successfully");
    } else {
      // Add new
      const newEvent: CalendarEvent = {
        id: `ev-${Date.now()}`,
        title: eventForm.title.trim(),
        date: eventForm.date.trim(),
        startTime: eventForm.startTime?.trim() || "",
        endTime: eventForm.endTime?.trim() || "",
        location: eventForm.location?.trim() || "",
        description: eventForm.description?.trim() || "",
        imageUrl: eventForm.imageUrl?.trim() || "",
        destinationUrl: eventForm.destinationUrl?.trim() || "",
      };
      onChange("events", [...currentEvents, newEvent]);
      toast.success("Event added successfully");
    }

    setEventModalOpen(false);
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border bg-card shadow-soft overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-1 flex-col overflow-hidden"
      >
        {/* Tab Switcher: Designs -> Content -> Preferences */}
        <div className="border-b px-4 pt-3 pb-2 bg-muted/20 shrink-0">
          <TabsList className="grid w-full grid-cols-3 bg-muted/60 p-1">
            <TabsTrigger
              value="designs"
              className="flex items-center gap-1.5 text-xs font-semibold py-1.5"
            >
              <LayoutTemplate className="h-3.5 w-3.5" />
              <span>Designs</span>
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="flex items-center gap-1.5 text-xs font-semibold py-1.5"
            >
              <Type className="h-3.5 w-3.5" />
              <span>Content</span>
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="flex items-center gap-1.5 text-xs font-semibold py-1.5"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Preferences</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Scrollable Middle Area */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
          {/* ================= TAB 1: DESIGNS ================= */}
          <TabsContent value="designs" className="mt-0 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                  Select Calendar Design
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Choose from 6 unique, professionally crafted calendar layouts.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                6 Templates
              </span>
            </div>

            {/* Design Cards */}
            <div className="space-y-3">
              {CALENDAR_DESIGNS.map((design) => {
                const isSelected = config.designId === design.id;

                return (
                  <div
                    key={design.id}
                    onClick={() => onSelectDesign(design)}
                    className={cn(
                      "group relative cursor-pointer rounded-2xl border p-4 transition-all duration-200",
                      isSelected
                        ? "border-purple-600 bg-purple-50/50 dark:bg-purple-950/20 shadow-xs ring-1 ring-purple-600"
                        : "border-border/80 bg-background hover:border-purple-300 dark:hover:border-purple-800 hover:shadow-2xs"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {design.name}
                          </h4>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                              isSelected
                                ? "bg-purple-600 text-white"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {design.badge}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {design.description}
                        </p>
                      </div>

                      <div
                        className={cn(
                          "grid h-6 w-6 place-items-center rounded-full shrink-0 transition-colors",
                          isSelected
                            ? "bg-purple-600 text-white"
                            : "border border-border bg-background text-transparent group-hover:border-purple-300"
                        )}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    </div>

                    {/* Miniature Design Preview Illustration */}
                    <div className="mt-3 rounded-xl border border-border/60 bg-slate-50 dark:bg-slate-900/60 p-2.5 overflow-hidden">
                      {design.id === "minimal-list" && (
                        <div className="space-y-1.5">
                          {[1, 2].map((i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between rounded-lg bg-card p-1.5 border border-border/40"
                            >
                              <div className="flex items-center gap-2">
                                <span className="h-4 w-7 rounded bg-purple-100 dark:bg-purple-950" />
                                <span className="h-2 w-20 rounded bg-slate-300 dark:bg-slate-700" />
                              </div>
                              <span className="h-2 w-12 rounded bg-slate-200 dark:bg-slate-800" />
                            </div>
                          ))}
                        </div>
                      )}

                      {design.id === "modern-cards" && (
                        <div className="grid grid-cols-2 gap-2">
                          {[1, 2].map((i) => (
                            <div
                              key={i}
                              className="rounded-lg bg-card p-2 border border-border/40 space-y-1.5"
                            >
                              <div className="h-7 w-full rounded bg-purple-100 dark:bg-purple-950/60" />
                              <div className="h-2 w-3/4 rounded bg-slate-300 dark:bg-slate-700" />
                              <div className="h-1.5 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
                            </div>
                          ))}
                        </div>
                      )}

                      {design.id === "monthly-grid" && (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center px-1">
                            <span className="h-2 w-14 rounded bg-purple-300 dark:bg-purple-800" />
                            <div className="flex gap-1">
                              <span className="h-2 w-2 rounded bg-slate-300" />
                              <span className="h-2 w-2 rounded bg-slate-300" />
                            </div>
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: 14 }).map((_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "h-4 rounded grid place-items-center text-[8px]",
                                  i === 4
                                    ? "bg-purple-600 text-white font-bold"
                                    : "bg-card border border-border/30 text-slate-400"
                                )}
                              >
                                {i + 1}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {design.id === "agenda" && (
                        <div className="space-y-1 pl-3 relative before:absolute before:left-1 before:top-1 before:bottom-1 before:w-0.5 before:bg-purple-300">
                          <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                            <span className="h-2 w-16 rounded bg-slate-400" />
                          </div>
                          <div className="rounded bg-card p-1.5 border border-border/40">
                            <span className="h-2 w-24 rounded bg-slate-300 block mb-1" />
                            <span className="h-1.5 w-12 rounded bg-slate-200 block" />
                          </div>
                        </div>
                      )}

                      {design.id === "compact" && (
                        <div className="space-y-1">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 rounded bg-card p-1 border border-border/40"
                            >
                              <span className="h-3 w-5 rounded bg-purple-100 text-[8px]" />
                              <span className="h-2 w-24 rounded bg-slate-300" />
                            </div>
                          ))}
                        </div>
                      )}

                      {design.id === "featured" && (
                        <div className="flex gap-2 rounded-lg bg-card p-1.5 border border-border/40">
                          <div className="h-10 w-14 rounded bg-purple-200 dark:bg-purple-900 shrink-0" />
                          <div className="flex-1 space-y-1">
                            <span className="h-2 w-20 rounded bg-slate-300 block" />
                            <span className="h-1.5 w-28 rounded bg-slate-200 block" />
                            <span className="h-2 w-10 rounded bg-purple-500 block" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* ================= TAB 2: CONTENT ================= */}
          <TabsContent value="content" className="mt-0 space-y-6">
            {/* Header Settings */}
            <div className="space-y-3 rounded-2xl border border-border/80 bg-muted/10 p-4">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Calendar Title & Heading
              </h4>

              <div className="space-y-1.5">
                <Label htmlFor="cal-title" className="text-xs font-semibold">
                  Calendar Title
                </Label>
                <Input
                  id="cal-title"
                  value={config.title}
                  onChange={(e) => onChange("title", e.target.value)}
                  placeholder="Upcoming Events"
                  className="h-9 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cal-desc" className="text-xs font-semibold">
                  Short Description (Optional)
                </Label>
                <Textarea
                  id="cal-desc"
                  value={config.description || ""}
                  onChange={(e) => onChange("description", e.target.value)}
                  placeholder="Browse our upcoming workshops, live webinars, and community meetups."
                  rows={2}
                  className="rounded-xl text-xs font-medium resize-none"
                />
              </div>
            </div>

            {/* Events Manager */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    Events ({(config.events || []).length})
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Add, edit, or remove calendar events.
                  </p>
                </div>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleOpenAddEvent}
                  className="h-8 gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Event</span>
                </Button>
              </div>

              {/* Event List */}
              <div className="space-y-2.5">
                {(!config.events || config.events.length === 0) && (
                  <div className="rounded-xl border border-dashed p-6 text-center text-xs text-muted-foreground">
                    No events added yet. Click &quot;Add Event&quot; to create your first event.
                  </div>
                )}

                {(config.events || []).map((event) => {
                  const timeRange = formatTimeRange(
                    event.startTime,
                    event.endTime,
                    config.timeFormat
                  );

                  return (
                    <div
                      key={event.id}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-background p-3 hover:border-purple-300 dark:hover:border-purple-800 transition-colors shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 text-xs font-bold shrink-0">
                          <Calendar className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 space-y-0.5">
                          <h5 className="text-xs font-bold text-foreground truncate">
                            {event.title}
                          </h5>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground truncate">
                            <span>{formatCalendarDate(event.date, config.dateFormat)}</span>
                            {timeRange && <span>• {timeRange}</span>}
                            {event.location && <span>• {event.location}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEditEvent(event)}
                          className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          title="Edit Event"
                          aria-label={`Edit ${event.title}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                          title="Delete Event"
                          aria-label={`Delete ${event.title}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* ================= TAB 3: PREFERENCES ================= */}
          <TabsContent value="preferences" className="mt-0 space-y-5">
            <div className="space-y-4 rounded-2xl border border-border/80 bg-muted/10 p-4">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Display & Visibility
              </h4>

              {/* Upcoming Only Toggle */}
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <Label htmlFor="pref-upcoming" className="text-xs font-semibold cursor-pointer">
                    Upcoming Events Only
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Automatically hides events that took place in the past.
                  </p>
                </div>
                <Switch
                  id="pref-upcoming"
                  checked={config.upcomingOnly}
                  onCheckedChange={(val) => onChange("upcomingOnly", val)}
                />
              </div>

              {/* Show Descriptions */}
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <Label htmlFor="pref-desc" className="text-xs font-semibold cursor-pointer">
                    Show Descriptions
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Display short description snippet beneath event title.
                  </p>
                </div>
                <Switch
                  id="pref-desc"
                  checked={config.showDescriptions}
                  onCheckedChange={(val) => onChange("showDescriptions", val)}
                />
              </div>

              {/* Show Locations */}
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <Label htmlFor="pref-loc" className="text-xs font-semibold cursor-pointer">
                    Show Locations
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Display physical or virtual event location.
                  </p>
                </div>
                <Switch
                  id="pref-loc"
                  checked={config.showLocations}
                  onCheckedChange={(val) => onChange("showLocations", val)}
                />
              </div>

              {/* Show Images */}
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <Label htmlFor="pref-img" className="text-xs font-semibold cursor-pointer">
                    Show Event Images
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Display card and banner thumbnails when image URL is provided.
                  </p>
                </div>
                <Switch
                  id="pref-img"
                  checked={config.showImages}
                  onCheckedChange={(val) => onChange("showImages", val)}
                />
              </div>

              {/* Max Events Slider */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <div className="flex items-center justify-between text-xs">
                  <Label className="font-semibold">Maximum Events to Display</Label>
                  <span className="font-mono font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded">
                    {config.maxEvents} events
                  </span>
                </div>
                <Slider
                  value={[config.maxEvents || 10]}
                  min={1}
                  max={25}
                  step={1}
                  onValueChange={([val]) => onChange("maxEvents", val)}
                  className="py-1"
                />
              </div>
            </div>

            {/* Date & Time Formatting */}
            <div className="space-y-4 rounded-2xl border border-border/80 bg-muted/10 p-4">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Date & Time Format
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Date Format</Label>
                  <Select
                    value={config.dateFormat}
                    onValueChange={(val: any) => onChange("dateFormat", val)}
                  >
                    <SelectTrigger className="h-9 rounded-xl text-xs font-medium">
                      <SelectValue placeholder="Select Date Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MMM D, YYYY">MMM D, YYYY (Apr 15, 2027)</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (04/15/2027)</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (15/04/2027)</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2027-04-15)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Time Format</Label>
                  <Select
                    value={config.timeFormat}
                    onValueChange={(val: any) => onChange("timeFormat", val)}
                  >
                    <SelectTrigger className="h-9 rounded-xl text-xs font-medium">
                      <SelectValue placeholder="Select Time Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-Hour (e.g. 2:30 PM)</SelectItem>
                      <SelectItem value="24h">24-Hour (e.g. 14:30)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Empty state message */}
              <div className="space-y-1.5 pt-2 border-t border-border/60">
                <Label htmlFor="cal-empty-msg" className="text-xs font-semibold">
                  Empty State Message
                </Label>
                <Input
                  id="cal-empty-msg"
                  value={config.emptyStateMessage}
                  onChange={(e) => onChange("emptyStateMessage", e.target.value)}
                  placeholder="No upcoming events found."
                  className="h-9 rounded-xl text-xs font-medium"
                />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* ================= ADD / EDIT EVENT MODAL ================= */}
      <Dialog open={eventModalOpen} onOpenChange={setEventModalOpen}>
        <DialogContent className="max-w-lg w-full p-0 overflow-hidden sm:rounded-2xl border-border bg-card shadow-2xl gap-0">
          <form onSubmit={handleSaveEvent}>
            {/* Header */}
            <div className="p-6 pb-4 border-b border-border/80 pr-14 bg-card">
              <DialogHeader className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-purple-600/10 text-purple-600">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <DialogTitle className="text-lg font-bold text-foreground">
                    {editingEventId ? "Edit Event" : "Add New Event"}
                  </DialogTitle>
                </div>
                <DialogDescription className="text-xs text-muted-foreground">
                  Provide event details, scheduling, and destination link.
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Form Fields */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin">
              {/* Title (Required) */}
              <div className="space-y-1.5">
                <Label htmlFor="ev-title" className="text-xs font-bold text-foreground">
                  Event Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ev-title"
                  required
                  value={eventForm.title || ""}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g. Web Developer Summit 2027"
                  className="h-9 rounded-xl text-xs"
                />
              </div>

              {/* Date & Times */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="ev-date" className="text-xs font-bold text-foreground">
                    Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ev-date"
                    type="date"
                    required
                    value={eventForm.date || ""}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="h-9 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ev-start" className="text-xs font-semibold">
                    Start Time
                  </Label>
                  <Input
                    id="ev-start"
                    type="time"
                    value={eventForm.startTime || ""}
                    onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                    className="h-9 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ev-end" className="text-xs font-semibold">
                    End Time
                  </Label>
                  <Input
                    id="ev-end"
                    type="time"
                    value={eventForm.endTime || ""}
                    onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                    className="h-9 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <Label htmlFor="ev-loc" className="text-xs font-semibold">
                  Location (Physical or Online)
                </Label>
                <Input
                  id="ev-loc"
                  value={eventForm.location || ""}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  placeholder="e.g. Convention Center / Zoom"
                  className="h-9 rounded-xl text-xs"
                />
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <Label htmlFor="ev-desc" className="text-xs font-semibold">
                  Short Description
                </Label>
                <Textarea
                  id="ev-desc"
                  value={eventForm.description || ""}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Brief summary of the event schedule, speakers, or topics."
                  rows={2}
                  className="rounded-xl text-xs resize-none"
                />
              </div>

              {/* Image URL & Destination Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="ev-img" className="text-xs font-semibold">
                    Image URL (Optional)
                  </Label>
                  <Input
                    id="ev-img"
                    type="url"
                    value={eventForm.imageUrl || ""}
                    onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="h-9 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ev-link" className="text-xs font-semibold">
                    Destination URL (Optional)
                  </Label>
                  <Input
                    id="ev-link"
                    type="url"
                    value={eventForm.destinationUrl || ""}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, destinationUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="h-9 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 px-6 border-t border-border/80 flex items-center justify-end gap-2.5 bg-muted/20">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEventModalOpen(false)}
                className="h-9 px-4 rounded-xl text-xs font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-9 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-xs"
              >
                {editingEventId ? "Save Changes" : "Add Event"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
