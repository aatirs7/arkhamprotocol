import { db } from "@/lib/db";
import { protocols, protocolSteps } from "@/lib/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import { logActivity } from "./activity-service";

export async function getProtocols() {
  return db.select().from(protocols).orderBy(desc(protocols.createdAt));
}

export async function getProtocolById(id: number) {
  const [protocol] = await db
    .select()
    .from(protocols)
    .where(eq(protocols.id, id));
  return protocol ?? null;
}

export async function getProtocolWithSteps(id: number) {
  const protocol = await getProtocolById(id);
  if (!protocol) return null;

  const steps = await db
    .select()
    .from(protocolSteps)
    .where(eq(protocolSteps.protocolId, id))
    .orderBy(asc(protocolSteps.orderIndex));

  return { ...protocol, steps };
}

export async function getProtocolByName(name: string) {
  const [protocol] = await db
    .select()
    .from(protocols)
    .where(eq(protocols.name, name));
  return protocol ?? null;
}

export async function createProtocol(data: {
  name: string;
  description?: string;
  displayMode?: string;
}) {
  const [protocol] = await db.insert(protocols).values(data).returning();
  await logActivity("protocol_created", "protocol", protocol.id, {
    name: protocol.name,
  });
  return protocol;
}

export async function updateProtocol(
  id: number,
  data: Partial<{
    name: string;
    description: string;
    displayMode: string;
    isActive: boolean;
  }>
) {
  const [protocol] = await db
    .update(protocols)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(protocols.id, id))
    .returning();
  return protocol ?? null;
}

export async function deleteProtocol(id: number) {
  const [protocol] = await db
    .delete(protocols)
    .where(eq(protocols.id, id))
    .returning();
  return protocol ?? null;
}

export async function addProtocolStep(data: {
  protocolId: number;
  title: string;
  description?: string;
  orderIndex: number;
  durationSeconds?: number;
}) {
  const [step] = await db.insert(protocolSteps).values(data).returning();
  return step;
}

export async function getProtocolSteps(protocolId: number) {
  return db
    .select()
    .from(protocolSteps)
    .where(eq(protocolSteps.protocolId, protocolId))
    .orderBy(asc(protocolSteps.orderIndex));
}
