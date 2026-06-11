import "server-only";

import { cookies } from "next/headers";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Account, AccountRole, AccountLocation, AccountWithPassword, Permission, allPermissions, publicAccount, roleDefaults } from "@/lib/auth-types";

const sessionCookie = "six02_session";
const dataPath = process.env.AUTH_DATA_PATH || path.join(process.cwd(), ".data", "auth.json");

type Session = {
  token: string;
  accountId: string;
  createdAt: string;
};

type AuthDb = {
  accounts: AccountWithPassword[];
  sessions: Session[];
};

const roles: AccountRole[] = ["Owner", "Area Manager", "Store Manager", "Shift Lead", "Staff"];
const locations: AccountLocation[] = ["All", "602 HB", "602 GW", "602 CM", "Roastery"];

function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const saved = Buffer.from(hash, "hex");
  return saved.length === candidate.length && timingSafeEqual(saved, candidate);
}

function seedAccounts(): AccountWithPassword[] {
  const ownerPassword = process.env.OWNER_PASSWORD || "602Admin!";
  return [
    {
      id: "owner-dothman",
      name: "Danny Othman",
      email: "dothman12@gmail.com",
      passwordHash: hashPassword(ownerPassword),
      role: "Owner",
      location: "All",
      permissions: allPermissions,
    },
    {
      id: "sample-manager",
      name: "Hannah Brooks",
      email: "hb.manager@602ops.com",
      passwordHash: hashPassword("Manager123!"),
      role: "Store Manager",
      location: "602 HB",
      permissions: roleDefaults["Store Manager"],
    },
    {
      id: "sample-staff",
      name: "Jules Nava",
      email: "staff@602ops.com",
      passwordHash: hashPassword("Staff123!"),
      role: "Staff",
      location: "602 HB",
      permissions: roleDefaults.Staff,
    },
  ];
}

function normalizePermissions(value: unknown, role: AccountRole): Permission[] {
  if (!Array.isArray(value)) return roleDefaults[role];
  const allowed = value.filter((item): item is Permission => allPermissions.includes(item as Permission));
  return allowed.length ? allowed : roleDefaults[role];
}

function normalizeRole(value: unknown): AccountRole {
  return roles.includes(value as AccountRole) ? value as AccountRole : "Staff";
}

function normalizeLocation(value: unknown): AccountLocation {
  return locations.includes(value as AccountLocation) ? value as AccountLocation : "602 HB";
}

async function readDb(): Promise<AuthDb> {
  try {
    const raw = await readFile(dataPath, "utf8");
    const parsed = JSON.parse(raw) as AuthDb;
    const seededOwner = seedAccounts()[0];
    const accounts = (parsed.accounts || []).map((account) => ({
      ...account,
      name: account.email.toLowerCase() === "dothman12@gmail.com" ? "Danny Othman" : account.name,
      role: normalizeRole(account.role),
      location: normalizeLocation(account.location),
      permissions: normalizePermissions(account.permissions, normalizeRole(account.role)),
    }));
    if (!accounts.some((account) => account.email.toLowerCase() === seededOwner.email.toLowerCase())) {
      accounts.unshift(seededOwner);
    }
    return { accounts, sessions: parsed.sessions || [] };
  } catch {
    const db = { accounts: seedAccounts(), sessions: [] };
    await writeDb(db);
    return db;
  }
}

async function writeDb(db: AuthDb) {
  await mkdir(path.dirname(dataPath), { recursive: true });
  await writeFile(dataPath, JSON.stringify(db, null, 2));
}

export async function getCurrentAccount() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) return null;
  const db = await readDb();
  const session = db.sessions.find((item) => item.token === token);
  const account = session ? db.accounts.find((item) => item.id === session.accountId) : null;
  return account ? publicAccount(account) : null;
}

export async function requireAccount() {
  const account = await getCurrentAccount();
  if (!account) throw new Response("Unauthorized", { status: 401 });
  return account;
}

export async function requirePermission(permission: Permission) {
  const account = await requireAccount();
  if (!account.permissions.includes(permission)) throw new Response("Forbidden", { status: 403 });
  return account;
}

export async function login(email: string, password: string) {
  const db = await readDb();
  const account = db.accounts.find((item) => item.email.toLowerCase() === email.toLowerCase().trim());
  if (!account || !verifyPassword(password, account.passwordHash)) return null;
  const token = randomBytes(32).toString("hex");
  db.sessions = [...db.sessions.filter((item) => item.accountId !== account.id), { token, accountId: account.id, createdAt: new Date().toISOString() }];
  await writeDb(db);
  (await cookies()).set(sessionCookie, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return publicAccount(account);
}

export async function logout() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookie)?.value;
  if (token) {
    const db = await readDb();
    db.sessions = db.sessions.filter((item) => item.token !== token);
    await writeDb(db);
  }
  cookieStore.delete(sessionCookie);
}

export async function listAccounts() {
  await requirePermission("employees");
  const db = await readDb();
  return db.accounts.map(publicAccount);
}

export async function createAccount(input: Omit<Account, "id"> & { password: string }) {
  await requirePermission("employees");
  const db = await readDb();
  const email = input.email.toLowerCase().trim();
  if (db.accounts.some((account) => account.email.toLowerCase() === email)) {
    throw new Response("An account with that email already exists.", { status: 409 });
  }
  const role = normalizeRole(input.role);
  const account: AccountWithPassword = {
    id: randomBytes(12).toString("hex"),
    name: input.name.trim(),
    email,
    passwordHash: hashPassword(input.password),
    role,
    location: normalizeLocation(input.location),
    permissions: normalizePermissions(input.permissions, role),
  };
  db.accounts.push(account);
  await writeDb(db);
  return publicAccount(account);
}

export async function updateAccount(id: string, input: Partial<Account & { password: string }>) {
  await requirePermission("employees");
  const db = await readDb();
  const index = db.accounts.findIndex((account) => account.id === id);
  if (index < 0) throw new Response("Account not found.", { status: 404 });
  const existing = db.accounts[index];
  const role = normalizeRole(input.role || existing.role);
  const email = (input.email || existing.email).toLowerCase().trim();
  if (db.accounts.some((account) => account.id !== id && account.email.toLowerCase() === email)) {
    throw new Response("An account with that email already exists.", { status: 409 });
  }
  const next: AccountWithPassword = {
    ...existing,
    name: input.name?.trim() || existing.name,
    email,
    role,
    location: normalizeLocation(input.location || existing.location),
    permissions: normalizePermissions(input.permissions || existing.permissions, role),
    passwordHash: input.password ? hashPassword(input.password) : existing.passwordHash,
  };
  db.accounts[index] = next;
  await writeDb(db);
  return publicAccount(next);
}
