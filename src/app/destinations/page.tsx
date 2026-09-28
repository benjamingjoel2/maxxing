import type { Metadata } from "next";
import { Suspense } from "react";
import { DestinationsCatalog, DestinationsCatalogFromQuery } from "@/components/destinations-catalog";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Cities chosen for living culture, ranked by the threads you care about.",
};

export default function DestinationsPage() {
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
      {/* The unfiltered catalogue is prerendered; the filtered one takes over on the client. */}
      <Suspense fallback={<DestinationsCatalog selected={[]} />}>
        <DestinationsCatalogFromQuery />
      </Suspense>
    </div>
  );
}
