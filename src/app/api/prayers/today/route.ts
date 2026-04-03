import { NextResponse } from "next/server";
import { getPrayersForDate } from "@/lib/services/prayer-service";

export async function GET() {
  const prayers = await getPrayersForDate();
  return NextResponse.json(prayers);
}
