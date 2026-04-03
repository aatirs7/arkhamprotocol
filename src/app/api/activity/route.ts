import { NextRequest, NextResponse } from "next/server";
import { getRecentActivity } from "@/lib/services/activity-service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 20;
  const activity = await getRecentActivity(limit);
  return NextResponse.json(activity);
}
