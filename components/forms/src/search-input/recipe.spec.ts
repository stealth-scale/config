import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#search-input/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["SearchInput"] })).toStrictEqual([]);
  });

  it("names its class search-input", () => {
    expect(recipe.className).toBe("search-input");
  });

  it("draws the three parts a search field is composed of", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual(["clear", "field", "root"]);
  });

  it("offers the one axis a search field takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("draws the middle size when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("offers the eight sizes every component shares", () => {
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

  it("leaves the field room at its end for exactly what the control occupies", () => {
    expect(recipe.variants?.["size"]?.["md"]).toStrictEqual({
      clear: { boxSize: "control.md", padding: "0" },
      field: { paddingInlineEnd: "{sizes.control.md}" },
    });
  });

  it("states none of the field's own surface because the text field's recipe owns it", () => {
    expect(recipe.base?.["field"]).toBeUndefined();
  });

  it("tracks the tag named SearchInput", () => {
    expect(recipe.jsx).toStrictEqual([/^SearchInput$/u]);
  });
});
