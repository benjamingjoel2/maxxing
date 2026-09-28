import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildItinerary, scoreExperience, slotsPerDay } from "./itinerary.ts";
import type { Destination, Experience } from "./types.ts";

function exp(
  id: string,
  overrides: Partial<Experience> = {},
): Experience {
  return {
    id,
    title: id,
    kind: "museum",
    interests: ["art"],
    hours: 2,
    neighborhood: "Centre",
    timeOfDay: "any",
    price: "$",
    description: "",
    ...overrides,
  };
}

const city: Destination = {
  slug: "testville",
  name: "Testville",
  country: "Nowhere",
  tagline: "",
  description: "",
  palette: ["#000", "#fff"],
  bestMonths: "",
  strengths: ["art", "food"],
  cultureNotes: [],
  experiences: [
    exp("gallery-a", { interests: ["art"], neighborhood: "North" }),
    exp("gallery-b", { interests: ["art"], neighborhood: "South" }),
    exp("market", { kind: "market", interests: ["food"], neighborhood: "North", timeOfDay: "morning" }),
    exp("dinner", { kind: "meal", interests: ["food"], neighborhood: "North", timeOfDay: "evening" }),
    exp("supper", { kind: "meal", interests: ["food"], neighborhood: "South", timeOfDay: "evening" }),
    exp("concert", { kind: "venue", interests: ["music"], neighborhood: "South", timeOfDay: "evening" }),
    exp("castle", { kind: "landmark", interests: ["history", "architecture"], neighborhood: "North" }),
    exp("walk", { kind: "neighborhood walk", interests: ["architecture"], neighborhood: "South", timeOfDay: "afternoon" }),
  ],
};

describe("scoreExperience", () => {
  it("rewards chosen interests and the city's strengths", () => {
    assert.equal(scoreExperience(exp("x", { interests: ["art"] }), ["art"], ["art"]), 4);
    assert.equal(scoreExperience(exp("x", { interests: ["music"] }), ["art"], ["art"]), 0);
  });

  it("falls back to the city's strengths when no interests are chosen", () => {
    assert.equal(scoreExperience(exp("x", { interests: ["food"] }), [], ["food"]), 4);
    assert.equal(scoreExperience(exp("x", { interests: ["music"] }), [], ["food"]), 0);
  });
});

describe("buildItinerary", () => {
  it("produces the requested number of days with at most the pace's slots", () => {
    const plan = buildItinerary(city, { days: 2, interests: ["art"], pace: "steady" });
    assert.equal(plan.length, 2);
    for (const day of plan) assert.ok(day.slots.length <= slotsPerDay("steady"));
  });

  it("never repeats an experience", () => {
    const plan = buildItinerary(city, { days: 7, interests: [], pace: "packed" });
    const ids = plan.flatMap((d) => d.slots.map((s) => s.experience.id));
    assert.equal(new Set(ids).size, ids.length);
    assert.equal(ids.length, city.experiences.length);
  });

  it("respects time of day", () => {
    const plan = buildItinerary(city, { days: 3, interests: ["food", "music"], pace: "steady" });
    for (const day of plan) {
      for (const slot of day.slots) {
        const t = slot.experience.timeOfDay;
        assert.ok(t === "any" || t === slot.timeOfDay, `${slot.experience.id} in ${slot.timeOfDay}`);
      }
    }
  });

  it("leads with the traveller's interests", () => {
    const plan = buildItinerary(city, { days: 1, interests: ["music"], pace: "steady" });
    const ids = plan[0].slots.map((s) => s.experience.id);
    assert.ok(ids.includes("concert"));
  });

  it("does not serve two meals in one day", () => {
    const plan = buildItinerary(city, { days: 1, interests: ["food"], pace: "packed" });
    const meals = plan[0].slots.filter((s) => s.experience.kind === "meal");
    assert.equal(meals.length, 1);
  });

  it("clamps the day count", () => {
    assert.equal(buildItinerary(city, { days: 0, interests: [], pace: "gentle" }).length, 1);
    assert.equal(buildItinerary(city, { days: 99, interests: [], pace: "gentle" }).length, 7);
  });

  it("is deterministic", () => {
    const a = buildItinerary(city, { days: 3, interests: ["art", "food"], pace: "steady" });
    const b = buildItinerary(city, { days: 3, interests: ["art", "food"], pace: "steady" });
    assert.deepEqual(a, b);
  });
});
