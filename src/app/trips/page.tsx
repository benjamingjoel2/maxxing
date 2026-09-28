import type { Metadata } from "next";
import { SavedTrips } from "@/components/saved-trips";

export const metadata: Metadata = {
  title: "My trips",
  description: "Itineraries you have saved in this browser.",
};

export default function TripsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-accent">My trips</p>
        <h1 className="font-serif text-4xl font-semibold leading-tight text-balance sm:text-5xl">
          Plans you&apos;ve kept.
        </h1>
        <p className="mt-4 text-ink-2">Saved in this browser only. Nothing leaves your device.</p>
      </div>
      <SavedTrips />
    </div>
  );
}
