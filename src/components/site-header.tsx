import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { href: "/destinations", label: "Destinations" },
  { href: "/plan", label: "Plan a trip" },
  { href: "/trips", label: "My trips" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur supports-[backdrop-filter]:bg-paper/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-serif text-2xl font-semibold tracking-tight">Maxxing</span>
          <span className="hidden text-xs uppercase tracking-[0.18em] text-ink-3 sm:inline">
            culture oriented trips
          </span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-2.5 py-1.5 text-sm text-ink-2 transition hover:bg-paper-2 hover:text-ink sm:px-3"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
