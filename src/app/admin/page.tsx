import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Badge, Card, StatCard } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { isAdmin, roleLabels } from "@/lib/permissions";
import { requireCurrentUser } from "@/lib/session";

export default async function AdminPage() {
  const user = await requireCurrentUser();
  if (!isAdmin(user.role)) redirect("/dashboard");

  const [users, locations, trainingCount, orderCount] = await Promise.all([
    prisma.user.findMany({ include: { location: true }, orderBy: { email: "asc" } }),
    prisma.location.findMany({ include: { _count: { select: { employees: true, inventoryItems: true, orderRequests: true } } }, orderBy: { code: "asc" } }),
    prisma.trainingMaterial.count(),
    prisma.orderRequest.count(),
  ]);

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-clay">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">System Overview</h1>
          <p className="mt-2 text-sm text-ink/60">Owner and area manager view for users, locations, and portal modules.</p>
        </div>
        <ShieldCheck className="hidden h-8 w-8 text-moss sm:block" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Portal users" value={users.length} detail="Seeded role-based accounts" />
        <StatCard label="Locations" value={locations.length} detail="3 shops and 1 roastery" />
        <StatCard label="Training modules" value={trainingCount} detail="Library items with quizzes" />
        <StatCard label="Order requests" value={orderCount} detail="All statuses" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h2 className="text-lg font-semibold">Locations</h2>
          <div className="mt-4 grid gap-3">
            {locations.map((location) => (
              <div key={location.id} className="rounded-md border border-ink/10 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{location.code}</p>
                  <Badge>{location.type}</Badge>
                </div>
                <p className="mt-1 text-sm text-ink/55">{location.name}</p>
                <p className="mt-2 text-xs text-ink/45">
                  {location._count.employees} employees / {location._count.inventoryItems} inventory items / {location._count.orderRequests} orders
                </p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Users and Permissions</h2>
          <div className="mt-4 grid gap-2">
            {users.map((user) => (
              <div key={user.id} className="grid gap-2 rounded-md bg-cream p-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-ink/55">{user.email}</p>
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <Badge>{roleLabels[user.role]}</Badge>
                  <Badge>{user.location?.code ?? "All"}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
