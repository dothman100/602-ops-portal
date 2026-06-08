import { DocumentStatus } from "@prisma/client";
import { Badge, Card, inputClass } from "@/components/ui";
import { updateDocumentStatus } from "@/lib/actions";
import { prisma } from "@/lib/prisma";

const statusTone = {
  COMPLETE: "good",
  PENDING: "warn",
  MISSING: "danger",
} as const;

export default async function HrPage() {
  const employees = await prisma.employee.findMany({
    include: {
      location: true,
      documents: { include: { template: true }, orderBy: { template: { name: "asc" } } },
    },
    orderBy: [{ location: { code: "asc" } }, { lastName: "asc" }],
  });

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">HR Document Checklist</h1>
        <p className="mt-2 text-sm text-ink/60">Track required onboarding and compliance documents per employee.</p>
      </div>
      <div className="grid gap-4">
        {employees.map((employee) => (
          <Card key={employee.id}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">
                  {employee.firstName} {employee.lastName}
                </h2>
                <p className="text-sm text-ink/55">{employee.location.code}</p>
              </div>
              <Badge>{employee.documents.filter((doc) => doc.status === "COMPLETE").length} complete</Badge>
            </div>
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {employee.documents.map((document) => (
                <form key={document.id} action={updateDocumentStatus} className="rounded-md border border-ink/10 p-3">
                  <input type="hidden" name="id" value={document.id} />
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{document.template.name}</p>
                      <p className="mt-1 text-xs text-ink/50">{document.template.description}</p>
                    </div>
                    <Badge tone={statusTone[document.status]}>{document.status}</Badge>
                  </div>
                  <select className={inputClass} name="status" defaultValue={document.status}>
                    {Object.values(DocumentStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button className="mt-2 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white" type="submit">
                    Update
                  </button>
                </form>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
