import { prisma } from "@/lib/prisma";
import { Card, Badge } from "@/components/ui";
import { formatTime } from "@/lib/utils";

export default async function SchedulePage() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const shifts = await prisma.scheduleShift.findMany({
    where: { startsAt: { gte: start, lte: end } },
    include: { employee: true, location: true },
    orderBy: { startsAt: "asc" },
  });

  const days = Array.from({ length: end.getDate() }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth(), index + 1);
    return {
      date,
      shifts: shifts.filter((shift) => shift.startsAt.getDate() === date.getDate()),
    };
  });

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">Monthly Schedule</h1>
        <p className="mt-2 text-sm text-ink/60">Current month coverage across all locations.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {days.map((day) => (
          <Card key={day.date.toISOString()} className="min-h-40 p-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-semibold">{day.date.getDate()}</p>
              <p className="text-xs text-ink/45">{day.date.toLocaleDateString("en-US", { weekday: "short" })}</p>
            </div>
            <div className="grid gap-2">
              {day.shifts.map((shift) => (
                <div key={shift.id} className="rounded-md bg-cream p-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">
                      {shift.employee.firstName} {shift.employee.lastName[0]}.
                    </span>
                    <Badge>{shift.location.code}</Badge>
                  </div>
                  <p className="mt-1 text-ink/55">
                    {formatTime(shift.startsAt)} - {formatTime(shift.endsAt)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
