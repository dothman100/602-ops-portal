import { ShoppingCart } from "lucide-react";
import { Badge, Card, Field, buttonClass, inputClass } from "@/components/ui";
import { inventory, locations, orders } from "@/lib/sample-data";
import { formatDate } from "@/lib/utils";

const statusTone = {
  DRAFT: "neutral",
  SUBMITTED: "warn",
  APPROVED: "good",
  FULFILLED: "good",
  REJECTED: "danger",
} as const;

type OrderStatus = keyof typeof statusTone;

export default function OrdersPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <section>
        <div className="mb-4">
          <h1 className="text-3xl font-semibold tracking-normal">Order Requests</h1>
          <p className="mt-2 text-sm text-ink/60">Submit and review supply requests for shops and the roastery.</p>
        </div>
        <div className="grid gap-3">
          {orders.map((order) => (
            <Card key={order.request}>
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{order.request}</h2>
                    <Badge tone={statusTone[order.status as OrderStatus]}>{order.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-ink/55">
                    {order.location} / Requested by {order.owner} / {formatDate(new Date())}
                  </p>
                </div>
                <ShoppingCart className="h-5 w-5 text-moss" />
              </div>
              <div className="rounded-md bg-cream px-3 py-2 text-sm">
                <span>{order.item} / Needed {order.needed} / {order.source}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Card>
        <h2 className="text-lg font-semibold">New Request</h2>
        <p className="mt-1 text-sm text-ink/55">Create a submitted order request for manager review.</p>
        <form className="mt-4 grid gap-3">
          <Field label="Location">
            <select className={inputClass} name="locationId">
              {locations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </Field>
          <Field label="Item">
            <select className={inputClass} name="inventoryItemId">
              {inventory.map((item) => (
                <option key={`${item.location}-${item.item}`} value={item.item}>
                  {item.location} - {item.item}
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
            Preview request
          </button>
        </form>
        <div className="mt-4 text-xs text-ink/45">Prototype only. This form does not save yet.</div>
      </Card>
    </div>
  );
}
