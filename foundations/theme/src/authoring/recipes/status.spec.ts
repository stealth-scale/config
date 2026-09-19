import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import { field } from "#authoring/recipes/field.ts";
import { fieldStatusVariants, statusEmitted, statusVariants } from "#authoring/recipes/status.ts";

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
    const recipe = defineRecipe({
      className: "x",
      staticCss: [statusEmitted()],
      variants: { status: statusVariants() },
    });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });
});

describe("fieldStatusVariants", () => {
  it("draws the edge in the line family's member of each status", () => {
    expect(fieldStatusVariants()).toStrictEqual({
      error: { borderColor: "border.error", colorPalette: "error" },
      info: { borderColor: "border.info", colorPalette: "info" },
      success: { borderColor: "border.success", colorPalette: "success" },
      warning: { borderColor: "border.warning", colorPalette: "warning" },
    });
  });

  it("draws the error edge in the same token the invalid state draws", () => {
    expect(field()).toMatchObject({
      _invalid: { borderColor: fieldStatusVariants().error.borderColor },
    });
  });

  it("names a token the recipe checks accept for every status", () => {
    const recipe = defineRecipe({
      className: "x",
      staticCss: [statusEmitted()],
      variants: { status: fieldStatusVariants() },
    });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });
});
