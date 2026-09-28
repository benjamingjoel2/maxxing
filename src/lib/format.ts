import type { Price, TimeOfDay } from "./types";

export function formatHours(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (Number.isInteger(hours)) return `${hours} h`;
  return `${hours.toFixed(1).replace(/\.0$/, "")} h`;
}

export const PRICE_LABELS: Record<Price, string> = {
  free: "Free",
  $: "Inexpensive",
  $$: "Moderate",
  $$$: "Splurge",
};

export const TIME_LABELS: Record<TimeOfDay, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  any: "Any time",
};

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
