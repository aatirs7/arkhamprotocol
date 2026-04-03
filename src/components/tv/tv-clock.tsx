"use client";

import { useState, useEffect } from "react";
import { getDailyWisdom } from "@/lib/data/daily-wisdom";
import { MaterialIcon } from "./material-icon";

export function TVClock() {
  const [time, setTime] = useState<string>("");
  const [period, setPeriod] = useState<string>("");
  const [wisdom] = useState(() => getDailyWisdom());

  useEffect(() => {
    function update() {
      const now = new Date();
      let h = now.getHours();
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setTime(`${String(h).padStart(2, "0")}:${m}:${s}`);
      setPeriod(ampm);
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Welcome */}
      <div className="text-neutral-500 uppercase tracking-[0.5em] font-headline text-sm mb-4 opacity-60">
        Welcome, Aatir
      </div>

      {/* Clock */}
      <div className="flex items-baseline gap-4">
        <div className="text-[12rem] font-headline font-bold tracking-tighter text-white tabular-nums glow-cyan leading-none">
          {time || "\u00A0"}
        </div>
        <div className="text-3xl font-headline font-light text-neutral-500 tracking-wider">
          {period}
        </div>
      </div>

      {/* Daily Wisdom */}
      <div className="mt-8 flex items-center gap-3 text-neutral-500 uppercase tracking-[0.3em] font-headline text-[10px] opacity-70 max-w-3xl text-center leading-relaxed">
        <MaterialIcon name="auto_stories" className="text-cyan-400/40 text-sm shrink-0" />
        {wisdom}
      </div>
    </>
  );
}
