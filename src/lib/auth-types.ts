export type Permission = "dashboard" | "operations" | "schedule" | "training" | "quizzes" | "hr" | "inventory" | "orders" | "employees" | "settings";

export type AccountRole = "Owner" | "Area Manager" | "Store Manager" | "Shift Lead" | "Staff";

export type AccountLocation = "All" | "602 HB" | "602 GW" | "602 CM" | "Roastery";

export type Account = {
  id: string;
  name: string;
  email: string;
  role: AccountRole;
  location: AccountLocation;
  permissions: Permission[];
};

export type AccountWithPassword = Account & {
  passwordHash: string;
};

export const allPermissions: Permission[] = ["dashboard", "operations", "schedule", "training", "quizzes", "hr", "inventory", "orders", "employees", "settings"];

export const permissionLabels: Record<Permission, string> = {
  dashboard: "Dashboard",
  operations: "Operations Board",
  schedule: "Schedule",
  training: "Training Materials",
  quizzes: "Quizzes",
  hr: "HR Records",
  inventory: "Inventory",
  orders: "Ordering",
  employees: "Employee Accounts",
  settings: "Settings",
};

export const roleDefaults: Record<AccountRole, Permission[]> = {
  Owner: allPermissions,
  "Area Manager": allPermissions,
  "Store Manager": ["dashboard", "operations", "schedule", "training", "quizzes", "hr", "inventory", "orders"],
  "Shift Lead": ["dashboard", "operations", "schedule", "training", "quizzes", "inventory", "orders"],
  Staff: ["dashboard", "schedule", "training", "quizzes"],
};

export function publicAccount(account: AccountWithPassword): Account {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    location: account.location,
    permissions: account.permissions,
  };
}
