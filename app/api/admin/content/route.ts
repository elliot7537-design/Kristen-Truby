import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function isAuthed() {
  const jar = await cookies();
  const session = jar.get("admin_session")?.value;
  const token = process.env.ADMIN_SESSION_TOKEN;
  return session && token && session === token;
}

export async function GET() {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await prisma.siteContent.findMany();
  const content = Object.fromEntries(items.map((i: { key: string; value: string }) => [i.key, i.value]));
  return NextResponse.json({ content });
}

export async function PATCH(req: NextRequest) {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { key, value } = await req.json();
  if (!key || typeof key !== "string" || typeof value !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await prisma.siteContent.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
