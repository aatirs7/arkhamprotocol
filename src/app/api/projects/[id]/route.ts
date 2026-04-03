import { NextRequest, NextResponse } from "next/server";
import {
  getProjectById,
  updateProject,
  deleteProject,
} from "@/lib/services/project-service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const project = await getProjectById(Number(id));
  if (!project)
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const project = await updateProject(Number(id), body);
  if (!project)
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const project = await deleteProject(Number(id));
  if (!project)
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  return NextResponse.json(project);
}
