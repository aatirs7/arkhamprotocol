"use client";

import type { PrayerData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Props {
  prayers: PrayerData[];
}

const PRAYER_ORDER = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export function TVPrayerTracker({ prayers }: Props) {
  const sorted = PRAYER_ORDER.map(
    (name) => prayers.find((p) => p.name === name) ?? { name, completed: false }
  );

  const completed = sorted.filter((p) => p.completed).length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-secondary uppercase tracking-wider">
          Salah
        </h2>
        <span className="text-lg text-text-secondary">
          <span className="text-text-primary font-bold">{completed}</span> / 5
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-4">
        {sorted.map((prayer) => (
          <div
            key={prayer.name}
            className={cn(
              "flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-300",
              prayer.completed
                ? "bg-success/10 border border-success/20"
                : "bg-surface border border-border"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                prayer.completed
                  ? "bg-success text-background"
                  : "bg-border text-muted"
              )}
            >
              {prayer.completed && <Check className="w-5 h-5" />}
            </div>
            <span
              className={cn(
                "text-2xl font-medium capitalize",
                prayer.completed ? "text-success" : "text-text-primary"
              )}
            >
              {prayer.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
