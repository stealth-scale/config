import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#icon/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Icon"] })).toStrictEqual([]);
  });

  it("names its class icon", () => {
    expect(recipe.className).toBe("icon");
  });

  it("offers a mirrored axis and a motion axis and a size axis and a tone axis", () => {
    expect(axesOf(recipe)).toStrictEqual(["mirrored", "motion", "size", "tone"]);
  });

  it("follows the size of the text around it when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "inherit" });
  });

  it("offers the eight icon sizes and the inherited one", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual([
      "2xl",
      "3xl",
      "4xl",
      "inherit",
      "lg",
      "md",
      "sm",
      "xl",
      "xs",
    ]);
  });

  it("offers the current colour and the muted ink and the four statuses as tones", () => {
    expect(valuesOf(recipe, "tone")).toStrictEqual([
      "current",
      "error",
      "info",
      "muted",
      "success",
      "warning",
    ]);
  });

  it("offers the three motions a mark takes", () => {
    expect(valuesOf(recipe, "motion")).toStrictEqual(["float", "spin", "twinkle"]);
  });

  it("flips a mirrored mark where the page reads right to left", () => {
    expect(recipe.variants?.mirrored.true).toStrictEqual({ _rtl: { transform: "scaleX(-1)" } });
  });

  it("tracks every tag whose name ends in Icon", () => {
    expect(recipe.jsx).toStrictEqual([/Icon$/u]);
  });
});
