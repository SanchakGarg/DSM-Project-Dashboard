import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Child Malnutrition in India — DSM 2026",
  description:
    "Interactive dashboard exploring district-level child malnutrition patterns across India using NFHS-4 and NFHS-5 data.",
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/explorer", label: "Explorer" },
  { href: "/blog", label: "Blog" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 font-sans antialiased">
        <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <Link
              href="/"
              className="text-sm font-semibold tracking-tight text-zinc-900"
            >
              Child Malnutrition India
            </Link>
            <nav className="flex gap-6">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-zinc-400">
            DSM Spring 2026 &mdash; Ashoka University &middot; Data: NFHS-4
            &amp; NFHS-5, JJM, HMIS
          </div>
        </footer>
      </body>
    </html>
  );
}
