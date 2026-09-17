import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#list/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { parts: ["root", "item", "indicator"] })).toStrictEqual([]);
  });

  it("names its class list", () => {
    expect(recipe.className).toBe("list");
  });

  it("styles the root and the item and the indicator", () => {
    expect(recipe.slots).toStrictEqual(["root", "item", "indicator"]);
  });

  it("offers an alignment axis and a gap axis and a motion axis and a look axis", () => {
    expect(axesOf(recipe)).toStrictEqual(["align", "gap", "motion", "variant"]);
  });

  it("draws the browser's markers at the middle gap when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ gap: "md", variant: "marker" });
  });

  it("offers the five gaps", () => {
    expect(valuesOf(recipe, "gap")).toStrictEqual(["lg", "md", "sm", "xl", "xs"]);
  });

  it("offers the marker look and the plain look", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["marker", "plain"]);
  });

  it("offers the two motions an entry enters with", () => {
    expect(valuesOf(recipe, "motion")).toStrictEqual(["reveal", "rise"]);
  });

  it("tracks the namespace and every tag whose name opens with List", () => {
    expect(recipe.jsx).toStrictEqual([/^List(\.\w+)?$/u]);
  });
});
