import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import { bento, bentoCell } from "#patterns/bento.ts";

describe("bento", () => {
  it("draws three dense columns with the medium gap when nothing is stated", () => {
    expect(bento()).toStrictEqual({
      display: "grid",
      gap: "gap.md",
      gridAutoFlow: "dense",
      gridAutoRows: "{sizes.32}",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    });
  });

  it("counts the columns once per breakpoint", () => {
    expect(bento({ columns: { base: 1, md: 4 } })).toMatchObject({
      gridTemplateColumns: { base: "repeat(1, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
    });
  });

  it("takes the gap and the row height it was given", () => {
    expect(bento({ gap: "gap.sm", rowHeight: "{sizes.40}" })).toMatchObject({
      gap: "gap.sm",
      gridAutoRows: "{sizes.40}",
    });
  });

  it("spans one column and one row for a tile that states nothing", () => {
    expect(bentoCell()).toStrictEqual({ gridColumn: "span 1", gridRow: "span 1" });
  });

  it("spans the columns and rows a tile states once per breakpoint", () => {
    expect(bentoCell({ columns: { base: 1, md: 2 }, rows: 2 })).toStrictEqual({
      gridColumn: { base: "span 1", md: "span 2" },
      gridRow: "span 2",
    });
  });

  it("passes the recipe checks for the box and for a tile", () => {
    expect(recipeViolations(defineRecipe({ base: bento(), className: "x" }))).toStrictEqual([]);
    expect(
      recipeViolations(defineRecipe({ base: bentoCell({ columns: 2 }), className: "x" })),
    ).toStrictEqual([]);
  });
});
