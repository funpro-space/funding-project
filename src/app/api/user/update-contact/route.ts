import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import FounderProfile, { IFounderProfile } from "@/models/FounderProfile";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const walletAddress = body.walletAddress || body.address;
    const { email, phone, notificationsConfirmed } = body;

    if (!walletAddress) {
      return NextResponse.json({ error: "Missing wallet address" }, { status: 400 });
    }

    await dbConnect();
    const normalizedAddress = walletAddress.toLowerCase();

    const updateFields: Partial<IFounderProfile> = {};
    if (email !== undefined) updateFields.email = email ? email.toLowerCase().trim() : undefined;
    if (phone !== undefined) updateFields.phone = phone ? phone.trim() : undefined;
    if (notificationsConfirmed !== undefined) updateFields.notificationsConfirmed = !!notificationsConfirmed;

    const profile = await FounderProfile.findByIdAndUpdate(
      normalizedAddress,
      { $set: updateFields },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Update contact API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
