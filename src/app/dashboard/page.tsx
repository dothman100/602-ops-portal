import Link from "next/link";
import { ArrowRight, ClipboardList, Package, Store, Users } from "lucide-react";
import { Badge, Card, StatCard } from "@/components/ui";
import { inventory, operationsGroups, orders, stats, storeProfiles, weeklyShifts } from "@/lib/sample-data";

export default function DashboardPage() {
  const lowStock = inventory.filter((item) => item.count < item.par);
  const openShifts = weeklyShifts.filter((shift) => shift.status === "Open");
  const stuckTasks = operationsGroups.flatMap((group) => group.items).filter((item) => item.status === "Stuck");

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-clay">Owner Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">602 shops and roastery command center</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">Review store health, schedule coverage, operations tasks, ordering, and training across 602 HB, 602 GW, and 602 CM.</p>
        </div>
        <Link className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-moss" href="/dashboard/operations">
          Open operations board
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <StatCard key={stat.label} {...stat} />)}</div>

      <div className="grid gap-4 xl:grid-cols-4">
        {storeProfiles.map((store) => (
          <Card key={store.code}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{store.name}</h2>
                <p className="mt-1 text-sm text-ink/55">{store.openHours}</p>
              </div>
              <Store className="h-5 w-5 text-moss" />
            </div>
            <div className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between gap-2"><span className="text-ink/55">Managers</span><span className="text-right font-semibold">{store.managers.join(", ")}</span></div>
              <div className="flex justify-between gap-2"><span className="text-ink/55">Sales/Production</span><span className="font-semibold">{store.dailySalesGoal}</span></div>
              <div className="flex justify-between gap-2"><span className="text-ink/55">Labor target</span><span className="font-semibold">{store.laborTarget}</span></div>
            </div>
          </Card>
        ))}
      </div>

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
            {weeklyShifts.slice(0, 5).map((shift) => (
              <div key={`${shift.day}-${shift.person}-${shift.time}`} className="rounded-md bg-cream p-3">
                <p className="font-semibold">{shift.person}</p>
                <p className="mt-1 text-sm text-ink/60">
                  {shift.location} / {shift.role} / {shift.day} {shift.time}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Needs Attention</h2>
              <p className="text-sm text-ink/55">Stuck work and open shifts.</p>
            </div>
            <Users className="h-5 w-5 text-clay" />
          </div>
          <div className="grid gap-3">
            {stuckTasks.map((task) => (
              <div key={task.task} className="rounded-md border border-clay/20 bg-clay/5 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{task.task}</p>
                  <Badge tone="danger">{task.priority}</Badge>
                </div>
                <p className="mt-1 text-sm text-ink/60">{task.location} / {task.owner} / Due {task.due}</p>
              </div>
            ))}
            {openShifts.map((shift) => (
              <div key={`${shift.location}-${shift.day}-${shift.time}`} className="rounded-md border border-oat bg-cream p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{shift.location} open {shift.role}</p>
                  <Badge tone="warn">{shift.day}</Badge>
                </div>
                <p className="mt-1 text-sm text-ink/60">{shift.time} / {shift.station}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Operations Snapshot</h2>
              <p className="text-sm text-ink/55">monday-style board groups.</p>
            </div>
            <ClipboardList className="h-5 w-5 text-moss" />
          </div>
          <div className="grid gap-3">
            {operationsGroups.map((group) => (
              <div key={group.title} className="rounded-md border border-ink/10 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{group.title}</p>
                  <Badge tone={group.color as "neutral" | "good" | "warn" | "danger"}>{group.items.length} items</Badge>
                </div>
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
