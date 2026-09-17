import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import { cornerVariants, ratioVariants } from "#authoring/recipes/shape.ts";

describe("shape", () => {
  it("offers every shape the theme states when a recipe names none", () => {
    expect(Object.keys(ratioVariants())).toHaveLength(7);
    expect(ratioVariants()).toMatchObject({ square: { aspectRatio: "square" } });
  });

  it("offers the shapes a recipe names", () => {
    expect(ratioVariants(["square", "video"])).toStrictEqual({
      square: { aspectRatio: "square" },
      video: { aspectRatio: "video" },
    });
  });

  it("offers every corner the theme states when a recipe names none", () => {
    expect(cornerVariants()).toStrictEqual({
      full: { borderRadius: "full" },
      l1: { borderRadius: "l1" },
      l2: { borderRadius: "l2" },
      l3: { borderRadius: "l3" },
    });
  });

  it("reads tokens the foundation defines at every shape and corner", () => {
    const recipe = defineRecipe({
      base: { display: "block" },
      className: "x",
      variants: { radius: cornerVariants(), ratio: ratioVariants() },
    });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });
});
