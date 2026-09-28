import type { Destination, Experience, Interest } from "@/lib/types";
import { buenosAires } from "./buenos-aires.ts";
import { hanoi } from "./hanoi.ts";
import { istanbul } from "./istanbul.ts";
import { kyoto } from "./kyoto.ts";
import { lisbon } from "./lisbon.ts";
import { marrakech } from "./marrakech.ts";
import { naples } from "./naples.ts";
import { oaxaca } from "./oaxaca.ts";
import { mexicoCity } from "./mexico-city.ts";
import { seoul } from "./seoul.ts";
import { tbilisi } from "./tbilisi.ts";
import { vienna } from "./vienna.ts";

export const destinations: Destination[] = [
  kyoto,
  mexicoCity,
  lisbon,
  istanbul,
  vienna,
  marrakech,
  buenosAires,
  seoul,
  naples,
  oaxaca,
  tbilisi,
  hanoi,
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

export interface ExperienceWithCity {
  experience: Experience;
  destination: Destination;
}

/** Every experience across every city, in curated order. */
export function allExperiences(): ExperienceWithCity[] {
  return destinations.flatMap((destination) =>
    destination.experiences.map((experience) => ({ experience, destination })),
  );
}
