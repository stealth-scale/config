import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import { switcher } from "#patterns/switcher.ts";

describe("switcher", () => {
  it("switches at the medium size with the medium gap when nothing is stated", () => {
    expect(switcher()).toStrictEqual({
      "& > *": { flexBasis: "calc((token(sizes.md, md) - 100%) * 999)", flexGrow: 1 },
      display: "flex",
      flexWrap: "wrap",
      gap: "gap.md",
    });
  });

  it("switches at the length it was given", () => {
    expect(switcher({ gap: "gap.sm", threshold: "40rem" })).toMatchObject({
      "& > *": { flexBasis: "calc((40rem - 100%) * 999)" },
      gap: "gap.sm",
    });
  });

  it("switches at the size token it was given once per breakpoint", () => {
    expect(switcher({ threshold: { base: "sm", md: "lg" } })).toMatchObject({
      "& > *": {
        flexBasis: {
          base: "calc((token(sizes.sm, sm) - 100%) * 999)",
          md: "calc((token(sizes.lg, lg) - 100%) * 999)",
        },
      },
    });
  });

  it("passes the recipe checks at its default threshold", () => {
    expect(recipeViolations(defineRecipe({ base: switcher(), className: "x" }))).toStrictEqual([]);
  });
});
