import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";
import { defineSlotRecipe } from "@stealthscale/theme/authoring";

import { extension } from "#recipes/card.ts";

describe("extension", () => {
  it("writes no value a theme cannot move", () => {
    const recipe = defineSlotRecipe({
      base: extension.base,
      className: "card",
      slots: ["header", "root"],
    });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });

  it("sets the header in capitals and lifts an elevated card further", () => {
    expect(extension.base).toMatchObject({ header: { textTransform: "uppercase" } });
    expect(extension.variants).toStrictEqual({
      variant: { elevated: { root: { boxShadow: "xl" } } },
    });
  });
});
