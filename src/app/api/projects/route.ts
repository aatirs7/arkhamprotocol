import { NextRequest, NextResponse } from "next/server";
import { getProjects, createProject } from "@/lib/services/project-service";
import { z } from "zod/v4";

const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["active", "paused", "completed", "archived"]).optional(),
});

export async function GET() {
  const projectList = await getProjects();
  return NextResponse.json(projectList);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.issues },
      { status: 400 }
    );
  }
  const project = await createProject(parsed.data);
  return NextResponse.json(project, { status: 201 });
}
