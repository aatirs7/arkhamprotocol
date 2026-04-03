import { db } from "@/lib/db";
import { prayers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { logActivity } from "./activity-service";

const PRAYER_NAMES = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
export type PrayerName = (typeof PRAYER_NAMES)[number];

function todayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export async function getPrayersForDate(date?: string) {
  const targetDate = date ?? todayDate();
  const existing = await db
    .select()
    .from(prayers)
    .where(eq(prayers.date, targetDate));

  // Return all 5 prayers, creating stubs for any missing ones
  return PRAYER_NAMES.map((name) => {
    const found = existing.find((p) => p.name === name);
    if (found) return found;
    return {
      id: null,
      name,
      date: targetDate,
      completed: false,
      completedAt: null,
      notes: null,
      createdAt: null,
    };
  });
}

export async function markPrayerComplete(name: string, date?: string) {
  const prayerName = name.toLowerCase();
  if (!PRAYER_NAMES.includes(prayerName as PrayerName)) {
    throw new Error(`Invalid prayer name: ${name}`);
  }

  const targetDate = date ?? todayDate();
  const now = new Date();

  // Upsert: insert or update on conflict
  const existing = await db
    .select()
    .from(prayers)
    .where(and(eq(prayers.name, prayerName), eq(prayers.date, targetDate)));

  let prayer;
  if (existing.length > 0) {
    [prayer] = await db
      .update(prayers)
      .set({ completed: true, completedAt: now })
      .where(eq(prayers.id, existing[0].id))
      .returning();
  } else {
    [prayer] = await db
      .insert(prayers)
      .values({
        name: prayerName,
        date: targetDate,
        completed: true,
        completedAt: now,
      })
      .returning();
  }

  await logActivity("prayer_completed", "prayer", prayer.id, {
    name: prayerName,
    date: targetDate,
  });

  return prayer;
}

export async function getPrayerStats(date?: string) {
  const prayerList = await getPrayersForDate(date);
  const completed = prayerList.filter((p) => p.completed).length;
  return { total: 5, completed, remaining: 5 - completed };
}
