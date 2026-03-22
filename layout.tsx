import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { WalletButton } from "@/components/WalletButton";

export const metadata: Metadata = {
  title: "EscrowAgent",
  description: "Minimal escrow demo for hackathons"
};

const navItems = [
  { href: "/create-task", label: "Create Task" },
  { href: "/fund-task", label: "Fund Task" },
  { href: "/submit-work", label: "Submit Work" },
  { href: "/approve-release", label: "Approve Release" },
  { href: "/task-details", label: "Task Details" }
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6">
          <header className="mb-10 rounded-[2rem] border border-ink/10 bg-white/70 p-5 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <Link href="/" className="text-2xl font-black uppercase tracking-[0.18em] text-pine">
                  EscrowAgent
                </Link>
                <p className="mt-2 max-w-2xl text-sm text-ink/70">
                  A demo-ready escrow flow: create a task, lock funds, submit proof, release payment.
                </p>
              </div>
              <WalletButton />
            </div>
            <nav className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm font-semibold hover:-translate-y-0.5 hover:border-ember"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
