"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { Eye, LogIn } from "lucide-react";
import { buttonClass, inputClass } from "@/components/ui";

export function LoginForm() {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError("");
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          const result = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
            callbackUrl: "/dashboard",
          });
          if (result?.error) {
            setError("That email or password did not match an active account.");
            return;
          }
          window.location.href = result?.url ?? "/dashboard";
        });
      }}
    >
      <label className="grid gap-1.5 text-sm font-medium text-ink/75">
        Email
        <input className={inputClass} name="email" type="email" defaultValue="owner@602ops.com" required />
      </label>
      <label className="grid gap-1.5 text-sm font-medium text-ink/75">
        Password
        <span className="relative">
          <input className={`${inputClass} pr-11`} name="password" type={showPassword ? "text" : "password"} defaultValue="Password123!" required />
          <button className="absolute right-2 top-1/2 rounded p-1 text-ink/50 transition hover:bg-ink/5 hover:text-ink" type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Show password">
            <Eye className="h-4 w-4" />
          </button>
        </span>
      </label>
      {error ? <p className="rounded-md bg-clay/10 px-3 py-2 text-sm font-medium text-clay">{error}</p> : null}
      <button className={buttonClass} type="submit" disabled={isPending}>
        <LogIn className="h-4 w-4" />
        {isPending ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
