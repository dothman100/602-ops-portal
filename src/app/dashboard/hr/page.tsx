import { Badge, Card } from "@/components/ui";
import { hrRecords } from "@/lib/sample-data";

export default function HrPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">HR Document Checklist</h1>
        <p className="mt-2 text-sm text-ink/60">Track required onboarding and compliance documents per employee.</p>
      </div>
      <div className="grid gap-4">
        {hrRecords.map((employee) => (
          <Card key={employee.employee}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{employee.employee}</h2>
                <p className="text-sm text-ink/55">{employee.location}</p>
              </div>
              <Badge tone={employee.missing === 0 ? "good" : "warn"}>{employee.complete} complete</Badge>
            </div>
            <div className="grid gap-2 md:grid-cols-5">
              {["I-9", "W-4", "Food Card", "Handbook", "Direct Deposit"].map((document, index) => (
                <div key={document} className="rounded-md border border-ink/10 p-3">
                  <p className="font-semibold">{document}</p>
                  <Badge tone={index < employee.complete ? "good" : "danger"}>{index < employee.complete ? "Complete" : "Missing"}</Badge>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
