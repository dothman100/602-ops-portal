import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthGate } from "@/components/auth-gate";
import { AuthProvider } from "@/lib/auth-store";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "602 Ops Portal",
  description: "Operations management for coffee shops and roastery teams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AuthGate>{children}</AuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}
