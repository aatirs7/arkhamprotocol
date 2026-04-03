"use client";

import type { TaskData } from "@/lib/types";

interface Props {
  tasks: TaskData[];
}

export function TVTaskSummary({ tasks }: Props) {
  const pending = tasks.filter((t) => t.status !== "done");
  const displayed = pending.slice(0, 6);
  const hasCritical = pending.some(
    (t) => t.priority === "critical" || t.priority === "high"
  );

  // Contextual lead
  let leadText: string;
  if (pending.length === 0) {
    leadText = "Nothing pending. Clear day.";
  } else if (pending.length === 1) {
    leadText = "1 thing needs your attention.";
  } else if (hasCritical) {
    leadText = `${pending.length} tasks. Some are urgent.`;
  } else {
    leadText = `${pending.length} things need your attention.`;
  }

  return (
    <div className="flex flex-col thin-border-r pr-10">
      {/* Contextual lead */}
      <div className="mb-10">
        <div
          className={`text-sm font-body tracking-wide ${
            pending.length === 0 ? "text-neutral-500" : "text-white/80"
          }`}
        >
          {leadText}
        </div>
      </div>

      {/* Task list — natural names, clean */}
      {displayed.length > 0 && (
        <div className="space-y-6 flex-1">
          {displayed.map((task) => {
            const isUrgent =
              task.priority === "critical" || task.priority === "high";

            return (
              <div
                key={task.id}
                className="flex items-start gap-4 transition-opacity duration-500"
              >
                {/* Structural indicator */}
                <div
                  className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${
                    isUrgent ? "bg-[#00e5ff]" : "bg-neutral-800"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-body tracking-wide ${
                      isUrgent ? "text-white/90" : "text-neutral-400"
                    }`}
                  >
                    {task.title}
                  </div>
                  {isUrgent && (
                    <div className="text-[10px] text-[#00e5ff]/40 font-label tracking-wider mt-1">
                      {task.priority}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {pending.length > 6 && (
            <div className="text-neutral-700 text-[10px] font-label tracking-wider">
              +{pending.length - 6} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}
