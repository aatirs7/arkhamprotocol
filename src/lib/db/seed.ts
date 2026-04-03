import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { protocols, protocolSteps } from "./schema";

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  console.log("Seeding Fajr Protocol...");

  const [protocol] = await db
    .insert(protocols)
    .values({
      name: "Fajr Protocol",
      description:
        "A structured morning routine anchored around Fajr prayer. Designed to build discipline, spiritual connection, and an intentional start to the day.",
      displayMode: "sequential",
      isActive: true,
    })
    .returning();

  const steps = [
    {
      title: "Reflect",
      description: "Take a moment of gratitude and set your intention for the day.",
      orderIndex: 0,
      durationSeconds: 120,
    },
    {
      title: "Get Up",
      description: "Rise from bed immediately. No snooze, no hesitation.",
      orderIndex: 1,
      durationSeconds: 30,
    },
    {
      title: "Make Wudu",
      description: "Perform ablution with focus and presence.",
      orderIndex: 2,
      durationSeconds: 300,
    },
    {
      title: "Pray Tahajjud",
      description: "2-4 rakaat of night prayer before Fajr.",
      orderIndex: 3,
      durationSeconds: 600,
    },
    {
      title: "Prepare for Fajr",
      description: "Wait for the adhan. Make dhikr and dua.",
      orderIndex: 4,
      durationSeconds: 300,
    },
    {
      title: "Pray Fajr",
      description: "Perform Fajr salah with full concentration.",
      orderIndex: 5,
      durationSeconds: 300,
    },
    {
      title: "Morning Adhkar",
      description: "Post-prayer remembrance and morning supplications.",
      orderIndex: 6,
      durationSeconds: 600,
    },
  ];

  await db.insert(protocolSteps).values(
    steps.map((step) => ({
      ...step,
      protocolId: protocol.id,
    }))
  );

  console.log(`Fajr Protocol created with ID ${protocol.id} and ${steps.length} steps.`);
  console.log("Seed complete.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
