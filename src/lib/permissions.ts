import { Role } from "@prisma/client";

export const roleLabels: Record<Role, string> = {
  OWNER: "Owner",
  AREA_MANAGER: "Area Manager",
  STORE_MANAGER: "Store Manager",
  SHIFT_LEAD: "Shift Lead",
  STAFF: "Staff",
};

const roleRank: Record<Role, number> = {
  OWNER: 5,
  AREA_MANAGER: 4,
  STORE_MANAGER: 3,
  SHIFT_LEAD: 2,
  STAFF: 1,
};

export function canManageEmployees(role?: Role | null) {
  return Boolean(role && roleRank[role] >= roleRank.STORE_MANAGER);
}

export function canManageInventory(role?: Role | null) {
  return Boolean(role && roleRank[role] >= roleRank.SHIFT_LEAD);
}

export function canApproveOrders(role?: Role | null) {
  return Boolean(role && roleRank[role] >= roleRank.STORE_MANAGER);
}

export function isAdmin(role?: Role | null) {
  return role === "OWNER" || role === "AREA_MANAGER";
}

export function canAccessLocation(userRole?: Role | null, userLocationId?: string | null, targetLocationId?: string | null) {
  if (!userRole || !targetLocationId) return false;
  if (userRole === "OWNER" || userRole === "AREA_MANAGER") return true;
  return userLocationId === targetLocationId;
}
