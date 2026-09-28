import Link from "next/link";
import { DestinationCard } from "@/components/destination-card";
import { InterestBadge } from "@/components/interest-badge";
import { Section } from "@/components/section";
import { destinations } from "@/data/destinations";
import { INTERESTS } from "@/lib/types";

const STEPS = [
  {
    title: "Pick a city that makes things",
    body: "Eight destinations chosen for living culture: places where the craft, the music and the cooking are still practised, not just displayed.",
  },
  {
    title: "Tell us what you go for",
    body: "Galleries or markets, opera or street tango, cathedrals or cinemas. Choose as many threads as you like and set your pace.",
  },
  {
    title: "Get a day-by-day plan",
    body: "Maxxing builds an itinerary that leads with your interests, keeps each day walkable and never sends you to two museums in a row.",
  },
];

export default function HomePage() {
  const totalExperiences = destinations.reduce((n, d) => n + d.experiences.length, 0);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line/70">
        <div
          className="absolute inset-0 -z-10 opacity-90"
          style={{
            background:
              "radial-gradient(60% 80% at 80% 10%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%), radial-gradient(50% 60% at 10% 90%, color-mix(in srgb, var(--ochre) 24%, transparent), transparent 70%)",
          }}
        />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-accent">Culture oriented trips</p>
            <h1 className="font-serif text-5xl font-semibold leading-[1.02] tracking-tight text-balance sm:text-7xl">
              Travel for what a place makes, plays, cooks and remembers.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
              Maxxing plans trips around culture: the museums worth a morning, the markets worth a
              detour, the performances worth booking ahead. Pick a city and your interests, and get a
              plan you can actually walk.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/plan"
                className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition hover:brightness-110"
              >
                Plan a trip
              </Link>
              <Link
                href="/destinations"
                className="inline-flex items-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink transition hover:border-ink-3"
              >
                Browse destinations
              </Link>
            </div>
          </div>
          <dl className="grid grid-cols-3 gap-4 border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-ink-3">Cities</dt>
              <dd className="mt-1 font-serif text-4xl font-semibold">{destinations.length}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-ink-3">Experiences</dt>
              <dd className="mt-1 font-serif text-4xl font-semibold">{totalExperiences}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-ink-3">Threads</dt>
              <dd className="mt-1 font-serif text-4xl font-semibold">{INTERESTS.length}</dd>
            </div>
          </dl>
        </div>
      </section>

      <Section eyebrow="How it works" title="Three steps, then go.">
        <ol className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="rounded-card border border-line bg-paper-2/40 p-6">
              <span className="font-serif text-4xl font-semibold text-accent">{i + 1}</span>
              <h3 className="mt-3 font-serif text-xl font-medium leading-snug">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        eyebrow="Threads"
        title="Follow the thread you care about."
        description="Every experience is tagged by the kind of culture it belongs to. Start from a thread to see which cities do it best."
        className="pt-0 sm:pt-0"
      >
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => (
            <Link
              key={interest}
              href={`/destinations?interests=${interest}`}
              className="rounded-full transition hover:-translate-y-0.5"
            >
              <InterestBadge interest={interest} size="md" />
            </Link>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Destinations"
        title="Cities chosen for their living culture."
        description="Not the most visited, the most practised. Each one has a deep bench in at least three threads."
        className="pt-0 sm:pt-0"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((d) => (
            <DestinationCard key={d.slug} destination={d} />
          ))}
        </div>
      </Section>

      <section className="border-t border-line/70 bg-paper-2/50">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-balance sm:text-4xl">Ready to plan?</h2>
            <p className="mt-2 max-w-md text-ink-2">
              Build an itinerary in under a minute. Save it here, share it by link, adjust it as you go.
            </p>
          </div>
          <Link
            href="/plan"
            className="inline-flex items-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition hover:brightness-110"
          >
            Start planning
          </Link>
        </div>
      </section>
    </>
  );
}
