import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function isAuthed() {
  const jar = await cookies();
  const session = jar.get("admin_session")?.value;
  const token = process.env.ADMIN_SESSION_TOKEN;
  return session && token && session === token;
}

export async function POST(req: NextRequest) {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const contentKey = formData.get("key") as string | null;

  if (!file || !contentKey) {
    return NextResponse.json({ error: "Missing file or key" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Image uploads require BLOB_READ_WRITE_TOKEN in your Vercel environment variables." },
      { status: 503 }
    );
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `site/${contentKey.replace(/\./g, "-")}-${Date.now()}.${ext}`;

  const blob = await put(filename, file, { access: "public" });

  await prisma.siteContent.upsert({
    where: { key: contentKey },
    update: { value: blob.url },
    create: { key: contentKey, value: blob.url },
  });

  revalidatePath("/");
  return NextResponse.json({ ok: true, url: blob.url });
}
