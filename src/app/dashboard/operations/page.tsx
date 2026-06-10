import { AlertTriangle, CheckCircle2, CircleDot, Clock3, PauseCircle } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { operationsGroups } from "@/lib/sample-data";

const statusTone = {
  Done: "good",
  Working: "warn",
  Stuck: "danger",
  Waiting: "neutral",
  "Not Started": "neutral",
} as const;

const statusIcon = {
  Done: CheckCircle2,
  Working: Clock3,
  Stuck: AlertTriangle,
  Waiting: PauseCircle,
  "Not Started": CircleDot,
} as const;

export default function OperationsPage() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-clay">Monday-style board</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">Operations Board</h1>
        <p className="mt-2 text-sm text-ink/60">Track store tasks, launch work, maintenance, and roastery production in one board.</p>
      </div>

      <div className="grid gap-5">
        {operationsGroups.map((group) => (
          <Card key={group.title} className="overflow-hidden p-0">
            <div className="border-b border-ink/10 bg-cream px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">{group.title}</h2>
                <Badge tone={group.color as "neutral" | "good" | "warn" | "danger"}>{group.items.length} items</Badge>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-[0.12em] text-ink/45">
                    <th className="px-5 py-3 font-semibold">Task</th>
                    <th className="px-3 py-3 font-semibold">Location</th>
                    <th className="px-3 py-3 font-semibold">Owner</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold">Priority</th>
                    <th className="px-5 py-3 font-semibold">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((item) => {
                    const Icon = statusIcon[item.status as keyof typeof statusIcon];
                    return (
                      <tr key={item.task} className="border-b border-ink/5 last:border-0">
                        <td className="px-5 py-3 font-semibold">{item.task}</td>
                        <td className="px-3 py-3 text-ink/65">{item.location}</td>
                        <td className="px-3 py-3 text-ink/65">{item.owner}</td>
                        <td className="px-3 py-3">
                          <Badge tone={statusTone[item.status as keyof typeof statusTone]}>
                            <Icon className="mr-1 h-3.5 w-3.5" />
                            {item.status}
                          </Badge>
                        </td>
                        <td className="px-3 py-3"><Badge tone={item.priority === "Urgent" || item.priority === "High" ? "danger" : "neutral"}>{item.priority}</Badge></td>
                        <td className="px-5 py-3 text-ink/65">{item.due}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
