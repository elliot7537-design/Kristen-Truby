import { NextResponse } from "next/server";
import { getEnabledDays } from "@/lib/availability";

export async function GET() {
  const days = await getEnabledDays();
  return NextResponse.json({ days });
}
