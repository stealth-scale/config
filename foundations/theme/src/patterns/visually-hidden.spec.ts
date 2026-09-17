import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import { visuallyHidden } from "#patterns/visually-hidden.ts";

describe("visuallyHidden", () => {
  it("draws the element for a screen reader alone", () => {
    expect(visuallyHidden()).toStrictEqual({ srOnly: true });
  });

  it("passes the recipe checks", () => {
    expect(
      recipeViolations(defineRecipe({ base: visuallyHidden(), className: "x" })),
    ).toStrictEqual([]);
  });
});
