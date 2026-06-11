import { NextResponse } from "next/server";
import { getCurrentAccount } from "@/lib/server-auth";

export async function GET() {
  return NextResponse.json({ account: await getCurrentAccount() });
}
