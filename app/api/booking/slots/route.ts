import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSlotsForDate, formatInTimezone, BOOKING_WINDOW_DAYS } from "@/lib/availability";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const date = searchParams.get("date");
  const timezone = searchParams.get("timezone") ?? "America/Los_Angeles";

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const now = new Date();
  const maxDate = new Date(now.getTime() + BOOKING_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const reqDate = new Date(date + "T12:00:00Z");
  if (reqDate > maxDate) {
    return NextResponse.json({ slots: [] });
  }

  const dayStart = new Date(date + "T00:00:00Z");
  const dayEnd = new Date(date + "T23:59:59Z");
  const booked = await prisma.booking.findMany({
    where: {
      status: { not: "cancelled" },
      startTime: {
        gte: new Date(dayStart.getTime() - 86400000),
        lte: new Date(dayEnd.getTime() + 86400000),
      },
    },
    select: { startTime: true },
  });

  const slots = await getSlotsForDate(date, booked.map((b) => b.startTime));

  return NextResponse.json({
    slots: slots.map(({ startUTC, endUTC }) => ({
      startUTC: startUTC.toISOString(),
      endUTC: endUTC.toISOString(),
      displayTime: formatInTimezone(startUTC, timezone),
    })),
  });
}
