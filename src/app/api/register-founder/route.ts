import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import FounderProfile, { IFounderProfile } from "@/models/FounderProfile";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const walletAddress = body.walletAddress || body.address;
    const email = body.email;
    const result = body.result || body.geminiEvaluation;
    const isQualified = body.isQualified;
    const totalGrade = body.totalGrade;
    const narrative = body.narrative;
    const notificationsConfirmed = body.notificationsConfirmed;

    if (!walletAddress) {
      return NextResponse.json({ error: "Missing wallet address" }, { status: 400 });
    }

    await dbConnect();
    const normalizedAddress = walletAddress.toLowerCase();

    const updateFields: Partial<IFounderProfile> = {
      _id: normalizedAddress,
    };

    if (email !== undefined) updateFields.email = email ? email.toLowerCase().trim() : undefined;
    if (narrative !== undefined) updateFields.narrative = narrative || undefined;
    if (result !== undefined) updateFields.geminiEvaluation = result || undefined;
    if (isQualified !== undefined) updateFields.isQualified = !!isQualified;
    if (totalGrade !== undefined) updateFields.totalGrade = totalGrade;
    if (notificationsConfirmed !== undefined) updateFields.notificationsConfirmed = !!notificationsConfirmed;

    const profile = await FounderProfile.findByIdAndUpdate(
      normalizedAddress,
      updateFields,
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Register founder API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
