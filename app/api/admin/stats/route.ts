import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [total, thisMonth, upcoming, pending, cancelled, recentBookings, allRecent] =
    await Promise.all([
      prisma.booking.count({ where: { status: { not: "cancelled" } } }),
      prisma.booking.count({
        where: { createdAt: { gte: startOfMonth }, status: { not: "cancelled" } },
      }),
      prisma.booking.count({
        where: { startTime: { gte: now }, status: { not: "cancelled" } },
      }),
      prisma.booking.count({ where: { status: "pending" } }),
      prisma.booking.count({ where: { status: "cancelled" } }),
      prisma.booking.findMany({
        where: { startTime: { gte: now }, status: { not: "cancelled" } },
        orderBy: { startTime: "asc" },
        take: 5,
      }),
      prisma.booking.findMany({
        where: {
          createdAt: { gte: sixMonthsAgo },
          status: { not: "cancelled" },
        },
        select: { createdAt: true },
      }),
    ]);

  // Group into monthly buckets in JS (avoids SQLite groupBy limitations)
  const months: { label: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
    const count = allRecent.filter((b) => {
      const bd = new Date(b.createdAt);
      return bd.getFullYear() === d.getFullYear() && bd.getMonth() === d.getMonth();
    }).length;
    months.push({ label, count });
  }

  return NextResponse.json({ total, thisMonth, upcoming, pending, cancelled, recentBookings, months });
}
