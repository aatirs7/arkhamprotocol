import { NextRequest, NextResponse } from "next/server";
import {
  getPrayerTime,
  getAllPrayerTimesFormatted,
  getNextPrayer,
} from "@/lib/services/aladhan-service";

// ---------------------------------------------------------------------------
// Alexa HTTPS Endpoint — handles native Alexa JSON request/response format
// This skill ("My Prayers") is separate from the Arkham Dashboard Alexa skill.
// No Lambda needed — Alexa calls this endpoint directly.
// ---------------------------------------------------------------------------

interface AlexaSlot {
  name: string;
  value?: string;
  resolutions?: {
    resolutionsPerAuthority?: Array<{
      values?: Array<{ value: { name: string } }>;
    }>;
  };
}

function getSlotValue(slots: Record<string, AlexaSlot> | undefined, slotName: string): string | null {
  const slot = slots?.[slotName];
  if (!slot) return null;
  // Try resolved value first (handles synonyms like "zuhr" -> "dhuhr")
  const resolved = slot.resolutions?.resolutionsPerAuthority?.[0]?.values?.[0]?.value?.name;
  return resolved ?? slot.value ?? null;
}

function speechResponse(text: string, endSession = true) {
  return NextResponse.json({
    version: "1.0",
    response: {
      outputSpeech: {
        type: "SSML",
        ssml: `<speak>${text}</speak>`,
      },
      shouldEndSession: endSession,
    },
  });
}

function audioResponse(url: string, token: string) {
  return NextResponse.json({
    version: "1.0",
    response: {
      directives: [
        {
          type: "AudioPlayer.Play",
          playBehavior: "REPLACE_ALL",
          audioItem: {
            stream: {
              url,
              token,
              offsetInMilliseconds: 0,
            },
          },
        },
      ],
      shouldEndSession: true,
    },
  });
}

function stopResponse() {
  return NextResponse.json({
    version: "1.0",
    response: {
      directives: [{ type: "AudioPlayer.Stop" }],
      shouldEndSession: true,
    },
  });
}

function emptyResponse() {
  return NextResponse.json({
    version: "1.0",
    response: {},
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const requestType = body.request?.type;

    // AudioPlayer events — acknowledge silently
    if (requestType?.startsWith("AudioPlayer.")) {
      return emptyResponse();
    }

    // SessionEndedRequest
    if (requestType === "SessionEndedRequest") {
      return emptyResponse();
    }

    // LaunchRequest
    if (requestType === "LaunchRequest") {
      return speechResponse(
        "Assalamu Alaikum. You can ask for prayer times, the next prayer, or say play the adhan.",
        false
      );
    }

    // IntentRequest
    if (requestType === "IntentRequest") {
      const intentName = body.request?.intent?.name;
      const slots = body.request?.intent?.slots;

      switch (intentName) {
        case "GetPrayerTimeIntent": {
          const prayer = getSlotValue(slots, "prayer");
          if (!prayer) {
            return speechResponse("Please specify which prayer, like Fajr or Maghrib.");
          }
          const time = await getPrayerTime(prayer);
          const name = prayer.charAt(0).toUpperCase() + prayer.slice(1);
          return speechResponse(`${name} is at ${time} today.`);
        }

        case "GetAllPrayerTimesIntent": {
          const text = await getAllPrayerTimesFormatted();
          return speechResponse(text);
        }

        case "NextPrayerIntent": {
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
          return speechResponse(
            `The next prayer is ${next.name} at ${next.time}, in ${timeUntil}.`
          );
        }

        case "PlayAdhanIntent": {
          const prayer = getSlotValue(slots, "prayer") ?? "regular";
          const variant = prayer.toLowerCase();
          const ADHAN_MAP: Record<string, string> = {
            fajr: "fajr-adhan.mp3",
            tahajjud: "tahajjud-adhan.mp3",
          };
          const filename = ADHAN_MAP[variant] ?? "regular-adhan.mp3";
          const audioUrl = `https://arkhamprotocol.vercel.app/audio/${filename}`;
          return audioResponse(audioUrl, `adhan-${variant}`);
        }

        case "AMAZON.HelpIntent": {
          return speechResponse(
            "You can ask what time is fajr, what's the next prayer, all prayer times, or say play the adhan.",
            false
          );
        }

        case "AMAZON.StopIntent":
        case "AMAZON.CancelIntent":
        case "AMAZON.PauseIntent": {
          return stopResponse();
        }

        case "AMAZON.ResumeIntent": {
          return emptyResponse();
        }

        default:
          return speechResponse("I didn't understand that. Try asking for prayer times or saying play the adhan.");
      }
    }

    return emptyResponse();
  } catch (err) {
    console.error("Alexa skill error:", err);
    return speechResponse("Something went wrong. Try again.");
  }
}
