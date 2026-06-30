import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import GuestIpLimit from "@/models/GuestIpLimit";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    // If wallet address is connected, guest IP/cookie limits do not apply
    if (address && address !== "undefined" && address !== "null") {
      return NextResponse.json({ limited: false, count: 0 });
    }

    const cookieHeader = req.headers.get("cookie") || "";
    
    let cookieCount = 0;
    const countMatch = cookieHeader.match(/guest_eval_count=(\d+)/);
    if (countMatch) {
      cookieCount = parseInt(countMatch[1], 10);
    }

    const hasGuestCookie = cookieHeader.includes("guest_eval_limit=3") || cookieCount >= 3;
    if (hasGuestCookie) {
      return NextResponse.json({ limited: true, count: Math.max(3, cookieCount) });
    }

    let ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (ip.includes(",")) {
      ip = ip.split(",")[0].trim();
    }

    await dbConnect();
    const now = new Date();
    const limitRecord = await GuestIpLimit.findById(ip);

    const dbCount = (limitRecord && limitRecord.resetAt > now) ? limitRecord.count : 0;
    const finalCount = Math.max(cookieCount, dbCount);

    if (finalCount >= 3) {
      return NextResponse.json({ limited: true, count: finalCount });
    }

    return NextResponse.json({ limited: false, count: finalCount });
  } catch (error) {
    console.error("[CHECK_GUEST_LIMIT] Error checking rate limit:", error);
    return NextResponse.json({ limited: false, count: 0 }); // Default to not limited if check fails
  }
}
