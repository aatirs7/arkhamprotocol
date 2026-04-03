import { NextRequest, NextResponse } from "next/server";
import {
  getProtocolWithSteps,
  updateProtocol,
  deleteProtocol,
} from "@/lib/services/protocol-service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const protocol = await getProtocolWithSteps(Number(id));
  if (!protocol)
    return NextResponse.json(
      { error: "Protocol not found" },
      { status: 404 }
    );
  return NextResponse.json(protocol);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const protocol = await updateProtocol(Number(id), body);
  if (!protocol)
    return NextResponse.json(
      { error: "Protocol not found" },
      { status: 404 }
    );
  return NextResponse.json(protocol);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const protocol = await deleteProtocol(Number(id));
  if (!protocol)
    return NextResponse.json(
      { error: "Protocol not found" },
      { status: 404 }
    );
  return NextResponse.json(protocol);
}
