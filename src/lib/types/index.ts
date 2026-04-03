export type TaskStatus = "pending" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high" | "critical";
export type ProjectStatus = "active" | "paused" | "completed" | "archived";
export type SessionStatus = "active" | "completed" | "abandoned";
export type PrayerName = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
export type DisplayMode = "tv" | "desktop";

export interface ProjectData {
  id: number;
  name: string;
  description: string | null;
  status: string | null;
  progress: number | null;
}

export interface DashboardData {
  activeSession: ActiveSessionData | null;
  prayersToday: PrayerData[];
  tasksDueToday: TaskData[];
  recentActivity: ActivityData[];
  projects: ProjectData[];
  stats: {
    tasksCompleted: number;
    prayersCompleted: number;
    totalPrayers: number;
  };
}

export interface ActiveSessionData {
  id: number;
  protocolId: number;
  protocolName: string;
  protocolDescription: string | null;
  status: string;
  currentStepIndex: number;
  totalSteps: number;
  currentStep: {
    title: string;
    description: string | null;
  } | null;
  steps: StepData[];
  startedAt: string | null;
}

export interface StepData {
  id: number;
  title: string;
  description: string | null;
  orderIndex: number;
  durationSeconds: number | null;
}

export interface PrayerData {
  id: number | null;
  name: string;
  date: string;
  completed: boolean;
  completedAt: string | null;
}

export interface TaskData {
  id: number;
  title: string;
  description: string | null;
  priority: string | null;
  status: string | null;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string | null;
}

export interface ActivityData {
  id: number;
  eventType: string;
  entityType: string | null;
  entityId: number | null;
  metadata: Record<string, unknown>;
  createdAt: string | null;
}
