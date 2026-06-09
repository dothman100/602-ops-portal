"use server";

import { revalidatePath } from "next/cache";
import { Role, DocumentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { canAccessLocation, canManageEmployees, canManageInventory } from "@/lib/permissions";
import { requireCurrentUser } from "@/lib/session";

function stringValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

async function requireSession() {
  return requireCurrentUser();
}

export async function createEmployee(formData: FormData) {
  const session = await requireSession();
  if (!canManageEmployees(session.role)) throw new Error("You do not have permission to manage employees.");

  const locationId = stringValue(formData, "locationId");
  if (!canAccessLocation(session.role, session.locationId, locationId)) throw new Error("You cannot add employees to that location.");

  const firstName = stringValue(formData, "firstName");
  const lastName = stringValue(formData, "lastName");
  const email = stringValue(formData, "email").toLowerCase();
  const role = stringValue(formData, "role") as Role;
  const title = stringValue(formData, "title");
  const passwordHash = await bcrypt.hash("Password123!", 12);

  const user = await prisma.user.create({
    data: {
      name: `${firstName} ${lastName}`,
      email,
      role,
      locationId,
      passwordHash,
    },
  });

  const employee = await prisma.employee.create({
    data: {
      userId: user.id,
      firstName,
      lastName,
      email,
      role,
      title,
      phone: stringValue(formData, "phone"),
      hireDate: new Date(`${stringValue(formData, "hireDate")}T12:00:00Z`),
      locationId,
    },
  });

  const templates = await prisma.hrDocumentTemplate.findMany();
  await prisma.employeeDocument.createMany({
    data: templates.map((template) => ({ employeeId: employee.id, templateId: template.id })),
  });

  revalidatePath("/dashboard/employees");
  revalidatePath("/dashboard/hr");
}

export async function updateDocumentStatus(formData: FormData) {
  const session = await requireSession();
  if (!canManageEmployees(session.role)) throw new Error("You do not have permission to update HR documents.");

  const id = stringValue(formData, "id");
  const status = stringValue(formData, "status") as DocumentStatus;
  await prisma.employeeDocument.update({
    where: { id },
    data: { status, completedAt: status === "COMPLETE" ? new Date() : null },
  });

  revalidatePath("/dashboard/hr");
}

export async function updateInventoryQuantity(formData: FormData) {
  const session = await requireSession();
  if (!canManageInventory(session.role)) throw new Error("You do not have permission to update inventory.");

  const id = stringValue(formData, "id");
  const currentQty = Number(stringValue(formData, "currentQty"));
  await prisma.inventoryItem.update({ where: { id }, data: { currentQty } });

  revalidatePath("/dashboard/inventory");
  revalidatePath("/dashboard");
}

export async function createOrderRequest(formData: FormData) {
  const session = await requireSession();
  const locationId = stringValue(formData, "locationId");
  if (!canAccessLocation(session.role, session.locationId, locationId)) throw new Error("You cannot create orders for that location.");

  const itemId = stringValue(formData, "inventoryItemId");
  const quantity = Number(stringValue(formData, "quantity"));
  const item = await prisma.inventoryItem.findUnique({ where: { id: itemId } });
  if (!item || item.locationId !== locationId) throw new Error("The requested item must belong to the selected location.");
  const count = await prisma.orderRequest.count();

  await prisma.orderRequest.create({
    data: {
      requestNo: `REQ-${1001 + count}`,
      locationId,
      requestedBy: session.name ?? session.email ?? "Unknown",
      notes: stringValue(formData, "notes"),
      lines: {
        create: [{ inventoryItemId: itemId, quantity }],
      },
    },
  });

  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");
}
