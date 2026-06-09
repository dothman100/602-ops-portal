import { OrderStatus } from "@prisma/client";
import { ShoppingCart } from "lucide-react";
import { Badge, Card, Field, buttonClass, inputClass } from "@/components/ui";
import { createOrderRequest } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { canAccessLocation } from "@/lib/permissions";
import { requireCurrentUser } from "@/lib/session";
import { formatDate } from "@/lib/utils";

const statusTone = {
  DRAFT: "neutral",
  SUBMITTED: "warn",
  APPROVED: "good",
  FULFILLED: "good",
  REJECTED: "danger",
} as const;

export default async function OrdersPage() {
  const user = await requireCurrentUser();
  const [orders, locations, items] = await Promise.all([
    prisma.orderRequest.findMany({
      include: { location: true, lines: { include: { inventoryItem: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.location.findMany({ orderBy: { code: "asc" } }),
    prisma.inventoryItem.findMany({ include: { location: true }, orderBy: [{ location: { code: "asc" } }, { name: "asc" }] }),
  ]);
  const availableLocations = locations.filter((location) => canAccessLocation(user.role, user.locationId, location.id));
  const availableLocationIds = new Set(availableLocations.map((location) => location.id));
  const availableItems = items.filter((item) => availableLocationIds.has(item.locationId));

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <section>
        <div className="mb-4">
          <h1 className="text-3xl font-semibold tracking-normal">Order Requests</h1>
          <p className="mt-2 text-sm text-ink/60">Submit and review supply requests for shops and the roastery.</p>
        </div>
        <div className="grid gap-3">
          {orders.map((order) => (
            <Card key={order.id}>
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{order.requestNo}</h2>
                    <Badge tone={statusTone[order.status]}>{order.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-ink/55">
                    {order.location.code} / Requested by {order.requestedBy} / {formatDate(order.createdAt)}
                  </p>
                </div>
                <ShoppingCart className="h-5 w-5 text-moss" />
              </div>
              <div className="grid gap-2">
                {order.lines.map((line) => (
                  <div key={line.id} className="flex items-center justify-between rounded-md bg-cream px-3 py-2 text-sm">
                    <span>{line.inventoryItem.name}</span>
                    <span className="font-semibold">
                      {line.quantity} {line.inventoryItem.unit.toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
              {order.notes ? <p className="mt-3 text-sm text-ink/60">{order.notes}</p> : null}
            </Card>
          ))}
        </div>
      </section>

      <Card>
        <h2 className="text-lg font-semibold">New Request</h2>
        <p className="mt-1 text-sm text-ink/55">Create a submitted order request for manager review.</p>
        <form action={createOrderRequest} className="mt-4 grid gap-3">
          <Field label="Location">
            <select className={inputClass} name="locationId">
              {availableLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.code} - {location.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Item">
            <select className={inputClass} name="inventoryItemId">
              {availableItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.location.code} - {item.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Quantity">
            <input className={inputClass} name="quantity" type="number" min="1" defaultValue="1" required />
          </Field>
          <Field label="Notes">
            <textarea className={inputClass} name="notes" rows={4} />
          </Field>
          <button className={buttonClass} type="submit">
            Submit request
          </button>
        </form>
        <div className="mt-4 text-xs text-ink/45">Statuses supported: {Object.values(OrderStatus).join(", ")}</div>
      </Card>
    </div>
  );
}
