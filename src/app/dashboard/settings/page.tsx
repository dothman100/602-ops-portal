import { Settings } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { locations } from "@/lib/sample-data";

export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">Settings</h1>
          <p className="mt-2 text-sm text-ink/60">Placeholder settings for locations, modules, and future integrations.</p>
        </div>
        <Settings className="hidden h-8 w-8 text-moss sm:block" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Locations</h2>
          <div className="mt-4 grid gap-3">
            {locations.map((location) => (
              <div key={location} className="flex items-center justify-between rounded-md bg-cream p-3">
                <span className="font-semibold">{location}</span>
                <Badge tone="good">Active</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Future Integrations</h2>
          <div className="mt-4 grid gap-3">
            {["POS sales data", "Payroll", "Vendor ordering", "Email alerts"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-md border border-ink/10 p-3">
                <span className="font-semibold">{item}</span>
                <Badge>Later</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
