import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import {
  textSizes,
  TONES,
  toneVariants,
  truncate,
  WEIGHTS,
  weightVariants,
} from "#authoring/recipes/text.ts";

describe("text", () => {
  it("offers every step a role has when a recipe names none", () => {
    expect(Object.keys(textSizes("body"))).toStrictEqual(["xs", "sm", "md", "lg", "xl"]);
    expect(Object.keys(textSizes("heading"))).toHaveLength(8);
    expect(Object.keys(textSizes("code"))).toStrictEqual(["sm", "md"]);
  });

  it("reads the text style of the role and the step", () => {
    expect(textSizes("body", ["md"])).toStrictEqual({ md: { textStyle: "body.md" } });
  });

  it("reads a foreground role for every ink", () => {
    expect(toneVariants(["default", "error"])).toStrictEqual({
      default: { color: "fg" },
      error: { color: "fg.error" },
    });
    expect(Object.keys(toneVariants())).toStrictEqual([...TONES]);
  });

  it("reads the weight token of the same name for every weight", () => {
    expect(weightVariants(["bold"])).toStrictEqual({ bold: { fontWeight: "bold" } });
    expect(Object.keys(weightVariants())).toStrictEqual([...WEIGHTS]);
  });

  it("cuts a line to its box with an ellipsis", () => {
    expect(truncate()).toStrictEqual({
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    });
  });

  it("reads tokens the foundation defines at every role and ink", () => {
    const recipe = defineRecipe({
      base: truncate(),
      className: "x",
      variants: {
        size: textSizes("heading"),
        tone: toneVariants(),
        weight: weightVariants(),
      },
    });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });
});
