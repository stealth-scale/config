import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import { sticky } from "#patterns/sticky.ts";

describe("sticky", () => {
  it("sticks to the top of the scroller on the sticky rung when nothing is stated", () => {
    expect(sticky()).toStrictEqual({ position: "sticky", top: "0", zIndex: "sticky" });
  });

  it("stops at the distance it was given", () => {
    expect(sticky({ top: "inset.md" })).toMatchObject({ top: "inset.md" });
  });

  it("passes the recipe checks", () => {
    const recipe = defineRecipe({ base: sticky({ top: "inset.md" }), className: "x" });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });
});
