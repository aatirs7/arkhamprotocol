import { db } from "@/lib/db";
import { notes } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { logActivity } from "./activity-service";

function todayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export async function getNotesForDate(date?: string) {
  const targetDate = date ?? todayDate();
  return db
    .select()
    .from(notes)
    .where(eq(notes.date, targetDate))
    .orderBy(desc(notes.createdAt));
}

export async function addNote(content: string, date?: string) {
  const targetDate = date ?? todayDate();
  const [note] = await db
    .insert(notes)
    .values({ content, date: targetDate })
    .returning();
  await logActivity("note_added", "note", note.id, {
    preview: content.slice(0, 50),
  });
  return note;
}

export async function deleteNote(id: number) {
  const [note] = await db.delete(notes).where(eq(notes.id, id)).returning();
  return note ?? null;
}
