import { describe, expect, it } from "vitest";

import { axesOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#visually-hidden/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["VisuallyHidden"] })).toStrictEqual([]);
  });

  it("names its class visually-hidden", () => {
    expect(recipe.className).toBe("visually-hidden");
  });

  it("hides its words from sight and leaves them to a screen reader", () => {
    expect(recipe.base).toStrictEqual({ srOnly: true });
  });

  it("offers the one axis hidden text takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["focusable"]);
    expect(valuesOf(recipe, "focusable")).toStrictEqual(["true"]);
  });

  it("brings focusable text into view for as long as focus is on it", () => {
    expect(recipe.variants?.["focusable"]).toMatchObject({
      true: { _focusVisible: { position: "fixed", srOnly: false, zIndex: "skipNav" } },
    });
  });

  it("tracks the tag a consumer writes it under", () => {
    expect(recipe.jsx).toStrictEqual([/^VisuallyHidden$/u]);
  });
});
