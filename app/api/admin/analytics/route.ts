import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - 6);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [total, today, thisWeek, thisMonth, allWeek, topPages] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.pageView.count({ where: { createdAt: { gte: startOfWeek } } }),
    prisma.pageView.count({ where: { createdAt: { gte: startOfMonth } } }),
    // Raw views for last 7 days to build daily chart
    prisma.pageView.findMany({
      where: { createdAt: { gte: startOfWeek } },
      select: { createdAt: true, path: true },
    }),
    // Top pages
    prisma.pageView.groupBy({
      by: ["path"],
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 8,
    }),
  ]);

  // Build daily counts for last 7 days
  const days: { label: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(startOfToday);
    d.setDate(d.getDate() - i);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const label = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    const count = allWeek.filter((v) => v.createdAt >= d && v.createdAt < next).length;
    days.push({ label, count });
  }

  const pages = topPages.map((p) => ({ path: p.path, count: p._count.path }));

  return NextResponse.json({ total, today, thisWeek, thisMonth, days, pages });
}
