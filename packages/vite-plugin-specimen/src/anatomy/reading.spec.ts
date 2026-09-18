import { describe, expect, it } from "vitest";

import { isRecipe, settled, worthListing } from "#anatomy/reading.ts";

describe("reading", () => {
  it("follows the types a prop refers to two deep when nothing is stated", () => {
    expect(settled({}).depth).toBe(2);
  });

  it("lists a type of at most two dozen members when nothing is stated", () => {
    expect(settled({}).members).toBe(24);
  });

  it("follows the types as deep as a repository states", () => {
    expect(settled({ depth: 4 }).depth).toBe(4);
  });

  it("lists as many members as a repository states", () => {
    expect(settled({ members: 8 }).members).toBe(8);
  });

  it.each([
    { give: "/src/button/recipe.ts", want: true },
    { give: "/src/button/button.recipe.ts", want: true },
    { give: "recipe.ts", want: true },
    { give: "/src/button/button.ts", want: false },
    { give: "/src/button/recipe.spec.ts", want: false },
    { give: "/src/recipes.ts", want: false },
  ])("reads $give as a recipe: $want", ({ give, want }) => {
    expect(isRecipe(give)).toBe(want);
  });

  it("lists a type holding fewer members than the cap", () => {
    expect(worthListing(3, 24)).toBe(true);
  });

  it("lists a type holding exactly the cap", () => {
    expect(worthListing(24, 24)).toBe(true);
  });

  it("names a type holding more members than the cap", () => {
    expect(worthListing(25, 24)).toBe(false);
  });

  it("names a type holding no members at all", () => {
    expect(worthListing(0, 24)).toBe(false);
  });
});
