// Kristen's availability config — all times in America/Los_Angeles (Pacific)
export const COACH_TIMEZONE = "America/Los_Angeles";

// Days of week available (0=Sun, 1=Mon … 6=Sat)
export const AVAILABLE_DAYS = [1, 2, 3, 4, 5]; // Mon–Fri

// Available time slots (hour, minute) in Pacific time
export const AVAILABLE_SLOTS = [
  { hour: 9, minute: 0 },
  { hour: 10, minute: 0 },
  { hour: 11, minute: 0 },
  { hour: 13, minute: 0 },
  { hour: 14, minute: 0 },
  { hour: 15, minute: 0 },
  { hour: 16, minute: 0 },
];

// Session duration in minutes
export const SESSION_MINUTES = 30;

// How many days ahead can be booked
export const BOOKING_WINDOW_DAYS = 60;

// Minimum notice in hours
export const MIN_NOTICE_HOURS = 24;

/**
 * Given a YYYY-MM-DD string and a slot {hour, minute}, returns a UTC Date
 * for that time in Pacific timezone.
 */
export function slotToUTC(dateStr: string, hour: number, minute: number): Date {
  // Use Intl to figure out the UTC offset for Pacific on this date
  const localDateStr = `${dateStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
  // Parse as if it were in the coach timezone by computing the offset
  const tentative = new Date(localDateStr + "Z"); // treat as UTC first
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: COACH_TIMEZONE,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  });
  // Binary-search approach: use a reference offset
  const parts = formatter.formatToParts(tentative);
  const p: Record<string, string> = {};
  for (const part of parts) p[part.type] = part.value;
  const displayedStr = `${p.year}-${p.month}-${p.day}T${p.hour === "24" ? "00" : p.hour}:${p.minute}:${p.second}Z`;
  const displayed = new Date(displayedStr);
  const offsetMs = tentative.getTime() - displayed.getTime();
  return new Date(tentative.getTime() + offsetMs);
}

/**
 * Converts a UTC Date to a human-readable time string in the given IANA timezone.
 */
export function formatInTimezone(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/**
 * Returns a list of available UTC Date start times for a given YYYY-MM-DD
 * (interpreted in Pacific), excluding already-booked slots.
 */
export function getSlotsForDate(
  dateStr: string,
  bookedStartTimes: Date[]
): { startUTC: Date; endUTC: Date }[] {
  // Check day-of-week in Pacific
  const refDate = new Date(dateStr + "T12:00:00Z");
  const dayInPacific = new Intl.DateTimeFormat("en-US", {
    timeZone: COACH_TIMEZONE,
    weekday: "short",
  }).format(refDate);
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const dow = dayMap[dayInPacific];
  if (!AVAILABLE_DAYS.includes(dow)) return [];

  const now = new Date();
  const minBookingTime = new Date(now.getTime() + MIN_NOTICE_HOURS * 60 * 60 * 1000);

  const bookedSet = new Set(bookedStartTimes.map((d) => d.getTime()));

  return AVAILABLE_SLOTS.flatMap(({ hour, minute }) => {
    const startUTC = slotToUTC(dateStr, hour, minute);
    const endUTC = new Date(startUTC.getTime() + SESSION_MINUTES * 60 * 1000);

    if (startUTC <= minBookingTime) return [];
    if (bookedSet.has(startUTC.getTime())) return [];

    return [{ startUTC, endUTC }];
  });
}
