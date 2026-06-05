import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");

  const bookings = await prisma.booking.findMany({
    where: status ? { status } : undefined,
    orderBy: { startTime: "asc" },
  });

  return NextResponse.json({ bookings });
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();

  if (!id || !["pending", "confirmed", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ booking });
}
