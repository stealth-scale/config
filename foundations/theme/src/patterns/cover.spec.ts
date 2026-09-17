import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import { cover } from "#patterns/cover.ts";

describe("cover", () => {
  it("fills the viewport with the large inset when nothing is stated", () => {
    expect(cover()).toMatchObject({
      display: "flex",
      flexDirection: "column",
      minHeight: "100dvh",
      padding: "inset.lg",
    });
  });

  it("centres the marked child and pushes the rest to the edges", () => {
    expect(cover()).toMatchObject({
      "& > :first-child:not([data-centered])": { marginBlockStart: "0" },
      "& > :last-child:not([data-centered])": { marginBlockEnd: "0" },
      "& > [data-centered]": { marginBlock: "auto" },
      "& > *": { marginBlock: "inset.lg" },
    });
  });

  it("takes the height and the space it was given", () => {
    expect(cover({ minHeight: "sm", space: "inset.md" })).toMatchObject({
      "& > *": { marginBlock: "inset.md" },
      minHeight: "sm",
      padding: "inset.md",
    });
  });

  it("passes the recipe checks", () => {
    expect(recipeViolations(defineRecipe({ base: cover(), className: "x" }))).toStrictEqual([]);
  });
});
