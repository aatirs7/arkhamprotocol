import { NextRequest, NextResponse } from "next/server";
import { validateAlexaSecret } from "@/lib/api/alexa-auth";
import { createTask } from "@/lib/services/task-service";
import { markPrayerComplete, getPrayerStats } from "@/lib/services/prayer-service";
import { startSession, advanceStep, getActiveSession } from "@/lib/services/session-service";
import { getProtocolByName } from "@/lib/services/protocol-service";
import { addNote } from "@/lib/services/note-service";
import { getPrayerTime, getAllPrayerTimesFormatted, getNextPrayer } from "@/lib/services/aladhan-service";
import { z } from "zod/v4";

const alexaRequestSchema = z.object({
  action: z.enum(["add_task", "complete_prayer", "start_protocol", "advance_protocol", "add_note", "open_page", "run_fajr_protocol", "get_prayer_time", "get_all_prayer_times", "get_next_prayer", "play_adhan"]),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  // Auth check
  const authError = validateAlexaSecret(request);
  if (authError) return authError;

  const body = await request.json();
  const parsed = alexaRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid request", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { action, payload } = parsed.data;

  try {
    switch (action) {
      case "add_task": {
        const title = String(payload?.title ?? "New task");
        const priority = payload?.priority ? String(payload.priority) : undefined;
        const task = await createTask({ title, priority });
        return NextResponse.json({
          success: true,
          message: `Task "${task.title}" has been added.`,
        });
      }

      case "complete_prayer": {
        const name = String(payload?.name ?? "").toLowerCase();
        const prayer = await markPrayerComplete(name);
        const stats = await getPrayerStats();
        return NextResponse.json({
          success: true,
          message: `${prayer.name.charAt(0).toUpperCase() + prayer.name.slice(1)} prayer marked complete. ${stats.completed} of ${stats.total} prayers done today.`,
        });
      }

      case "start_protocol": {
        let protocolId = payload?.protocolId ? Number(payload.protocolId) : undefined;
        if (!protocolId && payload?.protocolName) {
          const protocol = await getProtocolByName(String(payload.protocolName));
          if (!protocol) {
            return NextResponse.json({
              success: false,
              message: `Protocol "${payload.protocolName}" not found.`,
            }, { status: 404 });
          }
          protocolId = protocol.id;
        }
        if (!protocolId) {
          return NextResponse.json({
            success: false,
            message: "Please specify a protocol name or ID.",
          }, { status: 400 });
        }
        const session = await startSession(protocolId);
        return NextResponse.json({
          success: true,
          message: `${session.protocol.name} has been started. First step: ${session.steps[0]?.title ?? "ready"}.`,
        });
      }

      case "add_note": {
        const content = String(payload?.content ?? payload?.note ?? "");
        if (!content) {
          return NextResponse.json({
            success: false,
            message: "Please say what you want to note down.",
          }, { status: 400 });
        }
        await addNote(content);
        return NextResponse.json({
          success: true,
          message: `Got it. Note saved: "${content.slice(0, 60)}${content.length > 60 ? "..." : ""}"`,
        });
      }

      case "run_fajr_protocol": {
        return NextResponse.json({
          success: true,
          message: "Starting Fajr Protocol. Bismillah.",
          navigate: "/tv/fajr-protocol",
        });
      }

      case "open_page": {
        const page = String(payload?.page ?? "").toLowerCase();
        const PAGE_MAP: Record<string, string> = {
          tasks: "/tv/tasks",
          projects: "/tv/projects",
          protocols: "/tv/protocols",
          notes: "/tv/notes",
          "fajr protocol": "/tv/fajr-protocol",
          fajr: "/tv/fajr-protocol",
          home: "/tv",
          dashboard: "/tv",
        };
        const url = PAGE_MAP[page];
        if (!url) {
          return NextResponse.json({
            success: false,
            message: `Unknown page "${page}". Try tasks, projects, protocols, or notes.`,
          }, { status: 400 });
        }
        return NextResponse.json({
          success: true,
          message: `Opening ${page} page.`,
          navigate: url,
        });
      }

      case "advance_protocol": {
        const active = await getActiveSession();
        if (!active) {
          return NextResponse.json({
            success: false,
            message: "No active protocol session. Start one first.",
          }, { status: 404 });
        }
        const updated = await advanceStep(active.id);
        if (updated.status === "completed") {
          return NextResponse.json({
            success: true,
            message: `${updated.protocol?.name ?? "Protocol"} is now complete. Well done.`,
          });
        }
        const nextStep = updated.steps[updated.currentStepIndex ?? 0];
        return NextResponse.json({
          success: true,
          message: `Moving to step ${(updated.currentStepIndex ?? 0) + 1}: ${nextStep?.title ?? "next"}.`,
        });
      }

      case "get_prayer_time": {
        const prayer = String(payload?.prayer ?? "").toLowerCase();
        if (!prayer) {
          return NextResponse.json({
            success: false,
            message: "Please specify which prayer. For example, Fajr or Maghrib.",
          }, { status: 400 });
        }
        const time = await getPrayerTime(prayer);
        const prayerName = prayer.charAt(0).toUpperCase() + prayer.slice(1);
        const speech = `${prayerName} is at ${time} today.`;
        return NextResponse.json({ success: true, message: speech, speech });
      }

      case "get_all_prayer_times": {
        const speech = await getAllPrayerTimesFormatted();
        return NextResponse.json({ success: true, message: speech, speech });
      }

      case "get_next_prayer": {
        const next = await getNextPrayer();
        const hours = Math.floor(next.minutesUntil / 60);
        const mins = next.minutesUntil % 60;
        let timeUntil: string;
        if (hours > 0 && mins > 0) {
          timeUntil = `about ${hours} hour${hours > 1 ? "s" : ""} and ${mins} minute${mins !== 1 ? "s" : ""}`;
        } else if (hours > 0) {
          timeUntil = `about ${hours} hour${hours > 1 ? "s" : ""}`;
        } else {
          timeUntil = `about ${mins} minute${mins !== 1 ? "s" : ""}`;
        }
        const speech = `The next prayer is ${next.name} at ${next.time}, in ${timeUntil}.`;
        return NextResponse.json({ success: true, message: speech, speech });
      }

      case "play_adhan": {
        const variant = String(payload?.prayer ?? "regular").toLowerCase();
        const ADHAN_MAP: Record<string, string> = {
          fajr: "fajr-adhan.mp3",
          tahajjud: "tahajjud-adhan.mp3",
        };
        const filename = ADHAN_MAP[variant] ?? "regular-adhan.mp3";
        const audioUrl = `https://arkhamprotocol.vercel.app/audio/${filename}`;
        return NextResponse.json({
          success: true,
          message: "Playing adhan.",
          speech: "",
          audioUrl,
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: "Unknown action" },
          { status: 400 }
        );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
