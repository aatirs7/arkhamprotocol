"use client";

import { usePrayers } from "@/lib/hooks/use-prayers";
import { Card, CardHeader, CardTitle } from "@/components/shared/card";
import { Button } from "@/components/shared/button";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";

const PRAYER_ORDER = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export function PrayerGrid() {
  const { prayers, mutate } = usePrayers();
  const [loading, setLoading] = useState<string | null>(null);

  const sorted = PRAYER_ORDER.map(
    (name) =>
      prayers.find((p: { name: string }) => p.name === name) ?? {
        name,
        completed: false,
      }
  );

  async function markComplete(name: string) {
    setLoading(name);
    await fetch("/api/prayers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    await mutate();
    setLoading(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salah Tracker</CardTitle>
        <span className="text-sm text-text-secondary">
          {sorted.filter((p) => p.completed).length}/5 complete
        </span>
      </CardHeader>
      <div className="grid grid-cols-5 gap-3">
        {sorted.map((prayer) => (
          <button
            key={prayer.name}
            onClick={() => !prayer.completed && markComplete(prayer.name)}
            disabled={prayer.completed || loading === prayer.name}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
              prayer.completed
                ? "bg-success/10 border-success/30 cursor-default"
                : "bg-background border-border hover:border-accent cursor-pointer"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                prayer.completed
                  ? "bg-success text-background"
                  : "bg-border text-muted"
              )}
            >
              {loading === prayer.name ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : prayer.completed ? (
                <Check className="w-5 h-5" />
              ) : null}
            </div>
            <span
              className={cn(
                "text-sm font-medium capitalize",
                prayer.completed ? "text-success" : "text-text-primary"
              )}
            >
              {prayer.name}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}
