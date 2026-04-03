import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { logActivity } from "./activity-service";

export async function getProjects() {
  return db.select().from(projects).orderBy(desc(projects.createdAt));
}

export async function getProjectById(id: number) {
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id));
  return project ?? null;
}

export async function createProject(data: {
  name: string;
  description?: string;
  status?: string;
}) {
  const [project] = await db.insert(projects).values(data).returning();
  await logActivity("project_created", "project", project.id, {
    name: project.name,
  });
  return project;
}

export async function updateProject(
  id: number,
  data: Partial<{
    name: string;
    description: string;
    status: string;
    progress: number;
  }>
) {
  const [project] = await db
    .update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning();
  return project ?? null;
}

export async function deleteProject(id: number) {
  const [project] = await db
    .delete(projects)
    .where(eq(projects.id, id))
    .returning();
  return project ?? null;
}
