import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-start gap-6 px-4 py-24 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">404</p>
      <h1 className="font-serif text-5xl font-semibold leading-tight text-balance">
        This page has wandered off.
      </h1>
      <p className="text-ink-2">
        Not every alley leads somewhere. Head back to the destinations and pick a new one.
      </p>
      <Link
        href="/destinations"
        className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink"
      >
        Browse destinations
      </Link>
    </div>
  );
}
