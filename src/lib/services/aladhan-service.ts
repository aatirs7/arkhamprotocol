// In-memory cache (persists during warm Vercel invocations)
let cachedTimings: Record<string, string> | null = null;
let cachedDate: string | null = null;

const ALADHAN_URL =
  "https://api.aladhan.com/v1/timingsByCity?city=Ashburn&country=US&state=VA&method=2";

const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
const VALID_KEYS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

function todayDateET(): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now); // "YYYY-MM-DD" in en-CA locale
  return parts;
}

function getCurrentMinutesET(): number {
  const now = new Date();
  const eastern = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  return eastern.getHours() * 60 + eastern.getMinutes();
}

function parseTimeToMinutes(time24: string): number {
  const [h, m] = time24.split(":").map(Number);
  return h * 60 + m;
}

function to12h(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

// ---------------------------------------------------------------------------
// Exported functions
// ---------------------------------------------------------------------------

export async function getTodayPrayerTimes(): Promise<Record<string, string>> {
  const today = todayDateET();
  if (cachedTimings && cachedDate === today) {
    return cachedTimings;
  }

  const res = await fetch(ALADHAN_URL);
  if (!res.ok) {
    throw new Error("Failed to fetch prayer times from Aladhan API.");
  }

  const json = await res.json();
  const allTimings: Record<string, string> = json.data?.timings ?? {};

  // Filter to only the keys we care about
  const filtered: Record<string, string> = {};
  for (const key of VALID_KEYS) {
    if (allTimings[key]) {
      // Aladhan sometimes appends timezone info like " (EDT)" — strip it
      filtered[key] = allTimings[key].replace(/\s*\(.*\)$/, "");
    }
  }

  cachedTimings = filtered;
  cachedDate = today;
  return filtered;
}

export async function getPrayerTime(prayer: string): Promise<string> {
  const timings = await getTodayPrayerTimes();
  const key = capitalize(prayer);
  const time24 = timings[key];
  if (!time24) {
    throw new Error(
      `Unknown prayer "${prayer}". Try fajr, sunrise, dhuhr, asr, maghrib, or isha.`
    );
  }
  return to12h(time24);
}

export async function getNextPrayer(): Promise<{
  name: string;
  time: string;
  minutesUntil: number;
}> {
  const timings = await getTodayPrayerTimes();
  const nowMinutes = getCurrentMinutesET();

  for (const name of PRAYER_ORDER) {
    const prayerMinutes = parseTimeToMinutes(timings[name]);
    if (prayerMinutes > nowMinutes) {
      return {
        name,
        time: to12h(timings[name]),
        minutesUntil: prayerMinutes - nowMinutes,
      };
    }
  }

  // All prayers have passed — return tomorrow's Fajr
  const fajrMinutes = parseTimeToMinutes(timings["Fajr"]);
  const minutesUntilMidnight = 1440 - nowMinutes;
  return {
    name: "Fajr",
    time: to12h(timings["Fajr"]),
    minutesUntil: minutesUntilMidnight + fajrMinutes,
  };
}

export async function getAllPrayerTimesFormatted(): Promise<string> {
  const timings = await getTodayPrayerTimes();
  const lines = PRAYER_ORDER.map((p) => `${p}: ${to12h(timings[p])}`);
  return `Today's prayer times. ${lines.join(". ")}.`;
}
