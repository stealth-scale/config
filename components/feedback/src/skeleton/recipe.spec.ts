import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#skeleton/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Skeleton"] })).toStrictEqual([]);
  });

  it("names its class skeleton", () => {
    expect(recipe.className).toBe("skeleton");
  });

  it("offers the three axes a skeleton takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["loading", "motion", "radius"]);
  });

  it("stands in and pulses at the middle corner by default", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ loading: true, motion: "pulse", radius: "l2" });
  });

  it("offers the three motions", () => {
    expect(valuesOf(recipe, "motion")).toStrictEqual(["none", "pulse", "shimmer"]);
  });

  it("offers the four corners the theme draws", () => {
    expect(valuesOf(recipe, "radius")).toStrictEqual(["full", "l1", "l2", "l3"]);
  });

  it("hides everything inside it while it stands in", () => {
    expect(recipe.variants?.["loading"]?.["true"]).toMatchObject({
      "&::before, &::after, *": { visibility: "hidden" },
      color: "transparent",
    });
  });

  it("fades the content in once it has arrived", () => {
    expect(recipe.variants?.["loading"]?.["false"]).toStrictEqual({ animationStyle: "fade.in" });
  });

  it("tracks the tag named Skeleton and not the paragraph of them", () => {
    const [pattern] = recipe.jsx ?? [];

    expect(pattern).toStrictEqual(/^Skeleton$/u);
    expect(pattern instanceof RegExp && pattern.test("SkeletonText")).toBe(false);
  });
});
