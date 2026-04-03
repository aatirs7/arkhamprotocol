"use client";

import { useState, useEffect } from "react";
import { generateSystemLine } from "@/lib/data/system-awareness";
import { getDailyWisdom } from "@/lib/data/daily-wisdom";
import type { DashboardData } from "@/lib/types";

interface Props {
  data: DashboardData;
}

export function TVClock({ data }: Props) {
  const [time, setTime] = useState<string>("");
  const [period, setPeriod] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");
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
      setDateStr(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      );
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const systemLine = generateSystemLine(data);

  return (
    <>
      {/* Title */}
      <div className="text-neutral-600 text-[10px] font-label tracking-[0.5em] uppercase mb-6">
        Arkham Command Center
      </div>

      {/* Clock — commanding, alive */}
      <div className="flex items-baseline gap-4 clock-alive">
        <div className="text-[11rem] font-headline font-bold tracking-tighter text-white tabular-nums glow-cyan leading-none">
          {time || "\u00A0"}
        </div>
        <div className="text-2xl font-headline font-light text-neutral-600 tracking-wider">
          {period}
        </div>
      </div>

      {/* Date — quiet */}
      <div className="mt-3 text-neutral-600 text-sm font-label tracking-[0.3em] uppercase">
        {dateStr}
      </div>

      {/* System awareness — the system is briefing you */}
      <div className="mt-6 text-neutral-400 text-base font-body tracking-wide max-w-2xl text-center leading-relaxed">
        {systemLine}
      </div>

      {/* Daily wisdom — Quran verse or Hadith */}
      <div className="mt-5 text-neutral-400 text-sm font-body italic tracking-wide max-w-2xl text-center leading-relaxed">
        {wisdom}
      </div>
    </>
  );
}
