import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import { reel } from "#patterns/reel.ts";

describe("reel", () => {
  it("scrolls sideways and snaps each item when nothing is stated", () => {
    expect(reel()).toStrictEqual({
      "& > *": { flexBasis: "auto", flexGrow: 0, flexShrink: 0, scrollSnapAlign: "start" },
      display: "flex",
      gap: "gap.md",
      overflowX: "auto",
      overflowY: "hidden",
      scrollSnapType: "x mandatory",
    });
  });

  it("gives every item the width it was given", () => {
    expect(reel({ gap: "gap.sm", itemWidth: "xs" })).toMatchObject({
      "& > *": { flexBasis: "xs" },
      gap: "gap.sm",
    });
  });

  it("passes the recipe checks", () => {
    expect(
      recipeViolations(defineRecipe({ base: reel({ itemWidth: "xs" }), className: "x" })),
    ).toStrictEqual([]);
  });
});
