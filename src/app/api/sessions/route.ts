import { NextRequest, NextResponse } from "next/server";
import { getSessions, startSession } from "@/lib/services/session-service";
import { z } from "zod/v4";

const startSessionSchema = z.object({
  protocolId: z.number(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;
  const sessions = await getSessions({ status });
  return NextResponse.json(sessions);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = startSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.issues },
      { status: 400 }
    );
  }
  try {
    const session = await startSession(parsed.data.protocolId);
    return NextResponse.json(session, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
