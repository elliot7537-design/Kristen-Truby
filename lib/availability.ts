export const COACH_TIMEZONE = "America/Los_Angeles";
export const SESSION_MINUTES = 30;
export const BOOKING_WINDOW_DAYS = 60;
export const MIN_NOTICE_HOURS = 24;

// Default day configs used when no DB records exist (Mon–Fri, 9am–5pm Pacific)
const DEFAULT_DAYS = [1, 2, 3, 4, 5].map((dow) => ({
  dayOfWeek: dow,
  enabled: true,
  startHour: 9,
  startMin: 0,
  endHour: 17,
  endMin: 0,
}));

type DayConfig = {
  dayOfWeek: number;
  enabled: boolean;
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
};

function generateSlots(startHour: number, startMin: number, endHour: number, endMin: number) {
  const slots: { hour: number; minute: number }[] = [];
  let totalMin = startHour * 60 + startMin;
  const lastStart = endHour * 60 + endMin - SESSION_MINUTES;
  while (totalMin <= lastStart) {
    slots.push({ hour: Math.floor(totalMin / 60), minute: totalMin % 60 });
    totalMin += SESSION_MINUTES;
  }
  return slots;
}

/**
 * Given a YYYY-MM-DD string and a slot {hour, minute}, returns a UTC Date
 * for that time in Pacific timezone.
 */
export function slotToUTC(dateStr: string, hour: number, minute: number): Date {
  const localDateStr = `${dateStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
  const tentative = new Date(localDateStr + "Z");
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: COACH_TIMEZONE,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  });
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
 * Loads availability config from DB, falling back to defaults if empty.
 */
export async function getAvailabilityConfig(): Promise<{
  days: DayConfig[];
  blockedDates: string[];
}> {
  try {
    const { prisma } = await import("@/lib/db");
    const [dbDays, dbBlocked] = await Promise.all([
      prisma.availabilityDay.findMany({ orderBy: { dayOfWeek: "asc" } }),
      prisma.blockedDate.findMany(),
    ]);
    const days = dbDays.length > 0 ? dbDays : DEFAULT_DAYS;
    return { days, blockedDates: dbBlocked.map((b: { date: string }) => b.date) };
  } catch {
    return { days: DEFAULT_DAYS, blockedDates: [] };
  }
}

/**
 * Returns which day-of-week numbers (0=Sun … 6=Sat) are enabled.
 */
export async function getEnabledDays(): Promise<number[]> {
  const { days } = await getAvailabilityConfig();
  return days.filter((d) => d.enabled).map((d) => d.dayOfWeek);
}

/**
 * Returns available UTC slots for a given YYYY-MM-DD, excluding booked times.
 */
export async function getSlotsForDate(
  dateStr: string,
  bookedStartTimes: Date[]
): Promise<{ startUTC: Date; endUTC: Date }[]> {
  const { days, blockedDates } = await getAvailabilityConfig();

  if (blockedDates.includes(dateStr)) return [];

  const refDate = new Date(dateStr + "T12:00:00Z");
  const dayInPacific = new Intl.DateTimeFormat("en-US", {
    timeZone: COACH_TIMEZONE,
    weekday: "short",
  }).format(refDate);
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const dow = dayMap[dayInPacific];

  const dayConfig = days.find((d) => d.dayOfWeek === dow);
  if (!dayConfig || !dayConfig.enabled) return [];

  const slots = generateSlots(dayConfig.startHour, dayConfig.startMin, dayConfig.endHour, dayConfig.endMin);

  const now = new Date();
  const minBookingTime = new Date(now.getTime() + MIN_NOTICE_HOURS * 60 * 60 * 1000);
  const bookedSet = new Set(bookedStartTimes.map((d) => d.getTime()));

  return slots.flatMap(({ hour, minute }) => {
    const startUTC = slotToUTC(dateStr, hour, minute);
    const endUTC = new Date(startUTC.getTime() + SESSION_MINUTES * 60 * 1000);
    if (startUTC <= minBookingTime) return [];
    if (bookedSet.has(startUTC.getTime())) return [];
    return [{ startUTC, endUTC }];
  });
}
