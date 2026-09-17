import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#frame/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Frame"] })).toStrictEqual([]);
  });

  it("names its class frame", () => {
    expect(recipe.className).toBe("frame");
  });

  it("offers a fit axis and a corner axis and a shape axis", () => {
    expect(axesOf(recipe)).toStrictEqual(["fit", "radius", "ratio"]);
  });

  it("draws a square that crops what it holds when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ fit: "cover", ratio: "square" });
  });

  it("offers every shape the theme states", () => {
    expect(valuesOf(recipe, "ratio")).toHaveLength(7);
    expect(valuesOf(recipe, "ratio")).toContain("video");
  });

  it("offers every corner the theme states", () => {
    expect(valuesOf(recipe, "radius")).toStrictEqual(["full", "l1", "l2", "l3"]);
  });

  it("tracks the tag a consumer writes it under", () => {
    expect(recipe.jsx).toStrictEqual([/^Frame$/u]);
  });
});
