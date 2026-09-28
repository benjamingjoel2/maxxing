import type { Metadata } from "next";
import Link from "next/link";
import { DestinationCard } from "@/components/destination-card";
import { InterestBadge } from "@/components/interest-badge";
import { rankDestinations } from "@/data/destinations";
import { parseInterests, type SearchParams } from "@/lib/plan-params";
import { INTERESTS, INTEREST_LABELS } from "@/lib/types";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Eight cities chosen for living culture, ranked by the threads you care about.",
};

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const selected = parseInterests((await searchParams).interests);
  const ranked = rankDestinations(selected);

  function hrefToggling(interest: (typeof INTERESTS)[number]): string {
    const next = selected.includes(interest)
      ? selected.filter((i) => i !== interest)
      : [...selected, interest];
    return next.length ? `/destinations?interests=${next.join(",")}` : "/destinations";
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-accent">Destinations</p>
        <h1 className="font-serif text-4xl font-semibold leading-tight text-balance sm:text-5xl">
          Where the culture is still being made.
        </h1>
        <p className="mt-4 text-ink-2">
          Pick one or more threads to reorder the list by how deep each city goes on them.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by interest">
        {INTERESTS.map((interest) => {
          const active = selected.includes(interest);
          return (
            <Link
              key={interest}
              href={hrefToggling(interest)}
              aria-pressed={active}
              className={`rounded-full transition ${
                active ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : "opacity-80 hover:opacity-100"
              }`}
            >
              <InterestBadge interest={interest} size="md" />
            </Link>
          );
        })}
        {selected.length > 0 && (
          <Link href="/destinations" className="ml-2 text-sm text-ink-2 underline-offset-4 hover:underline">
            Clear
          </Link>
        )}
      </div>

      {selected.length > 0 && (
        <p className="mt-6 text-sm text-ink-2">
          Ranked for {selected.map((i) => INTEREST_LABELS[i].toLowerCase()).join(", ")}.
        </p>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ranked.map((d) => (
          <DestinationCard key={d.slug} destination={d} />
        ))}
      </div>
    </div>
  );
}
