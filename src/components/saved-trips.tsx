"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getDestination } from "@/data/destinations";
import { pluralize } from "@/lib/format";
import { planToQuery } from "@/lib/plan-params";
import { getTripsServerSnapshot, getTripsSnapshot, removeTripAndNotify, subscribeTrips } from "@/lib/storage";
import { INTEREST_LABELS, type SavedTrip } from "@/lib/types";
import { InterestBadge } from "./interest-badge";
import { ItineraryView } from "./itinerary-view";

export function SavedTrips() {
  const trips: SavedTrip[] | null = useSyncExternalStore(
    subscribeTrips,
    getTripsSnapshot,
    getTripsServerSnapshot,
  );

  if (trips === null) {
    return <p className="text-sm text-ink-3">Loading your trips…</p>;
  }

  if (trips.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line p-10 text-center">
        <p className="font-serif text-2xl">No trips saved yet.</p>
        <p className="mt-2 text-ink-2">Plans you save live in this browser. Build one and it will show up here.</p>
        <Link
          href="/plan"
          className="mt-6 inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink"
        >
          Plan a trip
        </Link>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-6">
      {trips.map((trip) => {
        const destination = getDestination(trip.destinationSlug);
        const created = new Date(trip.createdAt);
        return (
          <li key={trip.id} className="rounded-card border border-line bg-paper-2/40">
            <details className="group">
              <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
                <div>
                  <h2 className="font-serif text-2xl font-semibold">{trip.title}</h2>
                  <p className="mt-1 text-sm text-ink-2">
                    {destination?.country ?? "Unknown"} · {trip.pace} pace ·{" "}
                    {pluralize(trip.itinerary.reduce((n, d) => n + d.slots.length, 0), "stop")} · saved{" "}
                    {created.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {trip.interests.length === 0 ? (
                      <span className="text-xs text-ink-3">
                        Led by {destination?.name ?? "the city"}&apos;s strengths
                      </span>
                    ) : (
                      trip.interests.map((i) => <InterestBadge key={i} interest={i} />)
                    )}
                  </div>
                </div>
                <span className="text-sm text-ink-2 group-open:hidden">Show plan</span>
                <span className="hidden text-sm text-ink-2 group-open:inline">Hide plan</span>
              </summary>
              <div className="border-t border-line p-5 sm:p-6">
                <ItineraryView days={trip.itinerary} />
                <div className="print-hidden mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/plan?${planToQuery(trip)}`}
                    className="inline-flex items-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold hover:border-ink-3"
                  >
                    Edit in planner
                  </Link>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold hover:border-ink-3"
                  >
                    Print
                  </button>
                  <button
                    type="button"
                    onClick={() => removeTripAndNotify(trip.id)}
                    className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-ink-2 hover:text-accent"
                  >
                    Delete
                  </button>
                </div>
                <p className="mt-4 text-xs text-ink-3">
                  Interests: {trip.interests.map((i) => INTEREST_LABELS[i]).join(", ") || "none chosen"}
                </p>
              </div>
            </details>
          </li>
        );
      })}
    </ul>
  );
}
