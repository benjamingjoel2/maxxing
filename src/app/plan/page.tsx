import type { Metadata } from "next";
import { TripPlanner } from "@/components/trip-planner";
import { destinations } from "@/data/destinations";
import { parsePlan, type SearchParams } from "@/lib/plan-params";

export const metadata: Metadata = {
  title: "Plan a trip",
  description: "Choose a city, your interests and a pace. Get a day-by-day cultural itinerary.",
};

export default async function PlanPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const plan = parsePlan(await searchParams, destinations[0].slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-accent">Plan a trip</p>
        <h1 className="font-serif text-4xl font-semibold leading-tight text-balance sm:text-5xl">
          Tell us where and what for. We&apos;ll do the days.
        </h1>
        <p className="mt-4 text-ink-2">
          The plan updates as you change things. Save it to this browser or copy the link to share.
        </p>
      </div>
      <TripPlanner key={plan.destinationSlug} initialPlan={plan} />
    </div>
  );
}
