import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import { motion, motionVariants } from "#authoring/recipes/motion.ts";

describe("motion", () => {
  it("reads one animation style when open and another when closed", () => {
    expect(motion("fade.in", "fade.out")).toStrictEqual({
      _closed: { animationStyle: "fade.out" },
      _open: { animationStyle: "fade.in" },
    });
  });

  it("offers every motion when a recipe names none", () => {
    expect(Object.keys(motionVariants())).toHaveLength(8);
  });

  it("reads the entering style of a motion stated in two directions", () => {
    expect(motionVariants(["fade", "spin"])).toStrictEqual({
      fade: { animationStyle: "fade.in" },
      spin: { animationStyle: "spin" },
    });
  });

  it("reads animation styles the foundation defines", () => {
    const recipe = defineRecipe({
      base: motion("slide-fade.in", "slide-fade.out"),
      className: "x",
    });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });
});
