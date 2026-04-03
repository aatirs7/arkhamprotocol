import { NextRequest, NextResponse } from "next/server";

export function validateAlexaSecret(request: NextRequest): NextResponse | null {
  const secret = request.headers.get("x-alexa-secret");
  if (!secret || secret !== process.env.ALEXA_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
