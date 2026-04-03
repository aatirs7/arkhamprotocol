import { NextRequest, NextResponse } from "next/server";
import {
  getProtocols,
  createProtocol,
} from "@/lib/services/protocol-service";
import { z } from "zod/v4";

const createProtocolSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  displayMode: z.enum(["sequential", "checklist"]).optional(),
});

export async function GET() {
  const protocolList = await getProtocols();
  return NextResponse.json(protocolList);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createProtocolSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.issues },
      { status: 400 }
    );
  }
  const protocol = await createProtocol(parsed.data);
  return NextResponse.json(protocol, { status: 201 });
}
