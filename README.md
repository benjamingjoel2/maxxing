# Maxxing — Culture oriented trips

Maxxing plans trips around culture: art, architecture, history, food, music, performance,
literature, film, craft and living ritual. Pick a city, choose the threads you care about, set a
pace, and get a day-by-day itinerary that leads with your interests, keeps each day walkable and
never sends you to two museums in a row.

## What's inside

- **12 curated destinations** (Kyoto, Mexico City, Lisbon, Istanbul, Vienna, Marrakech, Buenos
  Aires, Seoul, Naples, Oaxaca, Tbilisi, Hanoi), each with 14 to 16 hand-written cultural
  experiences, etiquette notes and best months to visit. Data lives in `src/data/destinations/`
  and is checked by `src/data/destinations.test.ts` (unique ids, every strength served, morning /
  afternoon / evening coverage, and so on).
- **A deterministic itinerary generator** (`src/lib/itinerary.ts`): scores experiences against the
  traveller's interests and the city's strengths, anchors each day on the best remaining match,
  then fills slots preferring the same neighbourhood and a different kind of activity. Covered by
  unit tests.
- **Pages**
  - `/` landing page
  - `/destinations` catalogue, re-ranked by interest via `?interests=art,food`
  - `/destinations/[slug]` city guide with all experiences and culture notes
  - `/experiences` every experience across every city, filtered by thread and kind
  - `/plan` live trip planner; the plan is encoded in the URL so it can be shared
  - `/trips` trips saved in the browser (localStorage), expandable and editable
- Light and dark themes, responsive layout, no client-side data fetching.
- Generated Open Graph images for the site and each city, and print styles so an itinerary comes
  out clean on paper.

## Stack

Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4. No database and no
external APIs: everything is static content plus browser storage.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

## Check

```bash
npm run typecheck  # tsc
npm run lint       # eslint (next/core-web-vitals + typescript)
npm test           # node --test, runs src/**/*.test.ts natively
npm run check      # all three
npm run build      # production build
```

## Adding a destination

1. Create `src/data/destinations/<slug>.ts` exporting a `Destination` (see `src/lib/types.ts`).
2. Give each experience a stable `id`, one or more `interests`, a `timeOfDay` and a `neighborhood`.
   The generator uses these to place it and to keep days walkable.
3. Register it in `src/data/destinations/index.ts`. The detail page and sitemap pick it up
   automatically.

## Configuration

`NEXT_PUBLIC_SITE_URL` sets the base URL used in `sitemap.xml`. It defaults to a placeholder.
