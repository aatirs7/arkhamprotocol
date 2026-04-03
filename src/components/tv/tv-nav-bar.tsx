"use client";

import { MaterialIcon } from "./material-icon";

export function TVNavBar() {
  return (
    <header className="bg-black/50 backdrop-blur-sm text-cyan-400 font-headline tracking-widest uppercase flex justify-between items-center w-full px-16 py-8 fixed top-0 left-0 z-50">
      <div className="text-xl font-bold tracking-tighter text-cyan-400">
        TACTICAL COMMAND
      </div>

      <nav className="flex gap-16">
        <span className="text-cyan-400 border-b border-cyan-400/50 pb-1 cursor-default">
          STRATEGY
        </span>
        <span className="text-neutral-600 hover:text-white transition-colors cursor-default">
          ILMY
        </span>
        <span className="text-neutral-600 hover:text-white transition-colors cursor-default">
          ELYSIA
        </span>
        <span className="text-neutral-600 hover:text-white transition-colors cursor-default">
          COMMAND
        </span>
      </nav>

      <div className="flex items-center gap-8">
        <MaterialIcon
          name="settings_input_component"
          className="text-neutral-600 hover:text-cyan-400 transition-colors cursor-pointer"
        />
        <MaterialIcon
          name="notifications_active"
          className="text-neutral-600 hover:text-cyan-400 transition-colors cursor-pointer"
        />
        <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center overflow-hidden border border-neutral-800">
          <div className="w-full h-full bg-neutral-800" />
        </div>
      </div>
    </header>
  );
}
