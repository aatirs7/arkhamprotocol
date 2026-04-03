import { NextRequest, NextResponse } from "next/server";
import { deleteNote } from "@/lib/services/note-service";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const note = await deleteNote(Number(id));
  if (!note)
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  return NextResponse.json(note);
}
