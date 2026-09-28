"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { destinations, getDestination } from "@/data/destinations";
import { formatHours, pluralize } from "@/lib/format";
import { buildItinerary, MAX_DAYS, MIN_DAYS, slotsPerDay, totalHours } from "@/lib/itinerary";
import { parsePlan, planToQuery } from "@/lib/plan-params";
import { addTripAndNotify, newTripId } from "@/lib/storage";
import { INTERESTS, INTEREST_LABELS, type Interest, type Pace, type TripPlan } from "@/lib/types";
import { InterestBadge } from "./interest-badge";
import { ItineraryView } from "./itinerary-view";

const PACES: { value: Pace; label: string; hint: string }[] = [
  { value: "gentle", label: "Gentle", hint: "Two things a day, long lunches." },
  { value: "steady", label: "Steady", hint: "Morning, afternoon, evening." },
  { value: "packed", label: "Packed", hint: "Four stops. You will sleep well." },
];

export function TripPlanner({ initialPlan }: { initialPlan: TripPlan }) {
  const [plan, setPlan] = useState<TripPlan>(() =>
    getDestination(initialPlan.destinationSlug)
      ? initialPlan
      : { ...initialPlan, destinationSlug: destinations[0].slug },
  );
  const [saved, setSaved] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const destination = getDestination(plan.destinationSlug) ?? destinations[0];
  const itinerary = useMemo(() => buildItinerary(destination, plan), [destination, plan]);
  const hours = totalHours(itinerary);
  const stops = itinerary.reduce((n, d) => n + d.slots.length, 0);
  const capacity = plan.days * slotsPerDay(plan.pace);

  // Keep the URL in sync so the plan is shareable and survives a refresh.
  useEffect(() => {
    const url = `${window.location.pathname}?${planToQuery(plan)}`;
    window.history.replaceState(null, "", url);
  }, [plan]);

  function update(patch: Partial<TripPlan>) {
    setSaved(null);
    setPlan((p) => ({ ...p, ...patch }));
  }

  function toggleInterest(interest: Interest) {
    update({
      interests: plan.interests.includes(interest)
        ? plan.interests.filter((i) => i !== interest)
        : [...plan.interests, interest],
    });
  }

  function save() {
    const id = newTripId();
    addTripAndNotify({
      ...plan,
      id,
      title: `${pluralize(plan.days, "day")} in ${destination.name}`,
      createdAt: new Date().toISOString(),
      itinerary,
    });
    setSaved(id);
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable; the URL bar still holds the link.
    }
  }

  return (
    <div className="print-full grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr]">
      <form
        className="print-hidden flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start"
        onSubmit={(e) => e.preventDefault()}
      >
        <fieldset className="flex flex-col gap-2">
          <label htmlFor="destination" className="text-xs font-medium uppercase tracking-[0.18em] text-ink-3">
            Where
          </label>
          <select
            id="destination"
            value={plan.destinationSlug}
            onChange={(e) => update({ destinationSlug: e.target.value })}
            className="rounded-xl border border-line bg-paper px-4 py-3 font-serif text-lg text-ink outline-none focus:border-ink"
          >
            {destinations.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}, {d.country}
              </option>
            ))}
          </select>
          <p className="text-sm text-ink-2">{destination.tagline}</p>
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-xs font-medium uppercase tracking-[0.18em] text-ink-3">How long</legend>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => update({ days: Math.max(MIN_DAYS, plan.days - 1) })}
              disabled={plan.days <= MIN_DAYS}
              aria-label="Fewer days"
              className="h-10 w-10 rounded-full border border-line text-lg disabled:opacity-40"
            >
              −
            </button>
            <span className="min-w-[6rem] text-center font-serif text-2xl">{pluralize(plan.days, "day")}</span>
            <button
              type="button"
              onClick={() => update({ days: Math.min(MAX_DAYS, plan.days + 1) })}
              disabled={plan.days >= MAX_DAYS}
              aria-label="More days"
              className="h-10 w-10 rounded-full border border-line text-lg disabled:opacity-40"
            >
              +
            </button>
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="text-xs font-medium uppercase tracking-[0.18em] text-ink-3">What you go for</legend>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((interest) => {
              const active = plan.interests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-full transition ${
                    active ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <InterestBadge interest={interest} size="md" />
                </button>
              );
            })}
          </div>
          <p className="text-sm text-ink-2">
            {plan.interests.length === 0
              ? `Nothing picked, so we lean on what ${destination.name} does best.`
              : `Leading with ${plan.interests.map((i) => INTEREST_LABELS[i].toLowerCase()).join(", ")}.`}
          </p>
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-xs font-medium uppercase tracking-[0.18em] text-ink-3">Pace</legend>
          <div className="grid grid-cols-3 gap-2">
            {PACES.map((p) => (
              <label
                key={p.value}
                className={`cursor-pointer rounded-xl border p-3 text-sm transition ${
                  plan.pace === p.value ? "border-ink bg-paper-2" : "border-line hover:border-ink-3"
                }`}
              >
                <input
                  type="radio"
                  name="pace"
                  value={p.value}
                  checked={plan.pace === p.value}
                  onChange={() => update({ pace: p.value })}
                  className="sr-only"
                />
                <span className="block font-medium">{p.label}</span>
                <span className="mt-1 block text-xs text-ink-3">{p.hint}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-3 border-t border-line pt-6">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={save}
              className="inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition hover:brightness-110"
            >
              Save this trip
            </button>
            <button
              type="button"
              onClick={share}
              className="inline-flex items-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition hover:border-ink-3"
            >
              {copied ? "Link copied" : "Copy link"}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition hover:border-ink-3"
            >
              Print
            </button>
          </div>
          {saved && (
            <p className="text-sm text-ink-2" role="status">
              Saved.{" "}
              <Link href="/trips" className="font-medium text-ink underline underline-offset-4">
                See my trips
              </Link>
            </p>
          )}
        </div>
      </form>

      <section aria-live="polite">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">Your itinerary</p>
            <h2 className="mt-1 font-serif text-3xl font-semibold sm:text-4xl">
              {pluralize(plan.days, "day")} in {destination.name}
            </h2>
          </div>
          <p className="text-sm text-ink-2">
            {stops} of {capacity} stops · about {formatHours(hours)} of culture
          </p>
        </header>
        {stops < capacity && (
          <p className="print-hidden mb-6 rounded-xl border border-line bg-paper-2/60 p-4 text-sm text-ink-2">
            We ran out of experiences matching this plan before filling every slot. Shorten the trip, ease
            the pace, or treat the gaps as time to wander.
          </p>
        )}
        <ItineraryView days={itinerary} />
      </section>
    </div>
  );
}

/** Reads the plan from the query string; must sit inside a Suspense boundary. */
export function TripPlannerFromQuery() {
  const params = useSearchParams();
  const plan = parsePlan(Object.fromEntries(params.entries()), destinations[0].slug);
  // Re-mount when the destination in the URL changes (e.g. "Edit in planner" from a saved trip).
  return <TripPlanner key={plan.destinationSlug} initialPlan={plan} />;
}
