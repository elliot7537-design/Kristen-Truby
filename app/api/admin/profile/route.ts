import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { scryptSync, timingSafeEqual, randomBytes } from "crypto";

async function isAuthed() {
  const jar = await cookies();
  const session = jar.get("admin_session")?.value;
  const token = process.env.ADMIN_SESSION_TOKEN;
  return session && token && session === token;
}

function hashPassword(password: string): string {
  const salt = randomBytes(32).toString("hex");
  const key = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${key}`;
}

function verifyPassword(password: string, hash: string): boolean {
  try {
    const [salt, key] = hash.split(":");
    const derived = scryptSync(password, salt, 64);
    return timingSafeEqual(Buffer.from(key, "hex"), derived);
  } catch {
    return false;
  }
}

export async function GET() {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const settings = await prisma.adminSettings.findUnique({ where: { id: "singleton" } });
  return NextResponse.json({ hasCustomPassword: !!settings?.passwordHash });
}

export async function PATCH(req: NextRequest) {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
  }

  // Verify current password against DB hash or env var fallback
  const settings = await prisma.adminSettings.findUnique({ where: { id: "singleton" } });
  if (settings?.passwordHash) {
    if (!verifyPassword(currentPassword, settings.passwordHash)) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }
  } else {
    if (currentPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }
  }

  const newHash = hashPassword(newPassword);
  await prisma.adminSettings.upsert({
    where: { id: "singleton" },
    update: { passwordHash: newHash },
    create: { id: "singleton", passwordHash: newHash },
  });

  return NextResponse.json({ ok: true });
}
