import { PRICE_LABELS, TIME_LABELS, formatHours } from "@/lib/format";
import type { Day } from "@/lib/types";
import { InterestBadge } from "./interest-badge";

export function ItineraryView({ days }: { days: Day[] }) {
  return (
    <ol className="flex flex-col gap-6">
      {days.map((day) => (
        <li key={day.number} className="rounded-2xl border border-line bg-paper-2/40 p-4 sm:p-6">
          <header className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-serif text-2xl font-semibold">Day {day.number}</h3>
            {day.focus && (
              <p className="text-sm text-ink-2">
                Mostly in <span className="font-medium text-ink">{day.focus}</span>
              </p>
            )}
          </header>
          {day.slots.length === 0 ? (
            <p className="text-sm text-ink-2">
              A free day. Wander, sit in a café, go back to whatever you liked most.
            </p>
          ) : (
            <ol className="relative flex flex-col gap-4 border-l border-line pl-5">
              {day.slots.map((slot, i) => (
                <li key={slot.experience.id} className="relative">
                  <span
                    className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-paper"
                    aria-hidden
                  />
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-3">
                    {TIME_LABELS[slot.timeOfDay]}
                    {i > 0 && day.slots[i - 1].timeOfDay === slot.timeOfDay ? " (continued)" : ""}
                  </p>
                  <h4 className="mt-0.5 font-serif text-lg font-medium leading-snug">
                    {slot.experience.title}
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">{slot.experience.description}</p>
                  <p className="mt-2 text-xs text-ink-3">
                    {slot.experience.neighborhood} · {formatHours(slot.experience.hours)} ·{" "}
                    {PRICE_LABELS[slot.experience.price]}
                    {slot.experience.bookAhead && (
                      <>
                        {" · "}
                        <span className="font-medium text-accent">Book ahead</span>
                      </>
                    )}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {slot.experience.interests.map((interest) => (
                      <InterestBadge key={interest} interest={interest} />
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </li>
      ))}
    </ol>
  );
}
