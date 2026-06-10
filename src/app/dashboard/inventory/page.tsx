import { PackageCheck } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { inventory } from "@/lib/sample-data";

export default function InventoryPage() {
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
        {inventory.map((item) => {
          const belowPar = item.count < item.par;
          return (
            <Card key={`${item.location}-${item.item}`} className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold">{item.item}</h2>
                  <Badge tone={belowPar ? "danger" : "good"}>{belowPar ? "Below par" : "Healthy"}</Badge>
                </div>
                <p className="mt-1 text-sm text-ink/55">
                  {item.location} / {item.category} / Par {item.par} {item.unit} / {item.vendor}
                </p>
              </div>
              <div className="grid gap-2 text-sm md:text-right">
                <div className="rounded-md bg-cream px-4 py-3 font-semibold">{item.count} {item.unit}</div>
                <Badge tone={belowPar ? "warn" : "good"}>{item.reorder}</Badge>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
