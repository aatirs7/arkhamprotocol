"use client";

import type { TaskData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Circle, CheckCircle2, ListTodo } from "lucide-react";

interface Props {
  tasks: TaskData[];
}

const PRIORITY_COLORS: Record<string, string> = {
  critical: "text-danger",
  high: "text-warning",
  medium: "text-accent",
  low: "text-muted",
};

export function TVTaskSummary({ tasks }: Props) {
  const displayed = tasks.slice(0, 6);

  if (displayed.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <h2 className="text-xl font-semibold text-text-secondary uppercase tracking-wider mb-6">
          Tasks
        </h2>
        <div className="flex-1 flex flex-col items-center justify-center text-muted">
          <ListTodo className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-xl">No tasks due today</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-secondary uppercase tracking-wider">
          Tasks
        </h2>
        <span className="text-lg text-text-secondary">{tasks.length} due</span>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        {displayed.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-4 px-4 py-3 bg-surface rounded-xl border border-border"
          >
            {task.status === "done" ? (
              <CheckCircle2 className="w-6 h-6 text-success shrink-0" />
            ) : (
              <Circle
                className={cn(
                  "w-6 h-6 shrink-0",
                  PRIORITY_COLORS[task.priority ?? "medium"]
                )}
              />
            )}
            <span
              className={cn(
                "text-xl truncate",
                task.status === "done"
                  ? "text-muted line-through"
                  : "text-text-primary"
              )}
            >
              {task.title}
            </span>
          </div>
        ))}
        {tasks.length > 6 && (
          <p className="text-sm text-muted text-center mt-2">
            +{tasks.length - 6} more
          </p>
        )}
      </div>
    </div>
  );
}
