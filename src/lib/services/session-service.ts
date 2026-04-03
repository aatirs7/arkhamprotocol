import { db } from "@/lib/db";
import { protocolSessions, protocolSteps, protocols } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { logActivity } from "./activity-service";

export async function getActiveSession() {
  const [session] = await db
    .select()
    .from(protocolSessions)
    .where(eq(protocolSessions.status, "active"));

  if (!session) return null;

  const [protocol] = await db
    .select()
    .from(protocols)
    .where(eq(protocols.id, session.protocolId));

  const steps = await db
    .select()
    .from(protocolSteps)
    .where(eq(protocolSteps.protocolId, session.protocolId))
    .orderBy(asc(protocolSteps.orderIndex));

  return { ...session, protocol, steps };
}

export async function startSession(protocolId: number) {
  // Enforce single active session
  const active = await getActiveSession();
  if (active) {
    throw new Error(
      "A protocol session is already active. Complete or abandon it first."
    );
  }

  // Verify protocol exists
  const [protocol] = await db
    .select()
    .from(protocols)
    .where(eq(protocols.id, protocolId));

  if (!protocol) {
    throw new Error(`Protocol with ID ${protocolId} not found.`);
  }

  const [session] = await db
    .insert(protocolSessions)
    .values({
      protocolId,
      status: "active",
      currentStepIndex: 0,
      stepTimestamps: [],
    })
    .returning();

  await logActivity("protocol_started", "protocol_session", session.id, {
    protocolId,
    protocolName: protocol.name,
  });

  // Return full session with protocol and steps
  const steps = await db
    .select()
    .from(protocolSteps)
    .where(eq(protocolSteps.protocolId, protocolId))
    .orderBy(asc(protocolSteps.orderIndex));

  return { ...session, protocol, steps };
}

export async function advanceStep(sessionId: number) {
  const [session] = await db
    .select()
    .from(protocolSessions)
    .where(
      and(
        eq(protocolSessions.id, sessionId),
        eq(protocolSessions.status, "active")
      )
    );

  if (!session) {
    throw new Error("No active session found with that ID.");
  }

  const steps = await db
    .select()
    .from(protocolSteps)
    .where(eq(protocolSteps.protocolId, session.protocolId))
    .orderBy(asc(protocolSteps.orderIndex));

  const currentIndex = session.currentStepIndex ?? 0;
  const now = new Date().toISOString();

  // Record completion of current step
  const timestamps = (session.stepTimestamps as Array<Record<string, string>>) ?? [];
  timestamps.push({
    stepIndex: String(currentIndex),
    stepTitle: steps[currentIndex]?.title ?? "",
    completedAt: now,
  });

  const nextIndex = currentIndex + 1;
  const isLastStep = nextIndex >= steps.length;

  if (isLastStep) {
    // Auto-complete the session
    const [updated] = await db
      .update(protocolSessions)
      .set({
        currentStepIndex: nextIndex,
        stepTimestamps: timestamps,
        status: "completed",
        completedAt: new Date(),
      })
      .where(eq(protocolSessions.id, sessionId))
      .returning();

    await logActivity(
      "protocol_completed",
      "protocol_session",
      sessionId,
      { protocolId: session.protocolId }
    );

    const [protocol] = await db
      .select()
      .from(protocols)
      .where(eq(protocols.id, session.protocolId));

    return { ...updated, protocol, steps };
  }

  // Advance to next step
  const [updated] = await db
    .update(protocolSessions)
    .set({
      currentStepIndex: nextIndex,
      stepTimestamps: timestamps,
    })
    .where(eq(protocolSessions.id, sessionId))
    .returning();

  await logActivity("protocol_step_advanced", "protocol_session", sessionId, {
    fromStep: currentIndex,
    toStep: nextIndex,
    stepTitle: steps[nextIndex]?.title,
  });

  const [protocol] = await db
    .select()
    .from(protocols)
    .where(eq(protocols.id, session.protocolId));

  return { ...updated, protocol, steps };
}

export async function completeSession(sessionId: number) {
  const [session] = await db
    .update(protocolSessions)
    .set({ status: "completed", completedAt: new Date() })
    .where(
      and(
        eq(protocolSessions.id, sessionId),
        eq(protocolSessions.status, "active")
      )
    )
    .returning();

  if (!session) {
    throw new Error("No active session found with that ID.");
  }

  await logActivity("protocol_completed", "protocol_session", sessionId, {
    protocolId: session.protocolId,
  });

  return session;
}

export async function abandonSession(sessionId: number) {
  const [session] = await db
    .update(protocolSessions)
    .set({ status: "abandoned", completedAt: new Date() })
    .where(
      and(
        eq(protocolSessions.id, sessionId),
        eq(protocolSessions.status, "active")
      )
    )
    .returning();

  if (!session) {
    throw new Error("No active session found with that ID.");
  }

  await logActivity("protocol_abandoned", "protocol_session", sessionId, {
    protocolId: session.protocolId,
  });

  return session;
}

export async function getSessions(filters?: { status?: string }) {
  const conditions = [];
  if (filters?.status)
    conditions.push(eq(protocolSessions.status, filters.status));

  return db
    .select()
    .from(protocolSessions)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(protocolSessions.startedAt);
}
