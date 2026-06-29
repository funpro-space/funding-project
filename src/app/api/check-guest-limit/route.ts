import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import GuestIpLimit from "@/models/GuestIpLimit";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    // If wallet address is connected, guest IP/cookie limits do not apply
    if (address && address !== "undefined" && address !== "null") {
      return NextResponse.json({ limited: false });
    }

    const cookieHeader = req.headers.get("cookie") || "";
    const hasGuestCookie = cookieHeader.includes("guest_eval_limit=1");
    if (hasGuestCookie) {
      return NextResponse.json({ limited: true });
    }

    let ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (ip.includes(",")) {
      ip = ip.split(",")[0].trim();
    }

    await dbConnect();
    const now = new Date();
    const limitRecord = await GuestIpLimit.findById(ip);

    if (limitRecord && limitRecord.count >= 1 && limitRecord.resetAt > now) {
      return NextResponse.json({ limited: true });
    }

    return NextResponse.json({ limited: false });
  } catch (error) {
    console.error("[CHECK_GUEST_LIMIT] Error checking rate limit:", error);
    return NextResponse.json({ limited: false }); // Default to not limited if check fails
  }
}
