import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { path, referrer } = await req.json();
    if (!path || typeof path !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    // Don't track admin pages
    if (path.startsWith("/admin")) {
      return NextResponse.json({ ok: true });
    }
    await prisma.pageView.create({
      data: { path: path.slice(0, 255), referrer: referrer?.slice(0, 500) || null },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
