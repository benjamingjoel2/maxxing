import Link from "next/link";
import type { Destination } from "@/lib/types";
import { InterestBadge } from "./interest-badge";

export function DestinationCard({ destination }: { destination: Destination }) {
  const [a, b] = destination.palette;
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-paper-2/40 transition hover:-translate-y-0.5 hover:border-ink-3 hover:shadow-lg hover:shadow-ink/5"
    >
      <div
        className="relative aspect-[5/3] overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
      >
        <div className="absolute inset-0 grain" />
        <span className="absolute left-4 top-4 rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm">
          {destination.country}
        </span>
        <span className="absolute bottom-3 left-4 font-serif text-4xl font-semibold text-white drop-shadow-sm sm:text-5xl">
          {destination.name}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="font-serif text-lg leading-snug text-ink">{destination.tagline}</p>
        <div className="mt-auto flex flex-wrap gap-1.5">
          {destination.strengths.slice(0, 3).map((i) => (
            <InterestBadge key={i} interest={i} />
          ))}
        </div>
        <p className="text-xs text-ink-3">
          {destination.experiences.length} curated experiences · Best {destination.bestMonths.toLowerCase()}
        </p>
      </div>
    </Link>
  );
}
