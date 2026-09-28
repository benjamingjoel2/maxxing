import type { Metadata } from "next";
import Link from "next/link";
import { ExperienceCard } from "@/components/experience-card";
import { InterestBadge } from "@/components/interest-badge";
import { allExperiences } from "@/data/destinations";
import { parseInterests, type SearchParams } from "@/lib/plan-params";
import { INTERESTS, INTEREST_LABELS, type ExperienceKind, type Interest } from "@/lib/types";

export const metadata: Metadata = {
  title: "Explore experiences",
  description: "Every curated cultural experience across all cities, filtered by thread and kind.",
};

const KINDS: ExperienceKind[] = [
  "museum",
  "gallery",
  "landmark",
  "neighborhood walk",
  "market",
  "meal",
  "venue",
  "workshop",
  "bookshop",
  "cinema",
  "ritual",
];

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function buildHref(interests: Interest[], kind: ExperienceKind | undefined): string {
  const q = new URLSearchParams();
  if (interests.length) q.set("interests", interests.join(","));
  if (kind) q.set("kind", kind);
  const s = q.toString();
  return s ? `/experiences?${s}` : "/experiences";
}

export default async function ExperiencesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const interests = parseInterests(params.interests);
  const kindRaw = first(params.kind) as ExperienceKind | undefined;
  const kind = kindRaw && KINDS.includes(kindRaw) ? kindRaw : undefined;

  const all = allExperiences();
  const matches = all.filter(
    ({ experience }) =>
      (interests.length === 0 || interests.every((i) => experience.interests.includes(i))) &&
      (!kind || experience.kind === kind),
  );

  // Group by city, keeping the curated city order.
  const groups = new Map<string, typeof matches>();
  for (const item of matches) {
    const list = groups.get(item.destination.slug) ?? [];
    list.push(item);
    groups.set(item.destination.slug, list);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-accent">Explore</p>
        <h1 className="font-serif text-4xl font-semibold leading-tight text-balance sm:text-5xl">
          Every experience, across every city.
        </h1>
        <p className="mt-4 text-ink-2">
          Start from what you love and see which cities have it. Combine threads to narrow down.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by thread">
          {INTERESTS.map((interest) => {
            const active = interests.includes(interest);
            const next = active ? interests.filter((i) => i !== interest) : [...interests, interest];
            return (
              <Link
                key={interest}
                href={buildHref(next, kind)}
                aria-pressed={active}
                className={`rounded-full transition ${
                  active ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : "opacity-80 hover:opacity-100"
                }`}
              >
                <InterestBadge interest={interest} size="md" />
              </Link>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by kind">
          {KINDS.map((k) => {
            const active = kind === k;
            return (
              <Link
                key={k}
                href={buildHref(interests, active ? undefined : k)}
                aria-pressed={active}
                className={`rounded-full border px-3 py-1 text-xs capitalize transition ${
                  active ? "border-ink bg-ink text-paper" : "border-line text-ink-2 hover:border-ink-3"
                }`}
              >
                {k}
              </Link>
            );
          })}
          {(interests.length > 0 || kind) && (
            <Link href="/experiences" className="ml-2 text-sm text-ink-2 underline-offset-4 hover:underline">
              Clear
            </Link>
          )}
        </div>
      </div>

      <p className="mt-8 text-sm text-ink-2">
        {matches.length} of {all.length} experiences
        {interests.length > 0 && ` · ${interests.map((i) => INTEREST_LABELS[i].toLowerCase()).join(" + ")}`}
        {kind && ` · ${kind}`}
      </p>

      {groups.size === 0 ? (
        <div className="mt-8 rounded-card border border-dashed border-line p-10 text-center">
          <p className="font-serif text-2xl">Nothing matches that combination yet.</p>
          <p className="mt-2 text-ink-2">Try fewer threads, or a different kind.</p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-12">
          {[...groups.values()].map((items) => {
            const { destination } = items[0];
            return (
              <section key={destination.slug}>
                <header className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="font-serif text-2xl font-semibold">
                    <Link href={`/destinations/${destination.slug}`} className="hover:underline underline-offset-4">
                      {destination.name}
                    </Link>
                    <span className="ml-2 text-base font-normal text-ink-3">{destination.country}</span>
                  </h2>
                  <Link
                    href={`/plan?destination=${destination.slug}${interests.length ? `&interests=${interests.join(",")}` : ""}`}
                    className="text-sm font-medium text-accent hover:underline underline-offset-4"
                  >
                    Plan a trip here →
                  </Link>
                </header>
                <div className="grid gap-4 md:grid-cols-2">
                  {items.map(({ experience }) => (
                    <ExperienceCard key={`${destination.slug}-${experience.id}`} experience={experience} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
