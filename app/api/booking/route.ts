import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { SESSION_MINUTES } from "@/lib/availability";


export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, phone, message, startUTC, timezone } = body as {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
    startUTC?: string;
    timezone?: string;
  };

  if (!name?.trim() || !email?.trim() || !startUTC || !timezone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const startTime = new Date(startUTC);
  if (isNaN(startTime.getTime())) {
    return NextResponse.json({ error: "Invalid start time" }, { status: 400 });
  }

  const endTime = new Date(startTime.getTime() + SESSION_MINUTES * 60 * 1000);

  // Check for conflict
  const conflict = await prisma.booking.findFirst({
    where: {
      status: { not: "cancelled" },
      startTime,
    },
  });

  if (conflict) {
    return NextResponse.json({ error: "This time slot is no longer available. Please choose another." }, { status: 409 });
  }

  const booking = await prisma.booking.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      message: message?.trim() || null,
      startTime,
      endTime,
      timezone,
      status: "pending",
    },
  });

  return NextResponse.json({ id: booking.id, startTime: booking.startTime.toISOString() }, { status: 201 });
}
