import { NextRequest, NextResponse } from "next/server";
import { getNotesForDate, addNote } from "@/lib/services/note-service";
import { z } from "zod/v4";

const addNoteSchema = z.object({
  content: z.string().min(1),
  date: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? undefined;
  const noteList = await getNotesForDate(date);
  return NextResponse.json(noteList);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = addNoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.issues },
      { status: 400 }
    );
  }
  const note = await addNote(parsed.data.content, parsed.data.date);
  return NextResponse.json(note, { status: 201 });
}
