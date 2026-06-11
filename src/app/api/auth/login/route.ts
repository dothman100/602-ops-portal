import { NextResponse } from "next/server";
import { login } from "@/lib/server-auth";

export async function POST(request: Request) {
  const body = await request.json();
  const account = await login(String(body.email || ""), String(body.password || ""));
  if (!account) return NextResponse.json({ error: "That email or password did not match an account." }, { status: 401 });
  return NextResponse.json({ account });
}
