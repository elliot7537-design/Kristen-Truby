import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - 6);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, today, thisWeek, thisMonth, allViews, allWeek] = await Promise.all([
      prisma.pageView.count(),
      prisma.pageView.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.pageView.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.pageView.count({ where: { createdAt: { gte: startOfMonth } } }),
      // All views for top-pages calculation (avoid groupBy which can crash on some DB configs)
      prisma.pageView.findMany({ select: { path: true } }),
      // Views for last 7 days for the daily chart
      prisma.pageView.findMany({
        where: { createdAt: { gte: startOfWeek } },
        select: { createdAt: true, path: true },
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

    // Group all views by path in JS instead of using groupBy (avoids Prisma groupBy issues)
    const pathCounts: Record<string, number> = {};
    for (const v of allViews) {
      pathCounts[v.path] = (pathCounts[v.path] ?? 0) + 1;
    }
    const pages = Object.entries(pathCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([path, count]) => ({ path, count }));

    return NextResponse.json({ total, today, thisWeek, thisMonth, days, pages });
  } catch (err) {
    console.error("Analytics error:", err);
    return NextResponse.json(
      { total: 0, today: 0, thisWeek: 0, thisMonth: 0, days: [], pages: [] },
      { status: 500 }
    );
  }
}
