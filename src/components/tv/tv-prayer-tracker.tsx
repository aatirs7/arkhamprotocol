"use client";

import type { PrayerData } from "@/lib/types";
import { MaterialIcon } from "./material-icon";

interface Props {
  prayers: PrayerData[];
}

const PRAYER_ORDER = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export function TVPrayerTracker({ prayers }: Props) {
  const sorted = PRAYER_ORDER.map(
    (name) => prayers.find((p) => p.name === name) ?? { name, completed: false }
  );

  // Find the next uncompleted prayer
  const nextPrayer = sorted.find((p) => !p.completed);
  const nextPrayerName = nextPrayer?.name?.toUpperCase() ?? "ALL COMPLETE";

  return (
    <div className="flex flex-col thin-border-r pr-10">
      <div className="flex items-center justify-between mb-12 opacity-40">
        <h2 className="font-headline text-xs font-bold tracking-[0.4em] text-white uppercase">
          PRAYER TRACKER
        </h2>
        <MaterialIcon name="visibility" className="text-cyan-400 text-sm" />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="text-neutral-500 font-headline tracking-[0.3em] text-[10px] mb-2 uppercase opacity-60">
          {nextPrayer ? `UPCOMING: ${nextPrayerName}` : "ALL PRAYERS COMPLETE"}
        </div>

        {/* Countdown placeholder — shows dashes until prayer time API is integrated */}
        <div className="text-6xl font-headline font-light text-[#00e5ff] tabular-nums tracking-tight mb-12">
          {nextPrayer ? "--:--:--" : "00:00:00"}
        </div>

        <div className="w-full space-y-8">
          {sorted.map((prayer) => {
            const isNext = nextPrayer?.name === prayer.name;
            const isCompleted = prayer.completed;

            return (
              <div
                key={prayer.name}
                className="flex justify-between items-center text-[10px] font-label tracking-[0.2em]"
              >
                <span
                  className={
                    isNext
                      ? "text-[#00e5ff]"
                      : isCompleted
                        ? "text-neutral-600"
                        : "text-neutral-700"
                  }
                >
                  {prayer.name.toUpperCase()}
                </span>
                <span
                  className={
                    isNext
                      ? "text-[#00e5ff]"
                      : isCompleted
                        ? "text-cyan-400/40"
                        : "text-neutral-700"
                  }
                >
                  {isCompleted
                    ? "COMPLETED"
                    : isNext
                      ? "ACTIVE"
                      : "--:--"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
