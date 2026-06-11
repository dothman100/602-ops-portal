import { NextResponse } from "next/server";
import { createAccount, listAccounts } from "@/lib/server-auth";

export async function GET() {
  try {
    return NextResponse.json({ accounts: await listAccounts() });
  } catch (error) {
    if (error instanceof Response) return error;
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    return NextResponse.json({ account: await createAccount(await request.json()) });
  } catch (error) {
    if (error instanceof Response) return error;
    throw error;
  }
}
