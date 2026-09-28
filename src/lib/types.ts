export const INTERESTS = [
  "art",
  "architecture",
  "history",
  "food",
  "music",
  "performance",
  "literature",
  "film",
  "craft",
  "festivals",
] as const;

export type Interest = (typeof INTERESTS)[number];

export const INTEREST_LABELS: Record<Interest, string> = {
  art: "Art & galleries",
  architecture: "Architecture",
  history: "History",
  food: "Food & drink",
  music: "Music",
  performance: "Theatre & dance",
  literature: "Books & ideas",
  film: "Film",
  craft: "Craft & design",
  festivals: "Festivals & rituals",
};

export type TimeOfDay = "morning" | "afternoon" | "evening" | "any";

export type Price = "free" | "$" | "$$" | "$$$";

export type ExperienceKind =
  | "museum"
  | "gallery"
  | "landmark"
  | "neighborhood walk"
  | "market"
  | "meal"
  | "venue"
  | "workshop"
  | "bookshop"
  | "cinema"
  | "ritual";

export interface Experience {
  id: string;
  title: string;
  kind: ExperienceKind;
  interests: Interest[];
  /** Typical time needed, in hours. */
  hours: number;
  neighborhood: string;
  timeOfDay: TimeOfDay;
  price: Price;
  bookAhead?: boolean;
  description: string;
}

export interface Destination {
  slug: string;
  name: string;
  country: string;
  tagline: string;
  description: string;
  /** Two CSS colors used for the card and hero gradient. */
  palette: [string, string];
  bestMonths: string;
  /** The cultural threads this city is strongest in, in order. */
  strengths: Interest[];
  cultureNotes: string[];
  experiences: Experience[];
}

export type Pace = "gentle" | "steady" | "packed";

export interface Slot {
  timeOfDay: Exclude<TimeOfDay, "any">;
  experience: Experience;
}

export interface Day {
  number: number;
  /** The neighborhood most of the day is spent in, when one dominates. */
  focus?: string;
  slots: Slot[];
}

export interface TripPlan {
  destinationSlug: string;
  days: number;
  interests: Interest[];
  pace: Pace;
}

export interface SavedTrip extends TripPlan {
  id: string;
  title: string;
  createdAt: string;
  itinerary: Day[];
}
