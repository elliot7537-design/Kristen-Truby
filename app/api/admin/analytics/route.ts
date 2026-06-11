import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const now = new Date();
    // Explicit UTC boundaries — avoids any server local-time vs UTC mismatch
    const y = now.getUTCFullYear();
    const mo = now.getUTCMonth();
    const d = now.getUTCDate();

    const startOfToday = new Date(Date.UTC(y, mo, d));
    const startOfWeek  = new Date(Date.UTC(y, mo, d - 6));
    const startOfMonth = new Date(Date.UTC(y, mo, 1));

    const [total, today, thisWeek, thisMonth, allViews, allWeek] = await Promise.all([
      prisma.pageView.count(),
      prisma.pageView.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.pageView.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.pageView.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.pageView.findMany({ select: { path: true } }),
      prisma.pageView.findMany({
        where: { createdAt: { gte: startOfWeek } },
        select: { createdAt: true },
      }),
    ]);

    // Build daily counts using numeric timestamp comparison (avoids Date vs string issues)
    const days: { label: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(Date.UTC(y, mo, d - i)).getTime();
      const dayEnd   = new Date(Date.UTC(y, mo, d - i + 1)).getTime();
      const label    = new Date(dayStart).toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric", timeZone: "UTC",
      });
      const count = allWeek.filter((v) => {
        const ts = new Date(v.createdAt).getTime();
        return ts >= dayStart && ts < dayEnd;
      }).length;
      days.push({ label, count });
    }

    // Top pages via JS grouping (no groupBy to avoid Prisma version issues)
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
