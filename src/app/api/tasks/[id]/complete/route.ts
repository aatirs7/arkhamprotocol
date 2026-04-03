import { NextRequest, NextResponse } from "next/server";
import { completeTask } from "@/lib/services/task-service";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const task = await completeTask(Number(id));
  if (!task)
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  return NextResponse.json(task);
}
