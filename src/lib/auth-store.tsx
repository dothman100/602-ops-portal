"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Permission = "dashboard" | "operations" | "schedule" | "training" | "quizzes" | "hr" | "inventory" | "orders" | "employees" | "settings";

export type Account = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "Owner" | "Area Manager" | "Store Manager" | "Shift Lead" | "Staff";
  location: "All" | "602 HB" | "602 GW" | "602 CM" | "Roastery";
  permissions: Permission[];
};

type AuthContextValue = {
  accounts: Account[];
  currentAccount: Account | null;
  isReady: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  createAccount: (account: Omit<Account, "id">) => void;
  updateAccount: (account: Account) => void;
  can: (permission: Permission) => boolean;
};

const allPermissions: Permission[] = ["dashboard", "operations", "schedule", "training", "quizzes", "hr", "inventory", "orders", "employees", "settings"];

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

export const roleDefaults: Record<Account["role"], Permission[]> = {
  Owner: allPermissions,
  "Area Manager": allPermissions,
  "Store Manager": ["dashboard", "operations", "schedule", "training", "quizzes", "hr", "inventory", "orders"],
  "Shift Lead": ["dashboard", "operations", "schedule", "training", "quizzes", "inventory", "orders"],
  Staff: ["dashboard", "schedule", "training", "quizzes"],
};

const starterAccounts: Account[] = [
  {
    id: "owner-dothman",
    name: "Daniel Othman",
    email: "dothman12@gmail.com",
    password: "602Admin!",
    role: "Owner",
    location: "All",
    permissions: allPermissions,
  },
  {
    id: "sample-manager",
    name: "Hannah Brooks",
    email: "hb.manager@602ops.com",
    password: "Manager123!",
    role: "Store Manager",
    location: "602 HB",
    permissions: roleDefaults["Store Manager"],
  },
  {
    id: "sample-staff",
    name: "Jules Nava",
    email: "staff@602ops.com",
    password: "Staff123!",
    role: "Staff",
    location: "602 HB",
    permissions: roleDefaults.Staff,
  },
];

const accountsKey = "602_ops_accounts";
const currentKey = "602_ops_current_account";

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeLocation(location: string): Account["location"] {
  if (location === "HB") return "602 HB";
  if (location === "GW") return "602 GW";
  if (location === "CM") return "602 CM";
  if (location === "602 HB" || location === "602 GW" || location === "602 CM" || location === "Roastery" || location === "All") return location;
  return "602 HB";
}

function normalizeAccount(account: Account): Account {
  return {
    ...account,
    location: normalizeLocation(account.location),
  };
}

function readAccounts() {
  try {
    const raw = window.localStorage.getItem(accountsKey);
    if (!raw) return starterAccounts;
    const savedAccounts = (JSON.parse(raw) as Account[]).map(normalizeAccount);
    const missingStarterAccounts = starterAccounts.filter((starter) => !savedAccounts.some((account) => account.email.toLowerCase() === starter.email.toLowerCase()));
    return [...savedAccounts, ...missingStarterAccounts];
  } catch {
    return starterAccounts;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(starterAccounts);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedAccounts = readAccounts();
    setAccounts(savedAccounts);
    window.localStorage.setItem(accountsKey, JSON.stringify(savedAccounts));
    const currentId = window.localStorage.getItem(currentKey);
    setCurrentAccount(savedAccounts.find((account) => account.id === currentId) ?? null);
    setIsReady(true);
  }, []);

  function persist(nextAccounts: Account[]) {
    setAccounts(nextAccounts);
    window.localStorage.setItem(accountsKey, JSON.stringify(nextAccounts));
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      accounts,
      currentAccount,
      isReady,
      login(email, password) {
        const account = accounts.find((item) => item.email.toLowerCase() === email.toLowerCase().trim() && item.password === password);
        if (!account) return false;
        setCurrentAccount(account);
        window.localStorage.setItem(currentKey, account.id);
        return true;
      },
      logout() {
        setCurrentAccount(null);
        window.localStorage.removeItem(currentKey);
      },
      createAccount(account) {
        const nextAccounts = [...accounts, { ...account, id: crypto.randomUUID() }];
        persist(nextAccounts);
      },
      updateAccount(account) {
        const nextAccounts = accounts.map((item) => (item.id === account.id ? account : item));
        persist(nextAccounts);
        if (currentAccount?.id === account.id) setCurrentAccount(account);
      },
      can(permission) {
        return Boolean(currentAccount?.permissions.includes(permission));
      },
    }),
    [accounts, currentAccount, isReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
