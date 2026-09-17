import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#card/card.recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe)).toStrictEqual([]);
  });

  it("styles the root and the three bands", () => {
    expect(recipe.slots).toStrictEqual(["root", "header", "content", "footer"]);
  });

  it("offers a size axis and a look axis", () => {
    expect(axesOf(recipe)).toStrictEqual(["size", "variant"]);
  });

  it("draws a medium elevated card when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "elevated" });
  });

  it("offers three looks and three sizes", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["elevated", "outline", "subtle"]);
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("sets the header's heading per size", () => {
    expect(recipe.variants?.size.lg.header).toStrictEqual({ textStyle: "heading.md" });
    expect(recipe.variants?.size.sm.header).toStrictEqual({ textStyle: "label.lg" });
  });
});
