import { describe, expect, it } from "vitest";

import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import { recipe } from "#em/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Em"] })).toStrictEqual([]);
  });

  it("names its class em", () => {
    expect(recipe.className).toBe("em");
  });

  it("offers no axis because stress is one thing a writer either means or does not", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("states the italic rather than leaving it to the browser", () => {
    expect(recipe.base).toStrictEqual({ fontStyle: "italic" });
  });

  it("tracks every tag whose name ends in Em", () => {
    expect(recipe.jsx).toStrictEqual([/Em$/u]);
  });
});
