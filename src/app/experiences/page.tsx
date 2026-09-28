import type { Metadata } from "next";
import { Suspense } from "react";
import { ExperiencesExplorer, ExperiencesExplorerFromQuery } from "@/components/experiences-explorer";

export const metadata: Metadata = {
  title: "Explore experiences",
  description: "Every curated cultural experience across all cities, filtered by thread and kind.",
};

export default function ExperiencesPage() {
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
      {/* The unfiltered list is prerendered; the filtered one takes over on the client. */}
      <Suspense fallback={<ExperiencesExplorer interests={[]} />}>
        <ExperiencesExplorerFromQuery />
      </Suspense>
    </div>
  );
}
