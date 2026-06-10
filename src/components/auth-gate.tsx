"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { currentAccount, isReady } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/login";

  useEffect(() => {
    if (!isReady) return;
    if (!currentAccount && !isLogin) router.replace("/login");
    if (currentAccount && isLogin) router.replace("/dashboard");
  }, [currentAccount, isReady, isLogin, router]);

  if (!isReady) {
    return <div className="grid min-h-screen place-items-center bg-cream text-sm font-semibold text-ink/60">Loading 602 Ops Portal</div>;
  }

  if (!currentAccount && !isLogin) {
    return <div className="grid min-h-screen place-items-center bg-cream text-sm font-semibold text-ink/60">Redirecting to login</div>;
  }

  return <>{children}</>;
}
