"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { Card, buttonClass, inputClass } from "@/components/ui";

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState("");

  return (
    <main className="grid min-h-screen place-items-center bg-cream px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-clay">602 Ops Portal</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-normal text-ink">Operations portal</h1>
          <p className="mt-3 text-sm leading-6 text-ink/65">Sign in with your owner account, then create employee accounts and choose permissions.</p>
        </div>
        <Card>
          <form
            className="grid gap-4"
            onSubmit={async (event) => {
              event.preventDefault();
              setError("");
              const formData = new FormData(event.currentTarget);
              const success = await login(String(formData.get("email")), String(formData.get("password")));
              if (!success) {
                setError("That email or password did not match an account.");
                return;
              }
              window.location.href = "/dashboard";
            }}
          >
            <label className="grid gap-1.5 text-sm font-medium text-ink/75">
              Email
              <input className={inputClass} name="email" type="email" required />
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-ink/75">
              Password
              <input className={inputClass} name="password" type="password" required />
            </label>
            {error ? <p className="rounded-md bg-clay/10 px-3 py-2 text-sm font-medium text-clay">{error}</p> : null}
            <button className={buttonClass} type="submit">
              <LogIn className="h-4 w-4" />
              Sign in
            </button>
          </form>
        </Card>
      </div>
    </main>
  );
}
