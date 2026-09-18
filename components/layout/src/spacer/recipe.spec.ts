import { describe, expect, it } from "vitest";

import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import { recipe } from "#spacer/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Spacer"] })).toStrictEqual([]);
  });

  it("names its class spacer", () => {
    expect(recipe.className).toBe("spacer");
  });

  it("offers no axis because there is nothing about empty room a caller picks", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("grows into whatever a stack has not given its other children", () => {
    expect(recipe.base).toMatchObject({ flexBasis: "0", flexGrow: "1" });
  });

  it("tracks the tag a consumer writes it under", () => {
    expect(recipe.jsx).toStrictEqual([/^Spacer$/u]);
  });
});
