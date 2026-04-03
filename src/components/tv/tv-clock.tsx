"use client";

import { useState, useEffect } from "react";
import { MaterialIcon } from "./material-icon";

interface Props {
  intentionText?: string;
}

export function TVClock({ intentionText }: Props) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    function update() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setTime(`${h}:${m}:${s}`);
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="text-[12rem] font-headline font-bold tracking-tighter text-white tabular-nums glow-cyan leading-none">
        {time || "\u00A0"}
      </div>
      <div className="mt-8 flex items-center gap-3 text-neutral-500 uppercase tracking-[0.4em] font-headline text-xs opacity-80">
        <MaterialIcon name="psychology" className="text-cyan-400/40 text-sm" />
        {intentionText
          ? `FOCUS: ${intentionText}`
          : "FOCUS: MAINTAIN ABSOLUTE SYSTEM INTEGRITY"}
      </div>
    </>
  );
}
