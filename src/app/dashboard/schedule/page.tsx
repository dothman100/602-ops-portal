import { Card, Badge } from "@/components/ui";
import { shifts } from "@/lib/sample-data";

export default function SchedulePage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">Monthly Schedule</h1>
        <p className="mt-2 text-sm text-ink/60">Current month coverage across all locations.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
          <Card key={day} className="min-h-40 p-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-semibold">{day}</p>
              <p className="text-xs text-ink/45">Prototype week</p>
            </div>
            <div className="grid gap-2">
              {shifts.filter((shift) => shift.day === day).map((shift) => (
                <div key={`${shift.day}-${shift.person}`} className="rounded-md bg-cream p-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{shift.person}</span>
                    <Badge>{shift.location}</Badge>
                  </div>
                  <p className="mt-1 text-ink/55">{shift.time}</p>
                  <p className="mt-1 text-ink/45">{shift.role}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
