import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { logActivity } from "./activity-service";

export async function getTasks(filters?: {
  status?: string;
  projectId?: number;
}) {
  const conditions = [];
  if (filters?.status) conditions.push(eq(tasks.status, filters.status));
  if (filters?.projectId)
    conditions.push(eq(tasks.projectId, filters.projectId));

  return db
    .select()
    .from(tasks)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(tasks.createdAt));
}

export async function getTasksDueToday() {
  const today = new Date().toISOString().split("T")[0];
  return db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.dueDate, today),
        sql`${tasks.status} != 'done'`
      )
    )
    .orderBy(desc(tasks.createdAt));
}

export async function getTaskById(id: number) {
  const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
  return task ?? null;
}

export async function createTask(data: {
  title: string;
  description?: string;
  priority?: string;
  category?: string;
  projectId?: number;
  dueDate?: string;
}) {
  const [task] = await db.insert(tasks).values(data).returning();
  await logActivity("task_created", "task", task.id, { title: task.title });
  return task;
}

export async function updateTask(
  id: number,
  data: Partial<{
    title: string;
    description: string;
    priority: string;
    category: string;
    projectId: number;
    status: string;
    dueDate: string;
  }>
) {
  const [task] = await db
    .update(tasks)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(tasks.id, id))
    .returning();
  return task ?? null;
}

export async function completeTask(id: number) {
  const [task] = await db
    .update(tasks)
    .set({
      status: "done",
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, id))
    .returning();
  if (task) {
    await logActivity("task_completed", "task", task.id, {
      title: task.title,
    });
  }
  return task ?? null;
}

export async function deleteTask(id: number) {
  const [task] = await db
    .delete(tasks)
    .where(eq(tasks.id, id))
    .returning();
  return task ?? null;
}
