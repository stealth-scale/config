import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#badge/badge.recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe)).toStrictEqual([]);
  });

  it("offers a look axis alone", () => {
    expect(axesOf(recipe)).toStrictEqual(["variant"]);
    expect(valuesOf(recipe, "variant")).toStrictEqual(["solid", "subtle"]);
  });

  it("draws a subtle badge when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ variant: "subtle" });
  });
});
