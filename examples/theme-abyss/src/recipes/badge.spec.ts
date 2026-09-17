import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";
import { defineRecipe } from "@stealthscale/theme/authoring";

import { extension } from "#recipes/badge.ts";

describe("extension", () => {
  it("writes no value a theme cannot move", () => {
    const recipe = defineRecipe({ base: extension.base, className: "badge" });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });

  it("sets the label in capitals", () => {
    expect(extension.base).toStrictEqual({ textTransform: "uppercase" });
  });
});
