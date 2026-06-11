import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { scryptSync, timingSafeEqual } from "crypto";

function verifyHash(password: string, hash: string): boolean {
  try {
    const [salt, key] = hash.split(":");
    const derived = scryptSync(password, salt, 64);
    return timingSafeEqual(Buffer.from(key, "hex"), derived);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (!password) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // Check DB password hash first; fall back to env var
  let valid = false;
  try {
    const settings = await prisma.adminSettings.findUnique({ where: { id: "singleton" } });
    if (settings?.passwordHash) {
      valid = verifyHash(password, settings.passwordHash);
    } else {
      valid = password === process.env.ADMIN_PASSWORD;
    }
  } catch {
    valid = password === process.env.ADMIN_PASSWORD;
  }

  if (!valid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = process.env.ADMIN_SESSION_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
