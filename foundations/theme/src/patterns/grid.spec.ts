import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import { grid, simpleGrid } from "#patterns/grid.ts";

describe("grid", () => {
  it("draws a grid with the medium gap when nothing is stated", () => {
    expect(grid()).toStrictEqual({ display: "grid", gap: "gap.md" });
  });

  it("counts the columns it was given", () => {
    expect(grid({ columns: 3 })).toMatchObject({
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    });
  });

  it("counts the columns once per breakpoint", () => {
    expect(grid({ columns: { base: 1, md: 3 } })).toMatchObject({
      gridTemplateColumns: { base: "repeat(1, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))" },
    });
  });

  it("fits as many columns as a size token allows", () => {
    expect(grid({ minChildWidth: "40" })).toMatchObject({
      gridTemplateColumns: "repeat(auto-fit, minmax(token(sizes.40, 40), 1fr))",
    });
  });

  it("fits as many columns as a length allows", () => {
    expect(grid({ minChildWidth: "12rem" })).toMatchObject({
      gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
    });
  });

  it("prefers the count when both a count and a narrowest width are given", () => {
    expect(grid({ columns: 2, minChildWidth: "40" })).toMatchObject({
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    });
  });

  it("leaves the gap to the caller when either separate gap is stated", () => {
    expect(grid({ columnGap: "gap.sm" })).toStrictEqual({ columnGap: "gap.sm", display: "grid" });
    expect(grid({ gap: "gap.lg", rowGap: "gap.sm" })).toStrictEqual({
      display: "grid",
      gap: "gap.lg",
      rowGap: "gap.sm",
    });
  });

  it("draws a simple grid the same way with one gap", () => {
    expect(simpleGrid({ columns: 4, gap: "gap.xs" })).toStrictEqual(
      grid({ columns: 4, gap: "gap.xs" }),
    );
  });

  it("passes the recipe checks counted and fitted to a size token", () => {
    expect(
      recipeViolations(defineRecipe({ base: grid({ columns: 3 }), className: "x" })),
    ).toStrictEqual([]);
    expect(
      recipeViolations(defineRecipe({ base: simpleGrid({ minChildWidth: "xs" }), className: "x" })),
    ).toStrictEqual([]);
  });
});
