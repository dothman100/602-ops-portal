import { AlertTriangle, Clock, Users } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { scheduleCoverage, shiftRequests, weeklyShifts } from "@/lib/sample-data";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const statusTone = {
  Confirmed: "good",
  Open: "danger",
  "Trade Requested": "warn",
} as const;

export default function SchedulePage() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-clay">When I Work-style scheduling</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">Weekly Schedule</h1>
          <p className="mt-2 text-sm text-ink/60">Coverage, open shifts, time-off requests, and labor targets for 602 HB, 602 GW, 602 CM, and the Roastery.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white" type="button">Publish schedule</button>
          <button className="rounded-md border border-ink/15 px-4 py-2 text-sm font-semibold text-ink" type="button">Add shift</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {scheduleCoverage.map((store) => (
          <Card key={store.location}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{store.location}</h2>
                <p className="mt-1 text-sm text-ink/55">{store.scheduled} / {store.target} scheduled hours</p>
              </div>
              <Badge tone={store.open > 0 ? "warn" : "good"}>{store.open} open</Badge>
            </div>
            <div className="mt-4 h-2 rounded-full bg-ink/10">
              <div className="h-2 rounded-full bg-moss" style={{ width: `${Math.min(100, (store.scheduled / store.target) * 100)}%` }} />
            </div>
            <p className="mt-3 text-sm text-ink/55">Labor: <span className="font-semibold text-ink">{store.labor}</span></p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-7">
        {days.map((day) => (
          <Card key={day} className="min-h-72 p-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-semibold">{day}</p>
              <p className="text-xs text-ink/45">{weeklyShifts.find((shift) => shift.day === day)?.date ?? "Jun"}</p>
            </div>
            <div className="grid gap-2">
              {weeklyShifts.filter((shift) => shift.day === day).map((shift) => (
                <div key={`${shift.day}-${shift.person}-${shift.time}`} className="rounded-md bg-cream p-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{shift.person}</span>
                    <Badge>{shift.location}</Badge>
                  </div>
                  <p className="mt-1 text-ink/55">{shift.time}</p>
                  <p className="mt-1 text-ink/45">{shift.role} / {shift.station}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge tone={statusTone[shift.status as keyof typeof statusTone]}>{shift.status}</Badge>
                    <span className="text-ink/45">{shift.hours}h</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Requests Inbox</h2>
              <p className="text-sm text-ink/55">Time off, shift trades, and availability changes.</p>
            </div>
            <Clock className="h-5 w-5 text-moss" />
          </div>
          <div className="grid gap-3">
            {shiftRequests.map((request) => (
              <div key={`${request.employee}-${request.date}`} className="rounded-md border border-ink/10 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{request.type}: {request.employee}</p>
                    <p className="mt-1 text-sm text-ink/55">{request.location} / {request.date}</p>
                  </div>
                  <Badge tone="warn">{request.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-ink/60">{request.note}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Scheduling Rules</h2>
              <p className="text-sm text-ink/55">Prototype guardrails for future automation.</p>
            </div>
            <AlertTriangle className="h-5 w-5 text-clay" />
          </div>
          <div className="grid gap-3">
            {["Each store needs one manager or shift lead on floor at all times.", "Weekend peak needs one register, two bar, one support.", "Avoid overtime without owner approval.", "Roastery production lead must be scheduled before cafe transfers."].map((rule) => (
              <div key={rule} className="flex items-start gap-3 rounded-md bg-cream p-3 text-sm">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-moss" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
