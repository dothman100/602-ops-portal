"use client";

import { useMemo, useState } from "react";
import { Pencil, ShieldCheck, UserPlus, Users, X } from "lucide-react";
import { Badge, Card, Field, buttonClass, inputClass } from "@/components/ui";
import { locations, storeProfiles, teamMembers } from "@/lib/sample-data";
import { permissionLabels, roleDefaults, useAuth, type Account, type Permission } from "@/lib/auth-store";

const roles: Account["role"][] = ["Owner", "Area Manager", "Store Manager", "Shift Lead", "Staff"];
const allPermissionKeys = Object.keys(permissionLabels) as Permission[];

export default function EmployeesPage() {
  const { accounts, createAccount, updateAccount, can } = useAuth();
  const [role, setRole] = useState<Account["role"]>("Staff");
  const [permissions, setPermissions] = useState<Permission[]>(roleDefaults.Staff);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [editRole, setEditRole] = useState<Account["role"]>("Staff");
  const [editPermissions, setEditPermissions] = useState<Permission[]>(roleDefaults.Staff);
  const [message, setMessage] = useState("");
  const canManage = can("employees");

  const visibleAccounts = useMemo(() => accounts.filter((account) => account.role !== "Owner" || account.email === "dothman12@gmail.com"), [accounts]);

  function togglePermission(permission: Permission) {
    setPermissions((current) => (current.includes(permission) ? current.filter((item) => item !== permission) : [...current, permission]));
  }

  function startEditing(account: Account) {
    if (!canManage) return;
    setEditingAccount(account);
    setEditRole(account.role);
    setEditPermissions(account.permissions);
    setMessage("");
  }

  function toggleEditPermission(permission: Permission) {
    setEditPermissions((current) => (current.includes(permission) ? current.filter((item) => item !== permission) : [...current, permission]));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <section>
        <div className="mb-4">
          <h1 className="text-3xl font-semibold tracking-normal">Employee Accounts</h1>
          <p className="mt-2 text-sm text-ink/60">Create prototype accounts, review store teams, and decide which areas each person can see.</p>
        </div>
        <div className="mb-6 grid gap-4 lg:grid-cols-3">
          {storeProfiles.filter((store) => store.code !== "Roastery").map((store) => (
            <Card key={store.code}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{store.code}</h2>
                  <p className="mt-1 text-sm text-ink/55">Managers: {store.managers.join(" / ")}</p>
                </div>
                <Users className="h-5 w-5 text-moss" />
              </div>
              <div className="mt-4 grid gap-2">
                {teamMembers.filter((member) => member.location === store.code).map((member) => (
                  <div key={member.name} className="rounded-md bg-cream p-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{member.name}</span>
                      <Badge>{member.role}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-ink/50">Training {member.training}% / {member.availability}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
        <div className="grid gap-3">
          {visibleAccounts.map((account) => (
            <button key={account.id} className="block text-left" disabled={!canManage} onClick={() => startEditing(account)} type="button">
              <Card className={editingAccount?.id === account.id ? "border-moss ring-2 ring-moss/20" : "transition hover:border-moss/50"}>
              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{account.name}</h2>
                    <Badge tone={account.role === "Owner" ? "good" : "neutral"}>{account.role}</Badge>
                    <Badge>{account.location}</Badge>
                    <Badge tone="warn"><Pencil className="mr-1 h-3 w-3" /> Click to edit</Badge>
                  </div>
                  <p className="mt-1 text-sm text-ink/55">{account.email}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {account.permissions.map((permission) => (
                      <Badge key={permission} tone="good">{permissionLabels[permission]}</Badge>
                    ))}
                  </div>
                </div>
                <div className="rounded-md bg-cream p-3 text-xs text-ink/55">
                  Prototype password: <span className="font-semibold text-ink">{account.password}</span>
                </div>
              </div>
              </Card>
            </button>
          ))}
        </div>
      </section>

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{editingAccount ? "Edit Account" : "Create Account"}</h2>
            <p className="mt-1 text-sm text-ink/55">{editingAccount ? "Update account details and page permissions." : "Saved in this browser for prototype testing."}</p>
          </div>
          {editingAccount ? (
            <button className="rounded-md p-1 text-ink/50 transition hover:bg-ink/5 hover:text-ink" onClick={() => setEditingAccount(null)} type="button" aria-label="Close editor">
              <X className="h-5 w-5" />
            </button>
          ) : (
            <UserPlus className="h-5 w-5 text-moss" />
          )}
        </div>

        {editingAccount ? (
          <form
            key={editingAccount.id}
            className="mt-4 grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (!canManage || !editingAccount) return;
              const formData = new FormData(event.currentTarget);
              const updatedAccount = {
                ...editingAccount,
                name: String(formData.get("name")),
                email: String(formData.get("email")),
                password: String(formData.get("password")),
                role: editRole,
                location: String(formData.get("location")) as Account["location"],
                permissions: editPermissions,
              };
              updateAccount(updatedAccount);
              setEditingAccount(updatedAccount);
              setMessage("Account updated.");
            }}
          >
            <Field label="Name">
              <input className={inputClass} name="name" defaultValue={editingAccount.name} required disabled={!canManage} />
            </Field>
            <Field label="Email">
              <input className={inputClass} name="email" type="email" defaultValue={editingAccount.email} required disabled={!canManage} />
            </Field>
            <Field label="Password">
              <input className={inputClass} name="password" defaultValue={editingAccount.password} required disabled={!canManage} />
            </Field>
            <Field label="Role">
              <select
                className={inputClass}
                value={editRole}
                onChange={(event) => {
                  const nextRole = event.target.value as Account["role"];
                  setEditRole(nextRole);
                  setEditPermissions(roleDefaults[nextRole]);
                }}
                disabled={!canManage}
              >
                {roles.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </Field>
            <Field label="Location">
              <select className={inputClass} name="location" defaultValue={editingAccount.location} disabled={!canManage}>
                {["All", ...locations].map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </Field>
            <div className="rounded-md border border-ink/10 p-3">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-moss" />
                <p className="text-sm font-semibold">Permissions</p>
              </div>
              <div className="grid gap-2">
                {allPermissionKeys.map((permission) => (
                  <label key={permission} className="flex items-center gap-2 text-sm text-ink/75">
                    <input checked={editPermissions.includes(permission)} disabled={!canManage} onChange={() => toggleEditPermission(permission)} type="checkbox" />
                    {permissionLabels[permission]}
                  </label>
                ))}
              </div>
            </div>
            {message ? <p className="rounded-md bg-mint px-3 py-2 text-sm font-semibold text-moss">{message}</p> : null}
            <button className={buttonClass} disabled={!canManage} type="submit">Save changes</button>
          </form>
        ) : (
          <form
            className="mt-4 grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (!canManage) return;
              const formData = new FormData(event.currentTarget);
              createAccount({
                name: String(formData.get("name")),
                email: String(formData.get("email")),
                password: String(formData.get("password")),
                role,
                location: String(formData.get("location")) as Account["location"],
                permissions,
              });
              event.currentTarget.reset();
              setRole("Staff");
              setPermissions(roleDefaults.Staff);
              setMessage("Account created.");
            }}
          >
          <Field label="Name">
            <input className={inputClass} name="name" placeholder="Alex Rivera" required disabled={!canManage} />
          </Field>
          <Field label="Email">
            <input className={inputClass} name="email" type="email" placeholder="alex@602ops.com" required disabled={!canManage} />
          </Field>
          <Field label="Temporary password">
            <input className={inputClass} name="password" defaultValue="Welcome602!" required disabled={!canManage} />
          </Field>
          <Field label="Role">
            <select
              className={inputClass}
              value={role}
              onChange={(event) => {
                const nextRole = event.target.value as Account["role"];
                setRole(nextRole);
                setPermissions(roleDefaults[nextRole]);
              }}
              disabled={!canManage}
            >
              {roles.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </Field>
          <Field label="Location">
            <select className={inputClass} name="location" disabled={!canManage}>
              {["All", ...locations].map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </Field>
          <div className="rounded-md border border-ink/10 p-3">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-moss" />
              <p className="text-sm font-semibold">Permissions</p>
            </div>
            <div className="grid gap-2">
              {allPermissionKeys.map((permission) => (
                <label key={permission} className="flex items-center gap-2 text-sm text-ink/75">
                  <input checked={permissions.includes(permission)} disabled={!canManage} onChange={() => togglePermission(permission)} type="checkbox" />
                  {permissionLabels[permission]}
                </label>
              ))}
            </div>
          </div>
          {message ? <p className="rounded-md bg-mint px-3 py-2 text-sm font-semibold text-moss">{message}</p> : null}
          <button className={buttonClass} disabled={!canManage} type="submit">Create account</button>
          </form>
        )}
      </Card>
    </div>
  );
}
