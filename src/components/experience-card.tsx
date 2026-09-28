import { PRICE_LABELS, TIME_LABELS, formatHours } from "@/lib/format";
import type { Experience } from "@/lib/types";
import { InterestBadge } from "./interest-badge";

export function ExperienceCard({ experience, compact = false }: { experience: Experience; compact?: boolean }) {
  return (
    <article className="flex flex-col gap-2 rounded-2xl border border-line bg-paper p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-serif text-lg font-medium leading-snug">{experience.title}</h3>
        <span className="text-xs uppercase tracking-[0.14em] text-ink-3">{experience.kind}</span>
      </div>
      {!compact && <p className="text-sm leading-relaxed text-ink-2">{experience.description}</p>}
      <dl className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-3">
        <div>
          <dt className="sr-only">Neighbourhood</dt>
          <dd>{experience.neighborhood}</dd>
        </div>
        <div>
          <dt className="sr-only">Time needed</dt>
          <dd>{formatHours(experience.hours)}</dd>
        </div>
        <div>
          <dt className="sr-only">Best time of day</dt>
          <dd>{TIME_LABELS[experience.timeOfDay]}</dd>
        </div>
        <div>
          <dt className="sr-only">Price</dt>
          <dd>{PRICE_LABELS[experience.price]}</dd>
        </div>
        {experience.bookAhead && (
          <div>
            <dt className="sr-only">Booking</dt>
            <dd className="font-medium text-accent">Book ahead</dd>
          </div>
        )}
      </dl>
      <div className="flex flex-wrap gap-1.5">
        {experience.interests.map((i) => (
          <InterestBadge key={i} interest={i} />
        ))}
      </div>
    </article>
  );
}
