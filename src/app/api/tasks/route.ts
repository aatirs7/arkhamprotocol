import { NextRequest, NextResponse } from "next/server";
import { getTasks, createTask } from "@/lib/services/task-service";
import { z } from "zod/v4";

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  category: z.string().optional(),
  projectId: z.number().optional(),
  dueDate: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;
  const projectId = searchParams.get("projectId")
    ? Number(searchParams.get("projectId"))
    : undefined;

  const taskList = await getTasks({ status, projectId });
  return NextResponse.json(taskList);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.issues },
      { status: 400 }
    );
  }
  const task = await createTask(parsed.data);
  return NextResponse.json(task, { status: 201 });
}
