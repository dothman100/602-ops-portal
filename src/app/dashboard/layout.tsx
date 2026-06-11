import { AppShell } from "@/components/app-shell";
import { getCurrentAccount } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const account = await getCurrentAccount();
  if (!account) redirect("/login");

  return <AppShell>{children}</AppShell>;
}
