import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import type { EventCalendarConfig, CalendarEvent } from "@/lib/calendar/types";
import {
  formatCalendarDate,
  formatTimeRange,
  getDateBadgeInfo,
  getProcessedEvents,
  groupEventsByDate,
  generateMonthGrid,
} from "@/lib/calendar/calendarUtils";
import { cn } from "@/lib/utils";

interface EventCalendarRendererProps {
  config: EventCalendarConfig;
  className?: string;
  isInteractive?: boolean;
}

export function EventCalendarRenderer({
  config,
  className,
  isInteractive = true,
}: EventCalendarRendererProps) {
  // Navigation state for Monthly Calendar design
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    // If events exist, default to first event's month or current date
    if (config.events && config.events.length > 0 && config.events[0].date) {
      const parts = config.events[0].date.split("-");
      if (parts.length >= 2) {
        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1);
      }
    }
    return new Date();
  });

  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[] | null>(null);

  const processedEvents = getProcessedEvents(config.events || [], {
    upcomingOnly: config.upcomingOnly,
    maxEvents: config.maxEvents,
  });

  const hasEvents = processedEvents.length > 0;

  const handlePrevMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1)
    );
    setSelectedDayEvents(null);
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1)
    );
    setSelectedDayEvents(null);
  };

  return (
    <div
      className={cn(
        "w-full transition-all duration-200 font-sans text-slate-900 dark:text-slate-100",
        className
      )}
      style={{
        borderRadius: config.radius !== undefined ? `${config.radius}px` : "16px",
      }}
    >
      {/* Calendar Header */}
      {(config.title || config.description) && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-purple-600/10 text-purple-600 dark:text-purple-400">
                <CalendarIcon className="h-4 w-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {config.title || "Upcoming Events"}
              </h2>
            </div>
            {config.description && (
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {config.description}
              </p>
            )}
          </div>
          {hasEvents && (
            <span className="self-start sm:self-auto rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-3 py-1 text-xs font-semibold shrink-0">
              {processedEvents.length} {processedEvents.length === 1 ? "Event" : "Events"}
            </span>
          )}
        </div>
      )}

      {/* Empty State */}
      {!hasEvents && config.designId !== "monthly-grid" && (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 mb-3">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-foreground mb-1">
            {config.emptyStateMessage || "No upcoming events found."}
          </h4>
          <p className="text-xs text-muted-foreground max-w-sm">
            Check back soon for new announcements, workshops, and dates.
          </p>
        </div>
      )}

      {/* ================= DESIGN 1: MINIMAL LIST ================= */}
      {hasEvents && config.designId === "minimal-list" && (
        <div className="divide-y divide-slate-200 dark:divide-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-card overflow-hidden">
          {processedEvents.map((event) => {
            const badge = getDateBadgeInfo(event.date);
            const timeRange = formatTimeRange(event.startTime, event.endTime, config.timeFormat);

            return (
              <div
                key={event.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors"
              >
                <div className="flex items-start gap-4 min-w-0">
                  {/* Date Badge */}
                  <div className="flex flex-col items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200/60 dark:border-purple-800/60 px-3 py-2 w-16 text-center shrink-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      {badge.monthShort}
                    </span>
                    <span className="text-xl font-extrabold text-foreground leading-none mt-0.5">
                      {badge.day}
                    </span>
                  </div>

                  {/* Event Info */}
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                      {event.title}
                    </h3>

                    {config.showDescriptions && event.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
                      {timeRange && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-purple-500" />
                          <span>{timeRange}</span>
                        </span>
                      )}
                      {config.showLocations && event.location && (
                        <span className="inline-flex items-center gap-1 truncate">
                          <MapPin className="h-3.5 w-3.5 text-purple-500" />
                          <span className="truncate">{event.location}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {event.destinationUrl && (
                  <a
                    href={event.destinationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/80 px-4 py-2 text-xs font-semibold text-foreground hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all shadow-2xs self-start sm:self-center shrink-0"
                  >
                    <span>View Details</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ================= DESIGN 2: MODERN CARDS ================= */}
      {hasEvents && config.designId === "modern-cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {processedEvents.map((event) => {
            const badge = getDateBadgeInfo(event.date);
            const timeRange = formatTimeRange(event.startTime, event.endTime, config.timeFormat);

            return (
              <div
                key={event.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-card overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                {/* Optional Image */}
                {config.showImages && event.imageUrl && (
                  <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex flex-col items-center justify-center rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-2.5 py-1.5 shadow-md">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                        {badge.monthShort}
                      </span>
                      <span className="text-base font-extrabold text-foreground leading-none">
                        {badge.day}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    {/* Date pill if no image shown */}
                    {(!config.showImages || !event.imageUrl) && (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/60 px-3 py-1 text-xs font-bold text-purple-700 dark:text-purple-300">
                        <span>{badge.weekday},</span>
                        <span>
                          {badge.monthShort} {badge.day}, {badge.year}
                        </span>
                      </div>
                    )}

                    <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                      {event.title}
                    </h3>

                    {config.showDescriptions && event.description && (
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs text-muted-foreground">
                    {timeRange && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                        <span className="truncate">{timeRange}</span>
                      </div>
                    )}
                    {config.showLocations && event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}

                    {event.destinationUrl && (
                      <div className="pt-2">
                        <a
                          href={event.destinationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 text-xs shadow-2xs transition-colors"
                        >
                          <span>Register / Details</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= DESIGN 3: MONTHLY CALENDAR ================= */}
      {config.designId === "monthly-grid" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-card overflow-hidden shadow-xs">
          {/* Calendar Header with Navigation */}
          <div className="flex items-center justify-between p-4 px-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-foreground">
                {currentMonthDate.toLocaleString("default", { month: "long" })}{" "}
                {currentMonthDate.getFullYear()}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={!isInteractive}
                className="grid h-8 w-8 place-items-center rounded-lg border border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
                aria-label="Previous Month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                disabled={!isInteractive}
                className="grid h-8 w-8 place-items-center rounded-lg border border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
                aria-label="Next Month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Grid View */}
          {(() => {
            const grid = generateMonthGrid(
              currentMonthDate.getFullYear(),
              currentMonthDate.getMonth(),
              config.events || []
            );

            return (
              <div className="p-3 sm:p-4">
                {/* Day of Week Header */}
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
                    <div
                      key={dayName}
                      className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-1"
                    >
                      {dayName}
                    </div>
                  ))}
                </div>

                {/* Day Grid Rows */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {grid.weeks.flat().map((cell, idx) => {
                    const hasDayEvents = cell.events.length > 0;

                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          if (hasDayEvents) {
                            setSelectedDayEvents(cell.events);
                          }
                        }}
                        className={cn(
                          "min-h-[64px] sm:min-h-[85px] p-1.5 sm:p-2 rounded-xl border flex flex-col justify-between transition-all",
                          cell.isCurrentMonth
                            ? "bg-background border-slate-200/80 dark:border-slate-800"
                            : "bg-slate-50/60 dark:bg-slate-950/40 border-transparent opacity-40",
                          cell.isToday && "ring-2 ring-purple-500",
                          hasDayEvents
                            ? "cursor-pointer hover:border-purple-400 hover:shadow-xs"
                            : "cursor-default"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              "text-xs font-semibold h-5 w-5 grid place-items-center rounded-full leading-none",
                              cell.isToday
                                ? "bg-purple-600 text-white font-bold"
                                : "text-foreground"
                            )}
                          >
                            {cell.dayNumber}
                          </span>
                          {hasDayEvents && (
                            <span className="h-2 w-2 rounded-full bg-purple-600 shrink-0" />
                          )}
                        </div>

                        {/* Event Tags inside Grid Day */}
                        {hasDayEvents && (
                          <div className="mt-1 space-y-1 overflow-hidden">
                            {cell.events.slice(0, 2).map((ev) => (
                              <div
                                key={ev.id}
                                className="truncate rounded-md bg-purple-100 dark:bg-purple-950/80 px-1.5 py-0.5 text-[10px] font-bold text-purple-700 dark:text-purple-300 leading-tight"
                              >
                                {ev.title}
                              </div>
                            ))}
                            {cell.events.length > 2 && (
                              <span className="text-[9px] font-bold text-muted-foreground block pl-1">
                                +{cell.events.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Selected Day Event Drawer or Bottom Details */}
          {selectedDayEvents && (
            <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-purple-50/40 dark:bg-purple-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  Events on{" "}
                  {formatCalendarDate(selectedDayEvents[0]?.date, config.dateFormat)}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedDayEvents(null)}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  Close
                </button>
              </div>

              <div className="space-y-2">
                {selectedDayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{ev.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        {ev.startTime && <span>{formatTimeRange(ev.startTime, ev.endTime, config.timeFormat)}</span>}
                        {ev.location && <span>• {ev.location}</span>}
                      </div>
                    </div>
                    {ev.destinationUrl && (
                      <a
                        href={ev.destinationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-purple-600 text-white text-xs px-3 py-1 font-semibold self-start sm:self-center"
                      >
                        <span>View</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= DESIGN 4: AGENDA ================= */}
      {hasEvents && config.designId === "agenda" && (
        <div className="space-y-6">
          {(() => {
            const grouped = groupEventsByDate(processedEvents);
            const dateKeys = Object.keys(grouped).sort();

            return dateKeys.map((dateKey) => {
              const dayEvents = grouped[dateKey];
              const badge = getDateBadgeInfo(dateKey);

              return (
                <div key={dateKey} className="space-y-3">
                  {/* Date Header */}
                  <div className="flex items-center gap-3 pb-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="grid h-6 w-6 place-items-center rounded-md bg-purple-600 text-white text-[11px] font-bold">
                      {badge.day}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {badge.weekday},{" "}
                      {formatCalendarDate(dateKey, config.dateFormat)}
                    </span>
                  </div>

                  {/* Events on this date */}
                  <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-purple-200 dark:before:bg-purple-900/60">
                    {dayEvents.map((ev) => {
                      const timeRange = formatTimeRange(
                        ev.startTime,
                        ev.endTime,
                        config.timeFormat
                      );

                      return (
                        <div
                          key={ev.id}
                          className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-card shadow-2xs hover:border-purple-300 dark:hover:border-purple-800 transition-colors"
                        >
                          <span className="absolute -left-[19px] top-5 h-2.5 w-2.5 rounded-full border-2 border-background bg-purple-600 ring-2 ring-purple-100 dark:ring-purple-950" />

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {timeRange && (
                                <span className="rounded bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 text-[11px] font-bold text-purple-700 dark:text-purple-300">
                                  {timeRange}
                                </span>
                              )}
                              {config.showLocations && ev.location && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <MapPin className="h-3 w-3 text-purple-500" />
                                  <span>{ev.location}</span>
                                </span>
                              )}
                            </div>

                            <h4 className="text-sm font-bold text-foreground">{ev.title}</h4>

                            {config.showDescriptions && ev.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {ev.description}
                              </p>
                            )}
                          </div>

                          {ev.destinationUrl && (
                            <a
                              href={ev.destinationUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline shrink-0"
                            >
                              <span>Details</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}

      {/* ================= DESIGN 5: COMPACT ================= */}
      {hasEvents && config.designId === "compact" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-card p-2 sm:p-3 divide-y divide-slate-100 dark:divide-slate-800/80 shadow-xs">
          {processedEvents.map((event) => {
            const badge = getDateBadgeInfo(event.date);
            const timeRange = formatTimeRange(event.startTime, event.endTime, config.timeFormat);

            return (
              <div
                key={event.id}
                className="flex items-center justify-between gap-3 p-2.5 sm:p-3 hover:bg-slate-50/80 dark:hover:bg-slate-900/40 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex flex-col items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200/50 dark:border-purple-800/50 px-2 py-1 w-12 text-center shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      {badge.monthShort}
                    </span>
                    <span className="text-sm font-extrabold text-foreground leading-none">
                      {badge.day}
                    </span>
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground truncate">
                      {timeRange && <span>{timeRange}</span>}
                      {config.showLocations && event.location && (
                        <span>• {event.location}</span>
                      )}
                    </div>
                  </div>
                </div>

                {event.destinationUrl && (
                  <a
                    href={event.destinationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-7 w-7 place-items-center rounded-lg border border-border/70 hover:bg-purple-600 hover:text-white transition-colors shrink-0"
                    aria-label="Event Details"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ================= DESIGN 6: FEATURED EVENTS ================= */}
      {hasEvents && config.designId === "featured" && (
        <div className="space-y-6">
          {processedEvents.map((event, idx) => {
            const badge = getDateBadgeInfo(event.date);
            const timeRange = formatTimeRange(event.startTime, event.endTime, config.timeFormat);
            const isFirst = idx === 0;

            return (
              <div
                key={event.id}
                className={cn(
                  "group rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-card overflow-hidden shadow-xs hover:shadow-md transition-all duration-200",
                  isFirst
                    ? "grid grid-cols-1 md:grid-cols-12 ring-1 ring-purple-500/20"
                    : "flex flex-col sm:flex-row"
                )}
              >
                {/* Hero / Thumbnail Image */}
                {config.showImages && event.imageUrl && (
                  <div
                    className={cn(
                      "relative overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0",
                      isFirst
                        ? "md:col-span-6 h-56 md:h-full min-h-[220px]"
                        : "h-44 sm:w-48 sm:h-auto"
                    )}
                  >
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {isFirst && (
                      <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-purple-600 text-white text-[11px] font-bold px-3 py-1 shadow-md">
                        <Sparkles className="h-3 w-3" /> Featured Event
                      </span>
                    )}
                  </div>
                )}

                {/* Details */}
                <div
                  className={cn(
                    "p-6 flex flex-col justify-between space-y-4 flex-1",
                    isFirst && config.showImages && event.imageUrl && "md:col-span-6"
                  )}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 px-2.5 py-1 text-xs font-bold">
                        {badge.weekday}, {formatCalendarDate(event.date, config.dateFormat)}
                      </span>
                    </div>

                    <h3
                      className={cn(
                        "font-bold text-foreground leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors",
                        isFirst ? "text-lg sm:text-xl" : "text-base sm:text-lg"
                      )}
                    >
                      {event.title}
                    </h3>

                    {config.showDescriptions && event.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {event.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                    <div className="space-y-1">
                      {timeRange && (
                        <div className="flex items-center gap-1.5 font-medium">
                          <Clock className="h-3.5 w-3.5 text-purple-500" />
                          <span>{timeRange}</span>
                        </div>
                      )}
                      {config.showLocations && event.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-purple-500" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>

                    {event.destinationUrl && (
                      <a
                        href={event.destinationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 text-xs shadow-xs transition-all active:scale-[0.98]"
                      >
                        <span>Reserve Spot</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
