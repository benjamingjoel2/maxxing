@AGENTS.md

# Maxxing — project notes

Culture-oriented trip planner. Next.js 16 App Router, TypeScript, Tailwind v4. No backend.

- Content is code: destinations live in `src/data/destinations/*.ts` and must satisfy the
  `Destination` type in `src/lib/types.ts`. Keep descriptions factual and one to two sentences.
- Itinerary logic is pure and deterministic in `src/lib/itinerary.ts`. Change it only with the
  tests in `src/lib/itinerary.test.ts` passing (`npm test`, runs on Node's native TS stripping;
  test files import with `.ts` extensions for that reason).
- Client components read browser state through `useSyncExternalStore`, not `useEffect` +
  `setState`; the lint config rejects the latter.
- Theme tokens are CSS variables in `src/app/globals.css`, mapped into Tailwind via `@theme
  inline`. Use the `paper`/`ink`/`accent` colour names rather than raw Tailwind colours.
- Before pushing: `npm run check && npm run build`.
