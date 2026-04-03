import { NextRequest, NextResponse } from "next/server";
import {
  getProtocolSteps,
  addProtocolStep,
} from "@/lib/services/protocol-service";
import { z } from "zod/v4";

type Params = { params: Promise<{ id: string }> };

const addStepSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  orderIndex: z.number(),
  durationSeconds: z.number().optional(),
});

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const steps = await getProtocolSteps(Number(id));
  return NextResponse.json(steps);
}

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const parsed = addStepSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.issues },
      { status: 400 }
    );
  }
  const step = await addProtocolStep({
    ...parsed.data,
    protocolId: Number(id),
  });
  return NextResponse.json(step, { status: 201 });
}
