import { describe, expect, it } from "vitest";

import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import { recipe } from "#strong/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Strong"] })).toStrictEqual([]);
  });

  it("names its class strong", () => {
    expect(recipe.className).toBe("strong");
  });

  it("offers no variant axis", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("declares fontWeight as a step of the scale", () => {
    expect(recipe.base).toStrictEqual({ fontWeight: "semibold" });
  });

  it("tracks every tag whose name ends in Strong", () => {
    expect(recipe.jsx).toStrictEqual([/Strong$/u]);
  });
});
