"use client";

import { PrayerGrid } from "./prayer-grid";
import { SessionControls } from "./session-controls";
import { TaskList } from "./task-list";
import { ProjectList } from "./project-list";

export function DesktopDashboard() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top row: Protocol + Prayers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SessionControls />
          <PrayerGrid />
        </div>

        {/* Bottom row: Tasks + Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TaskList />
          <ProjectList />
        </div>
      </div>
    </div>
  );
}
