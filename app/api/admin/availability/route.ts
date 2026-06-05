import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

async function isAuthed() {
  const jar = await cookies();
  const session = jar.get("admin_session")?.value;
  const token = process.env.ADMIN_SESSION_TOKEN;
  return session && token && session === token;
}

export async function GET() {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [days, blocked] = await Promise.all([
    prisma.availabilityDay.findMany({ orderBy: { dayOfWeek: "asc" } }),
    prisma.blockedDate.findMany({ orderBy: { date: "asc" } }),
  ]);

  return NextResponse.json({ days, blocked });
}

export async function POST(req: NextRequest) {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { days, blocked } = await req.json();

  // Upsert each day config
  if (Array.isArray(days)) {
    await Promise.all(
      days.map((d: { dayOfWeek: number; enabled: boolean; startHour: number; startMin: number; endHour: number; endMin: number }) =>
        prisma.availabilityDay.upsert({
          where: { dayOfWeek: d.dayOfWeek },
          update: {
            enabled: d.enabled,
            startHour: d.startHour,
            startMin: d.startMin,
            endHour: d.endHour,
            endMin: d.endMin,
          },
          create: {
            dayOfWeek: d.dayOfWeek,
            enabled: d.enabled,
            startHour: d.startHour,
            startMin: d.startMin,
            endHour: d.endHour,
            endMin: d.endMin,
          },
        })
      )
    );
  }

  // Replace blocked dates
  if (Array.isArray(blocked)) {
    await prisma.blockedDate.deleteMany();
    if (blocked.length > 0) {
      await prisma.blockedDate.createMany({
        data: blocked.map((b: { date: string; note?: string }) => ({
          date: b.date,
          note: b.note ?? null,
        })),
      });
    }
  }

  return NextResponse.json({ ok: true });
}
