import Link from "next/link";
import { CalendarDays, ClipboardCheck, GraduationCap, LayoutDashboard, Package, Settings, ShoppingCart, Trophy } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/dashboard/training", label: "Training", icon: GraduationCap },
  { href: "/dashboard/quizzes", label: "Quizzes", icon: Trophy },
  { href: "/dashboard/hr", label: "HR Docs", icon: ClipboardCheck },
  { href: "/dashboard/inventory", label: "Inventory", icon: Package },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-ink/10 bg-white px-4 py-5 lg:block">
        <Link href="/dashboard" className="block rounded-lg bg-ink px-4 py-4 text-white">
          <p className="text-lg font-semibold">602 Ops Portal</p>
          <p className="mt-1 text-xs text-white/70">Coffee retail + roastery</p>
        </Link>
        <nav className="mt-6 grid gap-1">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-mint hover:text-ink">
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-ink/10 bg-cream p-3">
          <p className="text-sm font-semibold">Prototype Mode</p>
          <p className="mt-1 text-xs text-ink/60">No login or database required</p>
          <p className="mt-3 text-xs text-ink/45">Phase 1 clickable UI</p>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-ink/10 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <Link href="/dashboard" className="font-semibold">
              602 Ops Portal
            </Link>
            <span className="text-sm font-semibold text-moss">Prototype</span>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="inline-flex shrink-0 items-center gap-2 rounded-md border border-ink/10 px-3 py-2 text-sm">
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
