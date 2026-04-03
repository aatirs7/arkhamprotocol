import { NextResponse } from "next/server";
import { getActiveSession } from "@/lib/services/session-service";
import { getPrayersForDate, getPrayerStats } from "@/lib/services/prayer-service";
import { getTasksDueToday, getTasks } from "@/lib/services/task-service";
import { getRecentActivity } from "@/lib/services/activity-service";

export async function GET() {
  const [activeSession, prayersToday, tasksDueToday, allTasks, recentActivity, prayerStats] =
    await Promise.all([
      getActiveSession(),
      getPrayersForDate(),
      getTasksDueToday(),
      getTasks({ status: "done" }),
      getRecentActivity(10),
      getPrayerStats(),
    ]);

  const data = {
    activeSession: activeSession
      ? {
          id: activeSession.id,
          protocolId: activeSession.protocolId,
          protocolName: activeSession.protocol?.name ?? "Unknown",
          protocolDescription: activeSession.protocol?.description ?? null,
          status: activeSession.status,
          currentStepIndex: activeSession.currentStepIndex,
          totalSteps: activeSession.steps.length,
          currentStep:
            activeSession.steps[activeSession.currentStepIndex ?? 0] ?? null,
          steps: activeSession.steps,
          startedAt: activeSession.startedAt,
        }
      : null,
    prayersToday,
    tasksDueToday,
    recentActivity,
    stats: {
      tasksCompleted: allTasks.length,
      prayersCompleted: prayerStats.completed,
      totalPrayers: prayerStats.total,
    },
  };

  return NextResponse.json(data);
}
