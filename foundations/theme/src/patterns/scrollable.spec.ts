import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import { scrollable } from "#patterns/scrollable.ts";

describe("scrollable", () => {
  it("scrolls vertically when nothing is stated", () => {
    expect(scrollable()).toStrictEqual({ overflowX: "hidden", overflowY: "auto" });
  });

  it("scrolls horizontally when asked", () => {
    expect(scrollable({ direction: "horizontal" })).toStrictEqual({
      overflowX: "auto",
      overflowY: "hidden",
    });
  });

  it("scrolls on both axes when asked", () => {
    expect(scrollable({ direction: "both" })).toStrictEqual({ overflow: "auto" });
  });

  it("hides the scrollbar in every engine when asked", () => {
    expect(scrollable({ hideScrollbar: true })).toMatchObject({
      "&::-webkit-scrollbar": { display: "none" },
      scrollbarWidth: "none",
    });
  });

  it("passes the recipe checks with the scrollbar hidden", () => {
    const recipe = defineRecipe({ base: scrollable({ hideScrollbar: true }), className: "x" });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });
});
