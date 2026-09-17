import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#button/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Button", "IconButton"] })).toStrictEqual([]);
  });

  it("names its class button", () => {
    expect(recipe.className).toBe("button");
  });

  it("offers the five axes a button takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["effect", "shape", "size", "status", "variant"]);
  });

  it("draws the middle size in the solid look when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "solid" });
  });

  it("offers the eight control sizes", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual([
      "2xl",
      "3xl",
      "4xl",
      "lg",
      "md",
      "sm",
      "xl",
      "xs",
    ]);
  });

  it("offers the six looks and the glass", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual([
      "ghost",
      "glass",
      "outline",
      "plain",
      "solid",
      "subtle",
      "surface",
    ]);
  });

  it("offers the four statuses", () => {
    expect(valuesOf(recipe, "status")).toStrictEqual(["error", "info", "success", "warning"]);
  });

  it("offers the square shape", () => {
    expect(valuesOf(recipe, "shape")).toStrictEqual(["square"]);
  });

  it("offers the glow as an effect", () => {
    expect(valuesOf(recipe, "effect")).toStrictEqual(["glow"]);
  });

  it("tracks every tag whose name ends in Button", () => {
    expect(recipe.jsx).toStrictEqual([/Button$/u]);
  });
});
