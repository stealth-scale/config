import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#kbd/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe)).toStrictEqual([]);
  });

  it("names its class kbd", () => {
    expect(recipe.className).toBe("kbd");
  });

  it("offers a size axis and a status axis and a look axis", () => {
    expect(axesOf(recipe)).toStrictEqual(["size", "status", "variant"]);
  });

  it("draws a middle raised key when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "raised" });
  });

  it("offers three sizes", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("offers the raised look beside three of the foundation's", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["outline", "plain", "raised", "subtle"]);
  });

  it("offers the four statuses", () => {
    expect(valuesOf(recipe, "status")).toStrictEqual(["error", "info", "success", "warning"]);
  });

  it("tracks every tag whose name ends in Kbd", () => {
    expect(recipe.jsx).toStrictEqual([/Kbd$/u]);
  });
});
