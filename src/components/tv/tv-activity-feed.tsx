"use client";

import type { ActivityData } from "@/lib/types";
import { Activity } from "lucide-react";

interface Props {
  activities: ActivityData[];
}

const EVENT_LABELS: Record<string, string> = {
  task_created: "Task created",
  task_completed: "Task completed",
  prayer_completed: "Prayer completed",
  protocol_started: "Protocol started",
  protocol_completed: "Protocol completed",
  protocol_abandoned: "Protocol abandoned",
  protocol_step_advanced: "Step advanced",
  project_created: "Project created",
};

function formatTime(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function getDetail(activity: ActivityData): string {
  const meta = activity.metadata ?? {};
  if (meta.title) return String(meta.title);
  if (meta.name) return String(meta.name);
  if (meta.protocolName) return String(meta.protocolName);
  if (meta.stepTitle) return String(meta.stepTitle);
  return "";
}

export function TVActivityFeed({ activities }: Props) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <h2 className="text-xl font-semibold text-text-secondary uppercase tracking-wider mb-6">
          Activity
        </h2>
        <div className="flex-1 flex items-center justify-center text-muted">
          <p className="text-xl">No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold text-text-secondary uppercase tracking-wider mb-6">
        Activity
      </h2>
      <div className="flex-1 flex flex-col gap-2 overflow-hidden">
        {activities.slice(0, 8).map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface/50"
          >
            <Activity className="w-4 h-4 text-muted shrink-0" />
            <span className="text-base text-text-primary truncate">
              {EVENT_LABELS[activity.eventType] ?? activity.eventType}
            </span>
            {getDetail(activity) && (
              <span className="text-base text-text-secondary truncate">
                — {getDetail(activity)}
              </span>
            )}
            <span className="text-sm text-muted ml-auto shrink-0">
              {formatTime(activity.createdAt)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
