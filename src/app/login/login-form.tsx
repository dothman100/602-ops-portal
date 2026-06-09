import { LogIn } from "lucide-react";
import { buttonClass, inputClass } from "@/components/ui";
import { login } from "@/lib/session";

export function LoginForm({ error }: { error?: string }) {
  return (
    <form action={login} className="grid gap-4">
      <label className="grid gap-1.5 text-sm font-medium text-ink/75">
        Email
        <input className={inputClass} name="email" type="email" defaultValue="owner@602ops.com" required />
      </label>
      <label className="grid gap-1.5 text-sm font-medium text-ink/75">
        Password
        <input className={inputClass} name="password" type="password" defaultValue="Password123!" required />
      </label>
      {error === "1" ? <p className="rounded-md bg-clay/10 px-3 py-2 text-sm font-medium text-clay">That email or password did not match an active account.</p> : null}
      {error === "server" ? <p className="rounded-md bg-clay/10 px-3 py-2 text-sm font-medium text-clay">The server could not reach the database. Check Render environment variables and logs.</p> : null}
      <button className={buttonClass} type="submit">
        <LogIn className="h-4 w-4" />
        Sign in
      </button>
    </form>
  );
}
