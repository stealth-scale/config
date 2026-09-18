import { describe, expect, it } from "vitest";

import {
  axesOf,
  defaultsOf,
  recipeViolations,
  slotsOf,
  valuesOf,
} from "@stealthscale/testing-theme";

import { recipe } from "#roving-focus/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(
      recipeViolations(recipe, { names: ["RovingFocus.Root", "RovingFocus.Item"] }),
    ).toStrictEqual([]);
  });

  it("names its class roving-focus", () => {
    expect(recipe.className).toBe("roving-focus");
  });

  it("styles the root and the item", () => {
    expect(slotsOf(recipe)).toStrictEqual(["item", "root"]);
  });

  it("offers the one axis a group takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["orientation"]);
    expect(valuesOf(recipe, "orientation")).toStrictEqual(["both", "horizontal", "vertical"]);
  });

  it("lays the items out in a row when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ orientation: "horizontal" });
  });

  it("wraps a group the arrows move through on both axes", () => {
    expect(recipe.variants?.["orientation"]).toMatchObject({
      both: { root: { flexWrap: "wrap" } },
    });
  });

  it("tracks the namespace and every tag whose name opens with RovingFocus", () => {
    expect(recipe.jsx).toStrictEqual([/^RovingFocus(\.\w+)?$/u]);
  });
});
