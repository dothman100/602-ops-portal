import { redirect } from "next/navigation";
import { Card } from "@/components/ui";
import { getCurrentUser } from "@/lib/session";
import { LoginForm } from "./login-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-cream px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-clay">Operations Portal</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-normal text-ink">602 Ops Portal</h1>
          <p className="mt-3 text-sm leading-6 text-ink/65">Sign in to manage staffing, training, HR documents, inventory, and order requests across HB, GW, CM, and the Roastery.</p>
        </div>
        <Card>
          <LoginForm error={params.error} />
          <div className="mt-5 rounded-md bg-mint p-3 text-sm text-moss">
            Demo accounts include <strong>owner@602ops.com</strong>, <strong>area@602ops.com</strong>, and <strong>staff@602ops.com</strong>.
          </div>
        </Card>
      </div>
    </main>
  );
}
