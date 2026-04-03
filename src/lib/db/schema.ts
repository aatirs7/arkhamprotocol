import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  date,
  timestamp,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================
// Tasks
// ============================================================

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").default("medium"), // low | medium | high | critical
  category: text("category"),
  projectId: integer("project_id").references(() => projects.id, {
    onDelete: "set null",
  }),
  status: text("status").default("pending"), // pending | in_progress | done
  dueDate: date("due_date"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ============================================================
// Prayers
// ============================================================

export const prayers = pgTable(
  "prayers",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(), // fajr | dhuhr | asr | maghrib | isha
    date: date("date").notNull(),
    completed: boolean("completed").default(false),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [unique("prayers_name_date_unique").on(table.name, table.date)]
);

// ============================================================
// Projects
// ============================================================

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").default("active"), // active | paused | completed | archived
  progress: integer("progress").default(0), // 0–100
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ============================================================
// Protocols
// ============================================================

export const protocols = pgTable("protocols", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  displayMode: text("display_mode").default("sequential"), // sequential | checklist
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ============================================================
// Protocol Steps
// ============================================================

export const protocolSteps = pgTable("protocol_steps", {
  id: serial("id").primaryKey(),
  protocolId: integer("protocol_id")
    .notNull()
    .references(() => protocols.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull(),
  durationSeconds: integer("duration_seconds"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ============================================================
// Protocol Sessions (active runs of a protocol)
// ============================================================

export const protocolSessions = pgTable("protocol_sessions", {
  id: serial("id").primaryKey(),
  protocolId: integer("protocol_id")
    .notNull()
    .references(() => protocols.id),
  status: text("status").default("active"), // active | completed | abandoned
  currentStepIndex: integer("current_step_index").default(0),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  stepTimestamps: jsonb("step_timestamps").default([]),
});

// ============================================================
// Notes (daily thoughts)
// ============================================================

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  date: date("date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ============================================================
// Activity Log
// ============================================================

export const activityLog = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  entityType: text("entity_type"),
  entityId: integer("entity_id"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ============================================================
// Relations
// ============================================================

export const projectsRelations = relations(projects, ({ many }) => ({
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
}));

export const protocolsRelations = relations(protocols, ({ many }) => ({
  steps: many(protocolSteps),
  sessions: many(protocolSessions),
}));

export const protocolStepsRelations = relations(protocolSteps, ({ one }) => ({
  protocol: one(protocols, {
    fields: [protocolSteps.protocolId],
    references: [protocols.id],
  }),
}));

export const protocolSessionsRelations = relations(
  protocolSessions,
  ({ one }) => ({
    protocol: one(protocols, {
      fields: [protocolSessions.protocolId],
      references: [protocols.id],
    }),
  })
);
