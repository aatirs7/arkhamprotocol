"use client";

import type { PrayerData } from "@/lib/types";

interface Props {
  prayers: PrayerData[];
}

const PRAYER_ORDER = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function TVPrayerTracker({ prayers }: Props) {
  const sorted = PRAYER_ORDER.map(
    (name) => prayers.find((p) => p.name === name) ?? { name, completed: false }
  );

  const nextPrayer = sorted.find((p) => !p.completed);
  const completedCount = sorted.filter((p) => p.completed).length;
  const allComplete = completedCount === 5;

  return (
    <div className="flex flex-col thin-border-r pr-10">
      {/* Contextual lead — the system is reporting */}
      <div className="mb-10">
        {allComplete ? (
          <div className="text-neutral-500 text-sm font-body tracking-wide">
            All prayers fulfilled today.
          </div>
        ) : (
          <div className="text-white/80 text-sm font-body tracking-wide">
            Next prayer:{" "}
            <span className="text-[#00e5ff]">
              {capitalize(nextPrayer!.name)}
            </span>
          </div>
        )}
      </div>

      {/* Prayer list — reported, not labeled */}
      <div className="space-y-6 flex-1">
        {sorted.map((prayer) => {
          const isNext = nextPrayer?.name === prayer.name;
          const isCompleted = prayer.completed;

          return (
            <div
              key={prayer.name}
              className="flex items-center justify-between transition-opacity duration-500"
            >
              <div className="flex items-center gap-4">
                {/* Status indicator — structural, not decorative */}
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
                    isCompleted
                      ? "bg-cyan-400/30"
                      : isNext
                        ? "bg-[#00e5ff]"
                        : "bg-neutral-800"
                  }`}
                />
                <span
                  className={`text-sm font-body tracking-wide transition-colors duration-500 ${
                    isNext
                      ? "text-[#00e5ff]"
                      : isCompleted
                        ? "text-neutral-600"
                        : "text-neutral-700"
                  }`}
                >
                  {capitalize(prayer.name)}
                </span>
              </div>

              <span
                className={`text-xs font-label tracking-wider transition-colors duration-500 ${
                  isCompleted
                    ? "text-neutral-700"
                    : isNext
                      ? "text-[#00e5ff]/60"
                      : "text-neutral-800"
                }`}
              >
                {isCompleted ? "done" : isNext ? "pending" : "—"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Quiet count */}
      <div className="mt-auto pt-6 text-neutral-700 text-[10px] font-label tracking-widest">
        {completedCount}/5
      </div>
    </div>
  );
}
