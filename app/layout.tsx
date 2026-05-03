import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Providers } from "@/components/Providers";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Child Malnutrition in India",
  description:
    "Interactive dashboard exploring district-level child malnutrition patterns across India using NFHS-4 and NFHS-5 data.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/database", label: "Database" },
  { href: "/explorer", label: "Explorer" },
  { href: "/blog", label: "Blog" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans antialiased">
        <Providers>
          <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
              <Link
                href="/"
                className="text-sm font-semibold tracking-tight text-foreground"
              >
                Child Malnutrition in India
              </Link>
              <nav className="flex items-center gap-6">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                ))}
                <ThemeToggle />
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
