import { NextRequest, NextResponse } from "next/server";
import {
  getPrayersForDate,
  markPrayerComplete,
} from "@/lib/services/prayer-service";
import { z } from "zod/v4";

const markPrayerSchema = z.object({
  name: z.enum(["fajr", "dhuhr", "asr", "maghrib", "isha"]),
  date: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? undefined;
  const prayerList = await getPrayersForDate(date);
  return NextResponse.json(prayerList);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = markPrayerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.issues },
      { status: 400 }
    );
  }
  const prayer = await markPrayerComplete(parsed.data.name, parsed.data.date);
  return NextResponse.json(prayer);
}
