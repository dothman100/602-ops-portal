import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge, Card, StatCard } from "@/components/ui";
import { formatDate, formatTime } from "@/lib/utils";

export default async function DashboardPage() {
  const [employeeCount, activeOrders, lowStock, incompleteDocs, upcomingShifts] = await Promise.all([
    prisma.employee.count({ where: { status: "ACTIVE" } }),
    prisma.orderRequest.count({ where: { status: { in: ["SUBMITTED", "APPROVED"] } } }),
    prisma.inventoryItem.findMany({
      where: { currentQty: { lt: prisma.inventoryItem.fields.parLevel } },
      include: { location: true },
      orderBy: { currentQty: "asc" },
      take: 6,
    }),
    prisma.employeeDocument.count({ where: { status: { not: "COMPLETE" } } }),
    prisma.scheduleShift.findMany({
      where: { startsAt: { gte: new Date() } },
      include: { employee: true, location: true },
      orderBy: { startsAt: "asc" },
      take: 6,
    }),
  ]);

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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active employees" value={employeeCount} detail="Across HB, GW, CM, and Roastery" />
        <StatCard label="Open order requests" value={activeOrders} detail="Submitted or approved" />
        <StatCard label="Low stock items" value={lowStock.length} detail="Below par level" />
        <StatCard label="Incomplete HR docs" value={incompleteDocs} detail="Missing or pending" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Inventory Watchlist</h2>
              <p className="text-sm text-ink/55">Items currently below par.</p>
            </div>
            <AlertTriangle className="h-5 w-5 text-clay" />
          </div>
          <div className="grid gap-3">
            {lowStock.map((item) => (
              <div key={item.id} className="grid gap-3 rounded-md border border-ink/10 p-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-ink/55">
                    {item.location.code} / {item.category}
                  </p>
                </div>
                <Badge tone="danger">
                  {item.currentQty} / {item.parLevel} {item.unit.toLowerCase()}
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
            <CheckCircle2 className="h-5 w-5 text-moss" />
          </div>
          <div className="grid gap-3">
            {upcomingShifts.map((shift) => (
              <div key={shift.id} className="rounded-md bg-cream p-3">
                <p className="font-semibold">
                  {shift.employee.firstName} {shift.employee.lastName}
                </p>
                <p className="mt-1 text-sm text-ink/60">
                  {shift.location.code} / {shift.position} / {formatDate(shift.startsAt)} {formatTime(shift.startsAt)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
