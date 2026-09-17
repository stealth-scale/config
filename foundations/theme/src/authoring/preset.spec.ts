import { describe, expect, it } from "vitest";

import { definePreset } from "#authoring/preset.ts";
import { defineRecipe, defineSlotRecipe } from "#authoring/recipe.ts";

describe("definePreset", () => {
  it("returns the preset it was handed", () => {
    const preset = { name: "@acme/kit" };

    expect(definePreset(preset)).toBe(preset);
  });

  it("registers a recipe as defineRecipe returns it", () => {
    const button = defineRecipe({
      className: "button",
      compoundVariants: [{ css: { fontWeight: "bold" }, size: "lg" }],
      variants: { size: { lg: {}, md: {} } },
    });
    const preset = definePreset({ name: "@acme/kit", theme: { extend: { recipes: { button } } } });

    expect(preset.theme?.extend?.recipes?.["button"]).toBe(button);
  });

  it("registers a slot recipe as defineSlotRecipe returns it", () => {
    const dialog = defineSlotRecipe({ className: "dialog", slots: ["content", "title"] });
    const preset = definePreset({
      name: "@acme/kit",
      theme: { extend: { slotRecipes: { dialog } } },
    });

    expect(preset.theme?.extend?.slotRecipes?.["dialog"]).toBe(dialog);
  });
});
