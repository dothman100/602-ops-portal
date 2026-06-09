import { Role } from "@prisma/client";
import { Badge, Card, Field, buttonClass, inputClass } from "@/components/ui";
import { createEmployee } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { canAccessLocation, canManageEmployees, roleLabels } from "@/lib/permissions";
import { requireCurrentUser } from "@/lib/session";

export default async function EmployeesPage() {
  const user = await requireCurrentUser();
  const [employees, locations] = await Promise.all([
    prisma.employee.findMany({ include: { location: true }, orderBy: [{ location: { code: "asc" } }, { lastName: "asc" }] }),
    prisma.location.findMany({ orderBy: { code: "asc" } }),
  ]);
  const canManage = canManageEmployees(user.role);
  const availableLocations = locations.filter((location) => canAccessLocation(user.role, user.locationId, location.id));

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <section>
        <div className="mb-4">
          <h1 className="text-3xl font-semibold tracking-normal">Employee Profiles</h1>
          <p className="mt-2 text-sm text-ink/60">Manage team records, roles, status, location assignment, and contact details.</p>
        </div>
        <div className="grid gap-3">
          {employees.map((employee) => (
            <Card key={employee.id} className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold">
                    {employee.firstName} {employee.lastName}
                  </h2>
                  <Badge tone={employee.status === "ACTIVE" ? "good" : "warn"}>{employee.status.replace("_", " ")}</Badge>
                </div>
                <p className="mt-1 text-sm text-ink/60">{employee.title}</p>
                <p className="mt-1 text-sm text-ink/55">{employee.email}</p>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <Badge>{employee.location.code}</Badge>
                <Badge>{roleLabels[employee.role]}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Card>
        <h2 className="text-lg font-semibold">Add Employee</h2>
        <p className="mt-1 text-sm text-ink/55">New users receive the demo password until a reset flow is added.</p>
        <form action={createEmployee} className="mt-4 grid gap-3">
          <Field label="First name">
            <input className={inputClass} name="firstName" required disabled={!canManage} />
          </Field>
          <Field label="Last name">
            <input className={inputClass} name="lastName" required disabled={!canManage} />
          </Field>
          <Field label="Email">
            <input className={inputClass} name="email" type="email" required disabled={!canManage} />
          </Field>
          <Field label="Phone">
            <input className={inputClass} name="phone" disabled={!canManage} />
          </Field>
          <Field label="Title">
            <input className={inputClass} name="title" defaultValue="Barista" required disabled={!canManage} />
          </Field>
          <Field label="Hire date">
            <input className={inputClass} name="hireDate" type="date" required disabled={!canManage} />
          </Field>
          <Field label="Role">
            <select className={inputClass} name="role" disabled={!canManage}>
              {Object.values(Role).map((role) => (
                <option key={role} value={role}>
                  {roleLabels[role]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Location">
            <select className={inputClass} name="locationId" disabled={!canManage}>
              {availableLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.code} - {location.name}
                </option>
              ))}
            </select>
          </Field>
          <button className={buttonClass} disabled={!canManage} type="submit">
            Create profile
          </button>
        </form>
      </Card>
    </div>
  );
}
