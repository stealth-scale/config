import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import { statusVariants } from "#authoring/recipes/status.ts";

describe("statusVariants", () => {
  it("points the palette at the semantic palette of each status", () => {
    expect(statusVariants()).toStrictEqual({
      error: { colorPalette: "error" },
      info: { colorPalette: "info" },
      success: { colorPalette: "success" },
      warning: { colorPalette: "warning" },
    });
  });

  it("names an intent the recipe checks accept for every status", () => {
    const recipe = defineRecipe({ className: "x", variants: { status: statusVariants() } });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });
});
