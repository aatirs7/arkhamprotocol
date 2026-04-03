import { db } from "@/lib/db";
import { activityLog } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function logActivity(
  eventType: string,
  entityType?: string,
  entityId?: number,
  metadata?: Record<string, unknown>
) {
  const [entry] = await db
    .insert(activityLog)
    .values({ eventType, entityType, entityId, metadata: metadata ?? {} })
    .returning();
  return entry;
}

export async function getRecentActivity(limit = 20) {
  return db
    .select()
    .from(activityLog)
    .orderBy(desc(activityLog.createdAt))
    .limit(limit);
}
