"use client";

import Link from "next/link";
import { CalendarDays, ClipboardCheck, GraduationCap, LayoutDashboard, LogOut, Package, Settings, ShoppingCart, Trophy, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth, type Permission } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, permission: "dashboard" },
  { href: "/dashboard/schedule", label: "Schedule", icon: CalendarDays, permission: "schedule" },
  { href: "/dashboard/training", label: "Training", icon: GraduationCap, permission: "training" },
  { href: "/dashboard/quizzes", label: "Quizzes", icon: Trophy, permission: "quizzes" },
  { href: "/dashboard/hr", label: "HR Docs", icon: ClipboardCheck, permission: "hr" },
  { href: "/dashboard/inventory", label: "Inventory", icon: Package, permission: "inventory" },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart, permission: "orders" },
  { href: "/dashboard/employees", label: "Employees", icon: Users, permission: "employees" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, permission: "settings" },
] satisfies Array<{ href: string; label: string; icon: React.ElementType; permission: Permission }>;

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentAccount, logout, can } = useAuth();
  const pathname = usePathname();
  const allowedNav = nav.filter((item) => can(item.permission));
  const activeNav = nav.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  const hasPageAccess = activeNav ? can(activeNav.permission) : true;

  return (
    <div className="min-h-screen bg-cream">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-ink/10 bg-white px-4 py-5 lg:block">
        <Link href="/dashboard" className="block rounded-lg bg-ink px-4 py-4 text-white">
          <p className="text-lg font-semibold">602 Ops Portal</p>
          <p className="mt-1 text-xs text-white/70">Coffee retail + roastery</p>
        </Link>
        <nav className="mt-6 grid gap-1">
          {allowedNav.map((item) => (
            <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition hover:bg-mint hover:text-ink", pathname === item.href ? "bg-mint text-ink" : "text-ink/70")}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-ink/10 bg-cream p-3">
          <p className="text-sm font-semibold">{currentAccount?.name}</p>
          <p className="mt-1 text-xs text-ink/60">{currentAccount?.role} / {currentAccount?.location}</p>
          <button className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-clay" onClick={logout} type="button">
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-ink/10 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <Link href="/dashboard" className="font-semibold">
              602 Ops Portal
            </Link>
            <button className="text-sm font-semibold text-clay" onClick={logout} type="button">Sign out</button>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {allowedNav.map((item) => (
              <Link key={item.href} href={item.href} className={cn("inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm", pathname === item.href ? "border-moss bg-mint" : "border-ink/10")}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {hasPageAccess ? (
            children
          ) : (
            <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-clay">Access limited</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-normal">This account does not have permission for this page.</h1>
              <p className="mt-2 text-sm text-ink/60">Sign in as the owner account or update this employee&apos;s permissions from Employee Accounts.</p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
