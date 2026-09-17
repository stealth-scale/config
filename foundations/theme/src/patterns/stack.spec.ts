import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import { hstack, stack, vstack } from "#patterns/stack.ts";

describe("stack", () => {
  it("draws a column with the medium gap when nothing is stated", () => {
    expect(stack()).toStrictEqual({ display: "flex", flexDirection: "column", gap: "gap.md" });
  });

  it("takes the direction and the gap it was given", () => {
    expect(stack({ direction: "row", gap: "gap.sm" })).toStrictEqual({
      display: "flex",
      flexDirection: "row",
      gap: "gap.sm",
    });
  });

  it("aligns and justifies the children when asked", () => {
    expect(stack({ align: "center", justify: "space-between" })).toMatchObject({
      alignItems: "center",
      justifyContent: "space-between",
    });
  });

  it("draws a row with centred children for an hstack", () => {
    expect(hstack()).toMatchObject({ alignItems: "center", flexDirection: "row" });
  });

  it("draws a column with centred children for a vstack", () => {
    expect(vstack({ gap: "gap.lg" })).toMatchObject({
      alignItems: "center",
      flexDirection: "column",
      gap: "gap.lg",
    });
  });

  it("passes the recipe checks in every direction", () => {
    for (const base of [stack(), hstack(), vstack({ gap: "gap.lg" })]) {
      expect(recipeViolations(defineRecipe({ base, className: "x" }))).toStrictEqual([]);
    }
  });
});
