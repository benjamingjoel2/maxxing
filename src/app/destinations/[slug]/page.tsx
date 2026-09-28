import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExperienceCard } from "@/components/experience-card";
import { InterestBadge } from "@/components/interest-badge";
import { destinations, getDestination } from "@/data/destinations";
import { INTEREST_LABELS, type Interest } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const destination = getDestination((await params).slug);
  if (!destination) return { title: "Not found" };
  return {
    title: `${destination.name}, ${destination.country}`,
    description: destination.tagline,
  };
}

export default async function DestinationPage({ params }: Props) {
  const destination = getDestination((await params).slug);
  if (!destination) notFound();

  const [a, b] = destination.palette;
  const byInterest = new Map<Interest, number>();
  for (const e of destination.experiences) {
    for (const i of e.interests) byInterest.set(i, (byInterest.get(i) ?? 0) + 1);
  }
  const threads = [...byInterest.entries()].sort((x, y) => y[1] - x[1]);

  return (
    <>
      <section
        className="relative overflow-hidden text-white"
        style={{ background: `linear-gradient(120deg, ${a}, ${b})` }}
      >
        <div className="absolute inset-0 grain" />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-14 sm:px-6 sm:pb-20 sm:pt-20">
          <Link href="/destinations" className="text-sm text-white/80 hover:text-white">
            ← All destinations
          </Link>
          <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-white/80">{destination.country}</p>
          <h1 className="mt-2 font-serif text-6xl font-semibold leading-none tracking-tight sm:text-8xl">
            {destination.name}
          </h1>
          <p className="mt-4 max-w-xl font-serif text-2xl leading-snug text-white/95">{destination.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/plan?destination=${destination.slug}`}
              className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1c1917] transition hover:brightness-95"
            >
              Plan a trip to {destination.name}
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-12">
          <section>
            <p className="text-lg leading-relaxed text-ink">{destination.description}</p>
          </section>

          <section>
            <div className="mb-6 flex items-baseline justify-between gap-4">
              <h2 className="font-serif text-3xl font-semibold">
                {destination.experiences.length} experiences
              </h2>
              <p className="text-sm text-ink-3">In our curated order</p>
            </div>
            <div className="grid gap-4">
              {destination.experiences.map((e) => (
                <ExperienceCard key={e.id} experience={e} />
              ))}
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-card border border-line bg-paper-2/40 p-6">
            <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-ink-3">When to go</h2>
            <p className="mt-2 font-serif text-xl">{destination.bestMonths}</p>
          </div>

          <div className="rounded-card border border-line bg-paper-2/40 p-6">
            <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-ink-3">Strongest threads</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {threads.map(([interest, count]) => (
                <li key={interest} className="flex items-center justify-between gap-3 text-sm">
                  <InterestBadge interest={interest} />
                  <span className="text-ink-3">
                    {count} {count === 1 ? "experience" : "experiences"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-card border border-line bg-paper-2/40 p-6">
            <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-ink-3">Good to know</h2>
            <ul className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-ink-2">
              {destination.cultureNotes.map((note) => (
                <li key={note} className="border-l-2 border-accent/60 pl-3">
                  {note}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-ink-3">
            Leading with {destination.strengths.slice(0, 3).map((i) => INTEREST_LABELS[i].toLowerCase()).join(", ")}.
          </p>
        </aside>
      </div>
    </>
  );
}
