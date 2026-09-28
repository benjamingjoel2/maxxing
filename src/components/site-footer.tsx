import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-ink-2 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div className="max-w-sm">
          <p className="font-serif text-xl text-ink">Maxxing</p>
          <p className="mt-2">
            Trips built around what a place makes, plays, cooks and remembers. Not around a checklist.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/destinations" className="hover:text-ink">Destinations</Link>
          <Link href="/experiences" className="hover:text-ink">Explore</Link>
          <Link href="/plan" className="hover:text-ink">Plan a trip</Link>
          <Link href="/trips" className="hover:text-ink">My trips</Link>
        </div>
      </div>
    </footer>
  );
}
