import type { Destination, Interest } from "@/lib/types";
import { buenosAires } from "./buenos-aires";
import { istanbul } from "./istanbul";
import { kyoto } from "./kyoto";
import { lisbon } from "./lisbon";
import { marrakech } from "./marrakech";
import { mexicoCity } from "./mexico-city";
import { seoul } from "./seoul";
import { vienna } from "./vienna";

export const destinations: Destination[] = [
  kyoto,
  mexicoCity,
  lisbon,
  istanbul,
  vienna,
  marrakech,
  buenosAires,
  seoul,
];

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

/** Destinations whose strengths cover every chosen interest, best matches first. */
export function rankDestinations(interests: Interest[]): Destination[] {
  if (interests.length === 0) return destinations;
  return [...destinations]
    .map((d) => {
      let score = 0;
      for (const interest of interests) {
        const idx = d.strengths.indexOf(interest);
        if (idx >= 0) score += d.strengths.length - idx;
        // Also count how many experiences serve this interest.
        score += d.experiences.filter((e) => e.interests.includes(interest)).length * 0.25;
      }
      return { d, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ d }) => d);
}
