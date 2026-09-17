import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import { cluster } from "#patterns/cluster.ts";

describe("cluster", () => {
  it("wraps centred items with the small gap when nothing is stated", () => {
    expect(cluster()).toStrictEqual({
      alignItems: "center",
      display: "flex",
      flexWrap: "wrap",
      gap: "gap.sm",
    });
  });

  it("takes the alignment and the gap it was given", () => {
    expect(cluster({ align: "start", gap: "gap.md", justify: "end" })).toMatchObject({
      alignItems: "start",
      gap: "gap.md",
      justifyContent: "end",
    });
  });

  it("passes the recipe checks", () => {
    expect(recipeViolations(defineRecipe({ base: cluster(), className: "x" }))).toStrictEqual([]);
  });
});
