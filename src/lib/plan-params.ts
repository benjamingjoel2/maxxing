import { INTERESTS, type Interest, type Pace, type TripPlan } from "./types";
import { MAX_DAYS, MIN_DAYS } from "./itinerary";

export type SearchParams = Record<string, string | string[] | undefined>;

const PACES: Pace[] = ["gentle", "steady", "packed"];

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseInterests(value: string | string[] | undefined): Interest[] {
  const raw = Array.isArray(value) ? value.join(",") : value ?? "";
  const seen = new Set<Interest>();
  for (const part of raw.split(",")) {
    const trimmed = part.trim() as Interest;
    if ((INTERESTS as readonly string[]).includes(trimmed)) seen.add(trimmed);
  }
  return [...seen];
}

export function parsePlan(params: SearchParams, fallbackDestination: string): TripPlan {
  const daysRaw = Number.parseInt(first(params.days) ?? "", 10);
  const days = Number.isFinite(daysRaw) ? Math.min(MAX_DAYS, Math.max(MIN_DAYS, daysRaw)) : 3;
  const paceRaw = first(params.pace) as Pace | undefined;
  return {
    destinationSlug: first(params.destination) ?? fallbackDestination,
    days,
    interests: parseInterests(params.interests),
    pace: paceRaw && PACES.includes(paceRaw) ? paceRaw : "steady",
  };
}

export function planToQuery(plan: TripPlan): string {
  const q = new URLSearchParams();
  q.set("destination", plan.destinationSlug);
  q.set("days", String(plan.days));
  if (plan.interests.length) q.set("interests", plan.interests.join(","));
  q.set("pace", plan.pace);
  return q.toString();
}
