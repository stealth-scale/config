import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import { floating, overlay } from "#authoring/recipes/floating.ts";

describe("floating", () => {
  it("draws a popover on the popover surface at the popover rung", () => {
    expect(floating()).toMatchObject({
      background: "bg.popover",
      borderRadius: "l3",
      boxShadow: "lg",
      zIndex: "popover",
    });
  });

  it("scales and fades a popover in and out", () => {
    expect(floating()).toMatchObject({
      _closed: { animationStyle: "scale-fade.out" },
      _open: { animationStyle: "scale-fade.in" },
    });
  });

  it("draws a backdrop over the whole viewport at the overlay rung", () => {
    expect(overlay()).toMatchObject({
      background: "bg.backdrop",
      inset: "0",
      position: "fixed",
      zIndex: "overlay",
    });
  });

  it("fades a backdrop in and out", () => {
    expect(overlay()).toMatchObject({
      _closed: { animationStyle: "fade.out" },
      _open: { animationStyle: "fade.in" },
    });
  });

  it("passes the recipe checks for a popover and for a backdrop", () => {
    expect(recipeViolations(defineRecipe({ base: floating(), className: "x" }))).toStrictEqual([]);
    expect(recipeViolations(defineRecipe({ base: overlay(), className: "x" }))).toStrictEqual([]);
  });
});
