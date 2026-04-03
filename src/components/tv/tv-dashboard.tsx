"use client";

import { useDashboard } from "@/lib/hooks/use-dashboard";
import { TVClock } from "./tv-clock";
import { TVProtocolCard } from "./tv-protocol-card";
import { TVPrayerTracker } from "./tv-prayer-tracker";
import { TVTaskSummary } from "./tv-task-summary";
import { TVMissionBanner } from "./tv-mission-banner";
import { TVActivityFeed } from "./tv-activity-feed";
import { Shield } from "lucide-react";

export function TVDashboard() {
  const { data, isLoading } = useDashboard();

  if (isLoading || !data) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6">
        <Shield className="w-20 h-20 text-accent animate-pulse" />
        <h1 className="text-4xl font-bold text-text-primary tracking-widest uppercase">
          Arkham
        </h1>
        <p className="text-xl text-text-secondary">Initializing...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col p-6 gap-4">
      {/* Top bar */}
      <header className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Shield className="w-8 h-8 text-accent" />
          <h1 className="text-2xl font-bold tracking-widest uppercase text-text-primary">
            Arkham
          </h1>
        </div>
        <TVMissionBanner stats={data.stats} />
        <TVClock />
      </header>

      {/* Divider */}
      <div className="h-px bg-border shrink-0" />

      {/* Main grid */}
      <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
        {/* Top left: Protocol */}
        <div className="bg-surface rounded-2xl border border-border p-6 overflow-hidden">
          <TVProtocolCard session={data.activeSession} />
        </div>

        {/* Top right: Prayers */}
        <div className="bg-surface rounded-2xl border border-border p-6 overflow-hidden">
          <TVPrayerTracker prayers={data.prayersToday} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-6 h-[35%] shrink-0">
        {/* Bottom left: Tasks */}
        <div className="bg-surface rounded-2xl border border-border p-6 overflow-hidden">
          <TVTaskSummary tasks={data.tasksDueToday} />
        </div>

        {/* Bottom right: Activity */}
        <div className="bg-surface rounded-2xl border border-border p-6 overflow-hidden">
          <TVActivityFeed activities={data.recentActivity} />
        </div>
      </div>
    </div>
  );
}
