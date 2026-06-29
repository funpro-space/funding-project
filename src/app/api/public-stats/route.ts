import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongodb";
import PublicStats from "@/models/PublicStats";

export async function GET() {
  try {
    await dbConnect();
    const stats = await PublicStats.findById("global") || {
      totalChats: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      totalTotalTokens: 0,
      totalCostUsd: 0
    };
    return NextResponse.json(stats);
  } catch (error) {
    console.error("[PUBLIC_STATS_API] Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch public stats" }, { status: 500 });
  }
}
