"use client";

import type { TaskData } from "@/lib/types";
import { MaterialIcon } from "./material-icon";

interface Props {
  tasks: TaskData[];
}

const PRIORITY_LABELS: Record<string, string> = {
  critical: "CRITICAL",
  high: "HIGH",
  medium: "MEDIUM",
  low: "LOW",
};

export function TVTaskSummary({ tasks }: Props) {
  const displayed = tasks.slice(0, 6);

  return (
    <div className="flex flex-col thin-border-r pr-10">
      <div className="flex items-center justify-between mb-12 opacity-40">
        <h2 className="font-headline text-xs font-bold tracking-[0.4em] text-white uppercase">
          TOP TASKS
        </h2>
        <MaterialIcon
          name="format_list_bulleted"
          className="text-cyan-400 text-sm"
        />
      </div>

      {displayed.length === 0 ? (
        <div className="text-neutral-700 text-[10px] tracking-widest uppercase">
          No tasks due today
        </div>
      ) : (
        <div className="space-y-12">
          {displayed.map((task, i) => {
            const isCritical =
              task.priority === "critical" || task.priority === "high";
            const isDone = task.status === "done";

            return (
              <div key={task.id} className="flex items-start gap-6">
                <div
                  className={`mt-1.5 w-3 h-3 border ${
                    isDone
                      ? "border-cyan-400/50 bg-cyan-400/30"
                      : isCritical
                        ? "border-cyan-400/50 bg-cyan-400/10"
                        : "border-neutral-800"
                  }`}
                />
                <div className="flex-1">
                  <div
                    className={`text-sm font-headline font-medium tracking-widest uppercase mb-1 ${
                      isDone
                        ? "text-neutral-600 line-through"
                        : isCritical
                          ? "text-white"
                          : "text-neutral-400"
                    }`}
                  >
                    {task.title.replace(/\s+/g, "_")}
                  </div>
                  <div className="text-neutral-600 text-[10px] font-label tracking-widest uppercase">
                    {task.dueDate ?? "TODAY"} |{" "}
                    {PRIORITY_LABELS[task.priority ?? "medium"] ?? "MEDIUM"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-auto pt-8">
        <div className="text-[9px] text-cyan-400/20 font-headline tracking-[0.4em] uppercase">
          SYSTEM_STATUS: SYNC_OK
        </div>
      </div>
    </div>
  );
}
