"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DestinationCard } from "@/components/destination-card";
import { InterestBadge } from "@/components/interest-badge";
import { rankDestinations } from "@/data/destinations";
import { parseInterests } from "@/lib/plan-params";
import { INTERESTS, INTEREST_LABELS, type Interest } from "@/lib/types";

/** The catalogue body, ranked by the interests in the query string. */
export function DestinationsCatalog({ selected }: { selected: Interest[] }) {
  const ranked = rankDestinations(selected);

  function hrefToggling(interest: Interest): string {
    const next = selected.includes(interest)
      ? selected.filter((i) => i !== interest)
      : [...selected, interest];
    return next.length ? `/destinations?interests=${next.join(",")}` : "/destinations";
  }

  return (
    <>
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
    </>
  );
}

/** Reads the query string on the client; must sit inside a Suspense boundary. */
export function DestinationsCatalogFromQuery() {
  const params = useSearchParams();
  return <DestinationsCatalog selected={parseInterests(params.get("interests") ?? undefined)} />;
}
