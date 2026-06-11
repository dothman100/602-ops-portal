"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Account, Permission, permissionLabels, roleDefaults } from "@/lib/auth-types";

type AccountInput = Omit<Account, "id"> & { password: string };
type AccountUpdateInput = Account & { password?: string };

type AuthContextValue = {
  accounts: Account[];
  currentAccount: Account | null;
  isReady: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  createAccount: (account: AccountInput) => Promise<void>;
  updateAccount: (account: AccountUpdateInput) => Promise<void>;
  refreshAccounts: () => Promise<void>;
  can: (permission: Permission) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Request failed.");
  }
  return response.json() as Promise<T>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [isReady, setIsReady] = useState(false);

  const refreshAccounts = useCallback(async () => {
    if (!currentAccount?.permissions.includes("employees")) return;
    const data = await apiRequest<{ accounts: Account[] }>("/api/accounts");
    setAccounts(data.accounts);
  }, [currentAccount]);

  useEffect(() => {
    let mounted = true;
    apiRequest<{ account: Account | null }>("/api/session")
      .then((data) => {
        if (!mounted) return;
        setCurrentAccount(data.account);
        setIsReady(true);
      })
      .catch(() => {
        if (!mounted) return;
        setCurrentAccount(null);
        setIsReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (currentAccount?.permissions.includes("employees")) {
      refreshAccounts().catch(() => setAccounts([]));
    } else {
      setAccounts(currentAccount ? [currentAccount] : []);
    }
  }, [currentAccount, refreshAccounts]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accounts,
      currentAccount,
      isReady,
      async login(email, password) {
        try {
          const data = await apiRequest<{ account: Account }>("/api/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
          });
          setCurrentAccount(data.account);
          return true;
        } catch {
          return false;
        }
      },
      async logout() {
        await apiRequest("/api/logout", { method: "POST", body: "{}" }).catch(() => null);
        setCurrentAccount(null);
        setAccounts([]);
        window.location.href = "/login";
      },
      async createAccount(account) {
        const data = await apiRequest<{ account: Account }>("/api/accounts", {
          method: "POST",
          body: JSON.stringify(account),
        });
        setAccounts((current) => [...current, data.account]);
      },
      async updateAccount(account) {
        const data = await apiRequest<{ account: Account }>(`/api/accounts/${account.id}`, {
          method: "PUT",
          body: JSON.stringify(account),
        });
        setAccounts((current) => current.map((item) => (item.id === account.id ? data.account : item)));
        if (currentAccount?.id === account.id) setCurrentAccount(data.account);
      },
      refreshAccounts,
      can(permission) {
        return Boolean(currentAccount?.permissions.includes(permission));
      },
    }),
    [accounts, currentAccount, isReady, refreshAccounts],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

export { permissionLabels, roleDefaults };
export type { Account, Permission };
