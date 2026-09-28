import type {
  Day,
  Destination,
  Experience,
  Interest,
  Pace,
  Slot,
  TimeOfDay,
} from "./types";

type FixedTime = Exclude<TimeOfDay, "any">;

/** The slots a day gets for each pace, in order. */
const SLOT_TEMPLATES: Record<Pace, FixedTime[]> = {
  gentle: ["morning", "afternoon"],
  steady: ["morning", "afternoon", "evening"],
  packed: ["morning", "afternoon", "afternoon", "evening"],
};

export const MAX_DAYS = 7;
export const MIN_DAYS = 1;

export function slotsPerDay(pace: Pace): number {
  return SLOT_TEMPLATES[pace].length;
}

function fitsSlot(experience: Experience, time: FixedTime): boolean {
  return experience.timeOfDay === "any" || experience.timeOfDay === time;
}

/**
 * How well an experience matches the traveller's interests. Deterministic.
 * When no interests are chosen, the destination's own strengths stand in
 * so the plan still leans toward what the city does best.
 */
export function scoreExperience(
  experience: Experience,
  interests: Interest[],
  strengths: Interest[],
): number {
  const wanted = interests.length > 0 ? interests : strengths;
  let score = 0;
  for (const interest of experience.interests) {
    if (wanted.includes(interest)) score += 3;
    // A city's signature threads get a nudge even when not explicitly picked.
    if (strengths.includes(interest)) score += 1;
  }
  return score;
}

interface Candidate {
  experience: Experience;
  score: number;
}

function pick(
  candidates: Candidate[],
  time: FixedTime,
  day: Slot[],
  focus: string | undefined,
): Candidate | undefined {
  let best: Candidate | undefined;
  let bestScore = -Infinity;
  for (const candidate of candidates) {
    if (!fitsSlot(candidate.experience, time)) continue;
    let score = candidate.score;
    // Keep the day walkable: prefer staying in the same neighborhood.
    if (focus && candidate.experience.neighborhood === focus) score += 2;
    // Vary the day: two museums back to back gets dull, two meals is too much.
    if (day.some((s) => s.experience.kind === candidate.experience.kind)) {
      score -= candidate.experience.kind === "meal" ? 10 : 2;
    }
    if (score > bestScore) {
      best = candidate;
      bestScore = score;
    }
  }
  return best;
}

/**
 * Build a day-by-day itinerary for a destination.
 *
 * The algorithm is greedy and deterministic: each day starts with the
 * strongest remaining match as its anchor, then fills the remaining slots
 * preferring experiences in the same neighborhood and of different kinds.
 * Experiences are never repeated. Days may end up with fewer slots than the
 * pace allows when the city's list runs out.
 */
export function buildItinerary(
  destination: Destination,
  options: { days: number; interests: Interest[]; pace: Pace },
): Day[] {
  const days = Math.min(MAX_DAYS, Math.max(MIN_DAYS, Math.floor(options.days)));
  const template = SLOT_TEMPLATES[options.pace];

  // Sort once so ties resolve in a stable, meaningful order (higher score,
  // then the curated order in the data file).
  const remaining: Candidate[] = destination.experiences
    .map((experience) => ({
      experience,
      score: scoreExperience(experience, options.interests, destination.strengths),
    }))
    .sort((a, b) => b.score - a.score);

  const result: Day[] = [];
  for (let n = 1; n <= days; n++) {
    const slots: Slot[] = [];
    let focus: string | undefined;

    for (const time of template) {
      const choice = pick(remaining, time, slots, focus);
      if (!choice) continue;
      remaining.splice(remaining.indexOf(choice), 1);
      slots.push({ timeOfDay: time, experience: choice.experience });
      if (!focus) focus = choice.experience.neighborhood;
    }

    // Only claim a neighborhood focus when the day really centres on one.
    const inFocus = slots.filter((s) => s.experience.neighborhood === focus).length;
    result.push({
      number: n,
      focus: slots.length > 1 && inFocus >= 2 ? focus : undefined,
      slots,
    });
  }
  return result;
}

export function totalHours(days: Day[]): number {
  return days.reduce(
    (sum, day) => sum + day.slots.reduce((s, slot) => s + slot.experience.hours, 0),
    0,
  );
}

export function interestCoverage(days: Day[]): Partial<Record<Interest, number>> {
  const counts: Partial<Record<Interest, number>> = {};
  for (const day of days) {
    for (const slot of day.slots) {
      for (const interest of slot.experience.interests) {
        counts[interest] = (counts[interest] ?? 0) + 1;
      }
    }
  }
  return counts;
}
