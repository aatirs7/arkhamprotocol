"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "@/lib/hooks/use-dashboard";
import { TVClock } from "./tv-clock";
import { TVPrayerTracker } from "./tv-prayer-tracker";
import { TVTaskSummary } from "./tv-task-summary";
import { TVProjectTracker } from "./tv-project-tracker";
import { TVFooter } from "./tv-footer";

type Phase = "greeting" | "revealing" | "ready";

export function TVDashboard() {
  const { data, isLoading } = useDashboard();
  const [phase, setPhase] = useState<Phase>("greeting");

  useEffect(() => {
    // Greeting holds for 2.5s, then reveal dashboard
    const revealTimer = setTimeout(() => setPhase("revealing"), 2500);
    const readyTimer = setTimeout(() => setPhase("ready"), 3500);
    return () => {
      clearTimeout(revealTimer);
      clearTimeout(readyTimer);
    };
  }, []);

  // Greeting phase — cinematic entrance
  if (phase === "greeting") {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="animate-greeting-in text-center">
          <div className="text-3xl font-headline font-light tracking-[0.3em] text-white/90">
            Assalamu Alaykum, Aatir
          </div>
        </div>
      </div>
    );
  }

  // Revealing phase — greeting fading out
  if (phase === "revealing" && (!data || isLoading)) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="animate-greeting-out text-center">
          <div className="text-3xl font-headline font-light tracking-[0.3em] text-white/90">
            Assalamu Alaykum, Aatir
          </div>
        </div>
      </div>
    );
  }

  // Still loading after greeting
  if (!data || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="flex items-center gap-3 opacity-40">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-label text-neutral-500 tracking-[0.4em] uppercase">
            Systems Online
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={phase === "revealing" ? "animate-dashboard-in" : ""}>
      <main className="min-h-screen w-full flex flex-col pt-20 pb-20 px-16">
        {/* Clock & System Awareness */}
        <section className="flex flex-col items-center justify-center mb-20">
          <TVClock data={data} />
        </section>

        {/* Three columns — structural dividers only */}
        <div className="grid grid-cols-3 gap-16 flex-1">
          <TVPrayerTracker prayers={data.prayersToday} />
          <TVTaskSummary tasks={data.tasksDueToday} />
          <TVProjectTracker projects={data.projects} />
        </div>
      </main>

      <TVFooter />
    </div>
  );
}
