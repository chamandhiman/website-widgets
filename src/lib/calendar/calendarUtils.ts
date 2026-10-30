import { CalendarEvent, EventCalendarConfig } from "./types";

const MONTH_NAMES_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MONTH_NAMES_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * Formats a YYYY-MM-DD date string according to the selected format
 */
export function formatCalendarDate(
  dateStr: string,
  format: "MMM D, YYYY" | "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD" = "MMM D, YYYY"
): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return dateStr;

  const monthIdx = Math.max(0, Math.min(11, month - 1));
  const monthShort = MONTH_NAMES_SHORT[monthIdx];
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");

  switch (format) {
    case "MM/DD/YYYY":
      return `${mm}/${dd}/${year}`;
    case "DD/MM/YYYY":
      return `${dd}/${mm}/${year}`;
    case "YYYY-MM-DD":
      return `${year}-${mm}-${dd}`;
    case "MMM D, YYYY":
    default:
      return `${monthShort} ${day}, ${year}`;
  }
}

/**
 * Returns date components (month name, day number, weekday) for date badges
 */
export function getDateBadgeInfo(dateStr: string): {
  monthShort: string;
  monthFull: string;
  day: number;
  year: number;
  weekday: string;
} {
  if (!dateStr) {
    return { monthShort: "TBD", monthFull: "TBD", day: 1, year: 2027, weekday: "" };
  }
  const parts = dateStr.split("-");
  const year = parseInt(parts[0], 10) || 2027;
  const month = parseInt(parts[1], 10) || 1;
  const day = parseInt(parts[2], 10) || 1;

  const dateObj = new Date(year, month - 1, day);
  const monthIdx = Math.max(0, Math.min(11, month - 1));

  return {
    monthShort: MONTH_NAMES_SHORT[monthIdx],
    monthFull: MONTH_NAMES_FULL[monthIdx],
    day,
    year,
    weekday: DAY_NAMES[dateObj.getDay()] || "",
  };
}

/**
 * Formats a 24-hour time string ("HH:mm") to 12h or 24h format
 */
export function formatCalendarTime(timeStr?: string, timeFormat: "12h" | "24h" = "12h"): string {
  if (!timeStr) return "";
  const parts = timeStr.trim().split(":");
  if (parts.length < 2) return timeStr;

  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return timeStr;

  if (timeFormat === "24h") {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const mStr = String(m).padStart(2, "0");
  return `${h12}:${mStr} ${ampm}`;
}

/**
 * Formats time range (e.g. "9:30 AM – 5:00 PM" or "09:30 – 17:00")
 */
export function formatTimeRange(
  startTime?: string,
  endTime?: string,
  timeFormat: "12h" | "24h" = "12h"
): string {
  if (!startTime && !endTime) return "";
  const start = formatCalendarTime(startTime, timeFormat);
  const end = formatCalendarTime(endTime, timeFormat);
  if (start && end) return `${start} – ${end}`;
  return start || end;
}

/**
 * Checks if an event is in the upcoming future (relative to today or start of today)
 */
export function isEventUpcoming(event: CalendarEvent, referenceDate: Date = new Date()): boolean {
  if (!event.date) return false;
  const todayStr = referenceDate.toISOString().slice(0, 10); // YYYY-MM-DD
  return event.date >= todayStr;
}

/**
 * Sorts and filters events based on widget configuration
 */
export function getProcessedEvents(
  events: CalendarEvent[],
  config: Pick<EventCalendarConfig, "upcomingOnly" | "maxEvents">,
  referenceDate: Date = new Date()
): CalendarEvent[] {
  let list = [...events];

  // Filter upcoming if enabled
  if (config.upcomingOnly) {
    list = list.filter((e) => isEventUpcoming(e, referenceDate));
  }

  // Sort chronologically
  list.sort((a, b) => {
    const timeA = `${a.date || "9999-99-99"}T${a.startTime || "00:00"}`;
    const timeB = `${b.date || "9999-99-99"}T${b.startTime || "00:00"}`;
    return timeA.localeCompare(timeB);
  });

  // Limit count if maxEvents is positive
  if (config.maxEvents && config.maxEvents > 0) {
    list = list.slice(0, config.maxEvents);
  }

  return list;
}

/**
 * Groups events by date for Agenda view
 */
export function groupEventsByDate(events: CalendarEvent[]): Record<string, CalendarEvent[]> {
  const groups: Record<string, CalendarEvent[]> = {};
  for (const ev of events) {
    const key = ev.date || "undated";
    if (!groups[key]) groups[key] = [];
    groups[key].push(ev);
  }
  return groups;
}

export interface MonthGridDay {
  dateStr: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

/**
 * Generates month grid day cells for the Monthly Calendar design
 */
export function generateMonthGrid(
  year: number,
  month: number, // 0 - 11
  events: CalendarEvent[],
  today: Date = new Date()
): {
  monthName: string;
  year: number;
  weeks: MonthGridDay[][];
} {
  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonthDays = new Date(year, month, 0).getDate();
  const todayStr = today.toISOString().slice(0, 10);

  // Map events by dateStr
  const eventMap: Record<string, CalendarEvent[]> = {};
  for (const ev of events) {
    if (!ev.date) continue;
    if (!eventMap[ev.date]) eventMap[ev.date] = [];
    eventMap[ev.date].push(ev);
  }

  const cells: MonthGridDay[] = [];

  // Previous month trailing days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    const prevMonthIdx = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const mm = String(prevMonthIdx + 1).padStart(2, "0");
    const dd = String(dayNum).padStart(2, "0");
    const dateStr = `${prevYear}-${mm}-${dd}`;

    cells.push({
      dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      events: eventMap[dateStr] || [],
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    const dateStr = `${year}-${mm}-${dd}`;

    cells.push({
      dateStr,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      events: eventMap[dateStr] || [],
    });
  }

  // Next month leading days to complete full 7-day rows (up to 35 or 42 cells)
  const remaining = (7 - (cells.length % 7)) % 7;
  for (let day = 1; day <= remaining; day++) {
    const nextMonthIdx = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const mm = String(nextMonthIdx + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    const dateStr = `${nextYear}-${mm}-${dd}`;

    cells.push({
      dateStr,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      events: eventMap[dateStr] || [],
    });
  }

  // Split into weeks of 7
  const weeks: MonthGridDay[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return {
    monthName: MONTH_NAMES_FULL[month],
    year,
    weeks,
  };
}
