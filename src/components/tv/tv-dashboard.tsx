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
    // Greeting holds for 30s, then reveal dashboard
    const revealTimer = setTimeout(() => setPhase("revealing"), 30000);
    const readyTimer = setTimeout(() => setPhase("ready"), 31000);
    return () => {
      clearTimeout(revealTimer);
      clearTimeout(readyTimer);
    };
  }, []);

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Greeting phase — cinematic entrance
  if (phase === "greeting") {
    return (
      <div className="h-screen flex items-center justify-center bg-black relative overflow-hidden">
        {/* Subtle radial gradient backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,229,255,0.03)_0%,_transparent_70%)]" />

        <div className="animate-greeting-in text-center relative z-10">
          <div className="text-6xl font-headline font-bold tracking-[0.15em] greeting-shimmer leading-tight">
            Assalamu Alaykum
          </div>
          <div className="greeting-subtitle text-2xl font-headline font-light tracking-[0.4em] text-white/50 mt-4">
            Aatir
          </div>

          {/* Decorative line */}
          <div className="flex justify-center mt-8">
            <div className="greeting-line h-px bg-gradient-to-r from-transparent via-[#00e5ff]/40 to-transparent" />
          </div>

          {/* Date */}
          <div className="greeting-date mt-6 text-neutral-600 text-sm font-label tracking-[0.3em] uppercase">
            {dateStr}
          </div>
        </div>
      </div>
    );
  }

  // Revealing phase — greeting fading out
  if (phase === "revealing" && (!data || isLoading)) {
    return (
      <div className="h-screen flex items-center justify-center bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,229,255,0.03)_0%,_transparent_70%)]" />
        <div className="animate-greeting-out text-center relative z-10">
          <div className="text-6xl font-headline font-bold tracking-[0.15em] text-white/90 leading-tight">
            Assalamu Alaykum
          </div>
          <div className="text-2xl font-headline font-light tracking-[0.4em] text-white/50 mt-4">
            Aatir
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
