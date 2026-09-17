import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#button/button.recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe)).toStrictEqual([]);
  });

  it("offers a size axis and a status axis and a look axis", () => {
    expect(axesOf(recipe)).toStrictEqual(["size", "status", "variant"]);
  });

  it("draws a medium solid button when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "solid" });
  });

  it("offers four looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["ghost", "outline", "solid", "subtle"]);
  });

  it("offers the four statuses", () => {
    expect(valuesOf(recipe, "status")).toStrictEqual(["error", "info", "success", "warning"]);
  });
});
