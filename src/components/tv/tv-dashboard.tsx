"use client";

import { useDashboard } from "@/lib/hooks/use-dashboard";
import { TVNavBar } from "./tv-nav-bar";
import { TVClock } from "./tv-clock";
import { TVPrayerTracker } from "./tv-prayer-tracker";
import { TVTaskSummary } from "./tv-task-summary";
import { TVProjectTracker } from "./tv-project-tracker";
import { TVFooter } from "./tv-footer";

export function TVDashboard() {
  const { data, isLoading } = useDashboard();

  if (isLoading || !data) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6 bg-black">
        <div className="text-4xl font-headline font-bold tracking-tighter text-cyan-400 glow-cyan">
          TACTICAL COMMAND
        </div>
        <div className="flex items-center gap-3 opacity-40">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-label text-neutral-500 tracking-[0.4em] uppercase">
            Initializing Systems
          </span>
        </div>
      </div>
    );
  }

  const intentionText = data.activeSession
    ? data.activeSession.protocolName.toUpperCase()
    : undefined;

  return (
    <>
      <TVNavBar />

      <main className="min-h-screen w-full flex flex-col pt-48 pb-20 px-16">
        {/* Centered HUD Clock & Intention */}
        <section className="flex flex-col items-center justify-center mb-24">
          <TVClock intentionText={intentionText} />
        </section>

        {/* Main Content Grid (3 Columns) */}
        <div className="grid grid-cols-3 gap-20 flex-1">
          <TVPrayerTracker prayers={data.prayersToday} />
          <TVTaskSummary tasks={data.tasksDueToday} />
          <TVProjectTracker projects={data.projects} />
        </div>
      </main>

      <TVFooter />
    </>
  );
}
