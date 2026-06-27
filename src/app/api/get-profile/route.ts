import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import FounderProfile from "@/models/FounderProfile";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json({ error: "Missing wallet address" }, { status: 400 });
    }

    await dbConnect();
    const profile = await FounderProfile.findById(address.toLowerCase());

    console.log(`[GET_PROFILE_API] Fetching profile for address: "${address.toLowerCase()}". Found profile:`, !!profile, profile ? { chatCount: profile.chatCount, hasNarrative: !!profile.narrative, hasEvaluation: !!profile.geminiEvaluation } : null);

    if (!profile) {
      return NextResponse.json({ exists: false });
    }

    return NextResponse.json({ exists: true, profile });
  } catch (error) {
    console.error("Get profile API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
