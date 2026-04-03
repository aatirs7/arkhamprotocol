import { NextResponse } from "next/server";
import { getActiveSession } from "@/lib/services/session-service";

export async function GET() {
  const session = await getActiveSession();
  return NextResponse.json(session);
}
