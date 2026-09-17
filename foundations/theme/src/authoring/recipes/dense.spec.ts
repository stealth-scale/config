import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import { dense } from "#authoring/recipes/dense.ts";

describe("dense", () => {
  it("nests the styles under the compact condition", () => {
    expect(dense({ height: "control.sm" })).toStrictEqual({ _compact: { height: "control.sm" } });
  });

  it("nests under a condition the foundation defines", () => {
    const recipe = defineRecipe({ base: dense({ height: "control.sm" }), className: "x" });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });
});
