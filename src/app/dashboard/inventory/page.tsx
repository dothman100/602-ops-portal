import { PackageCheck } from "lucide-react";
import { Badge, Card, inputClass } from "@/components/ui";
import { updateInventoryQuantity } from "@/lib/actions";
import { prisma } from "@/lib/prisma";

export default async function InventoryPage() {
  const items = await prisma.inventoryItem.findMany({
    include: { location: true },
    orderBy: [{ location: { code: "asc" } }, { category: "asc" }, { name: "asc" }],
  });

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">Inventory</h1>
          <p className="mt-2 text-sm text-ink/60">Track quantities against par levels by location.</p>
        </div>
        <PackageCheck className="hidden h-8 w-8 text-moss sm:block" />
      </div>
      <div className="grid gap-3">
        {items.map((item) => {
          const belowPar = item.currentQty < item.parLevel;
          return (
            <Card key={item.id} className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <Badge tone={belowPar ? "danger" : "good"}>{belowPar ? "Below par" : "Healthy"}</Badge>
                </div>
                <p className="mt-1 text-sm text-ink/55">
                  {item.location.code} / {item.category} / Par {item.parLevel} {item.unit.toLowerCase()}
                </p>
              </div>
              <form action={updateInventoryQuantity} className="flex items-center gap-2">
                <input type="hidden" name="id" value={item.id} />
                <input className={`${inputClass} w-24`} name="currentQty" type="number" min="0" defaultValue={item.currentQty} />
                <button className="rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white" type="submit">
                  Save
                </button>
              </form>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
