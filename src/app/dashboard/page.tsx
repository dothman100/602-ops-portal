import Link from "next/link";
import { ArrowRight, ClipboardList, Package, Users } from "lucide-react";
import { Badge, Card, StatCard } from "@/components/ui";
import { inventory, orders, shifts, stats } from "@/lib/sample-data";

export default function DashboardPage() {
  const lowStock = inventory.filter((item) => item.count < item.par);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-clay">Manager Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">Today across the shops</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">A single view of staffing, training readiness, HR compliance, inventory health, and ordering needs.</p>
        </div>
        <Link className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-moss" href="/dashboard/orders">
          Review orders
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <StatCard key={stat.label} {...stat} />)}</div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Inventory Watchlist</h2>
              <p className="text-sm text-ink/55">Items currently below par.</p>
            </div>
            <Package className="h-5 w-5 text-clay" />
          </div>
          <div className="grid gap-3">
            {lowStock.map((item) => (
              <div key={item.item} className="grid gap-3 rounded-md border border-ink/10 p-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="font-semibold">{item.item}</p>
                  <p className="text-sm text-ink/55">
                    {item.location}
                  </p>
                </div>
                <Badge tone="danger">
                  {item.count} / {item.par} {item.unit}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Upcoming Shifts</h2>
              <p className="text-sm text-ink/55">Next scheduled coverage.</p>
            </div>
            <Users className="h-5 w-5 text-moss" />
          </div>
          <div className="grid gap-3">
            {shifts.slice(0, 4).map((shift) => (
              <div key={`${shift.day}-${shift.person}`} className="rounded-md bg-cream p-3">
                <p className="font-semibold">{shift.person}</p>
                <p className="mt-1 text-sm text-ink/60">
                  {shift.location} / {shift.role} / {shift.day} {shift.time}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Recent Order Requests</h2>
            <p className="text-sm text-ink/55">Sample ordering workflow preview.</p>
          </div>
          <ClipboardList className="h-5 w-5 text-moss" />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {orders.map((order) => (
            <div key={order.request} className="rounded-md border border-ink/10 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold">{order.request}</p>
                <Badge>{order.status}</Badge>
              </div>
              <p className="mt-2 text-sm text-ink/60">{order.location} / {order.item}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
