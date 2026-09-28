import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { allExperiences, destinations, rankDestinations } from "./destinations/index.ts";
import { INTERESTS } from "../lib/types.ts";

describe("destination data", () => {
  it("has unique slugs", () => {
    const slugs = destinations.map((d) => d.slug);
    assert.equal(new Set(slugs).size, slugs.length);
  });

  for (const d of destinations) {
    describe(d.name, () => {
      it("has unique experience ids", () => {
        const ids = d.experiences.map((e) => e.id);
        assert.equal(new Set(ids).size, ids.length);
      });

      it("has enough content to fill a packed week", () => {
        assert.ok(d.experiences.length >= 14, `${d.experiences.length} experiences`);
        assert.ok(d.cultureNotes.length >= 3);
        assert.ok(d.strengths.length >= 3);
      });

      it("uses only known interests, and every strength is served", () => {
        for (const e of d.experiences) {
          assert.ok(e.interests.length > 0, `${e.id} has no interests`);
          for (const i of e.interests) assert.ok(INTERESTS.includes(i), `${e.id}: ${i}`);
        }
        for (const s of d.strengths) {
          assert.ok(
            d.experiences.some((e) => e.interests.includes(s)),
            `strength ${s} has no experiences`,
          );
        }
      });

      it("has morning, afternoon and evening options", () => {
        for (const t of ["morning", "afternoon", "evening"] as const) {
          assert.ok(
            d.experiences.some((e) => e.timeOfDay === t || e.timeOfDay === "any"),
            `no ${t} experiences`,
          );
        }
      });

      it("keeps descriptions short and slugs url-safe", () => {
        assert.match(d.slug, /^[a-z0-9-]+$/);
        for (const e of d.experiences) {
          assert.match(e.id, /^[a-z0-9-]+$/, e.id);
          assert.ok(e.description.length <= 320, `${e.id} description too long`);
          assert.ok(e.hours > 0 && e.hours <= 8, `${e.id} hours`);
        }
      });
    });
  }
});

describe("rankDestinations", () => {
  it("returns every destination regardless of filter", () => {
    assert.equal(rankDestinations(["film"]).length, destinations.length);
  });

  it("puts a city that leads with an interest first", () => {
    const first = rankDestinations(["music"])[0];
    assert.ok(first.strengths.includes("music"), first.name);
  });
});

describe("allExperiences", () => {
  it("flattens every city's list", () => {
    const total = destinations.reduce((n, d) => n + d.experiences.length, 0);
    assert.equal(allExperiences().length, total);
  });
});
