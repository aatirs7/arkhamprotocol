import { NextRequest, NextResponse } from "next/server";
import { completeSession } from "@/lib/services/session-service";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const session = await completeSession(Number(id));
    return NextResponse.json(session);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
