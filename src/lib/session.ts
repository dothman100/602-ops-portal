import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ensureDemoData } from "@/lib/bootstrap";

const cookieName = "ops_session";

export type CurrentUser = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  locationId: string | null;
};

function secret() {
  return process.env.AUTH_SECRET ?? "development-only-secret";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function createToken(userId: string) {
  return `${userId}.${sign(userId)}`;
}

function verifyToken(token?: string) {
  if (!token) return null;
  const [userId, signature] = token.split(".");
  if (!userId || !signature) return null;

  const expected = sign(userId);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

  return userId;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const userId = verifyToken(cookieStore.get(cookieName)?.value);
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      locationId: true,
    },
  });
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) redirect("/login?error=1");

  await ensureDemoData();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash) redirect("/login?error=1");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) redirect("/login?error=1");

  const cookieStore = await cookies();
  cookieStore.set(cookieName, createToken(user.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
  redirect("/login");
}
