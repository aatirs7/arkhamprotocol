import type { DashboardData } from "@/lib/types";

const PRAYER_ORDER = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function generateSystemLine(data: DashboardData): string {
  const parts: string[] = [];

  // Protocol awareness
  if (data.activeSession) {
    const step = data.activeSession.currentStepIndex + 1;
    const total = data.activeSession.totalSteps;
    parts.push(
      `Running ${data.activeSession.protocolName}. Step ${step} of ${total}.`
    );
    return parts.join(" ");
  }

  // Prayer awareness
  const completed = data.prayersToday.filter((p) => p.completed);
  const completedNames = new Set(completed.map((p) => p.name));
  const nextPrayer = PRAYER_ORDER.find((name) => !completedNames.has(name));

  if (nextPrayer) {
    parts.push(`${capitalize(nextPrayer)} is next.`);
  } else {
    parts.push("All prayers complete.");
  }

  // Task awareness
  const pendingTasks = data.tasksDueToday.filter(
    (t) => t.status !== "done"
  );

  if (pendingTasks.length === 0) {
    parts.push("No tasks pending.");
  } else if (pendingTasks.length === 1) {
    parts.push("1 task remaining.");
  } else {
    parts.push(`${pendingTasks.length} tasks remaining.`);
  }

  // If everything is done
  if (!nextPrayer && pendingTasks.length === 0) {
    return "All prayers complete. Nothing pending. Rest well.";
  }

  return parts.join(" ");
}
