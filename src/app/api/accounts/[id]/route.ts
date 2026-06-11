import { NextResponse } from "next/server";
import { updateAccount } from "@/lib/server-auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    return NextResponse.json({ account: await updateAccount(id, await request.json()) });
  } catch (error) {
    if (error instanceof Response) return error;
    throw error;
  }
}
