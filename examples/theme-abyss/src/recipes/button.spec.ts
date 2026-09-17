import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";
import { defineRecipe } from "@stealthscale/theme/authoring";

import { extension } from "#recipes/button.ts";

describe("extension", () => {
  it("writes no value a theme cannot move", () => {
    const recipe = defineRecipe({ base: extension.base, className: "button" });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });

  it("tracks the label wide", () => {
    expect(extension.base).toStrictEqual({ letterSpacing: "wide" });
  });
});
