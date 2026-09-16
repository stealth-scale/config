import { describe, expect, expectTypeOf, it } from "vitest";

import {
  defineRecipe,
  defineSlotRecipe,
  defineStyles,
  type RecipeProps,
} from "#authoring/recipe.ts";

describe("defineRecipe", () => {
  it("returns the recipe it was handed", () => {
    const recipe = { base: { color: "fg" }, className: "button" };

    expect(defineRecipe(recipe)).toBe(recipe);
  });

  it("keeps the literal values of each variant", () => {
    const recipe = defineRecipe({
      className: "button",
      variants: { variant: { ghost: {}, solid: {} } },
    });

    expect(Object.keys(recipe.variants?.variant ?? {}).toSorted()).toStrictEqual([
      "ghost",
      "solid",
    ]);

    expectTypeOf<RecipeProps<typeof recipe>["variant"]>().toEqualTypeOf<
      "ghost" | "solid" | undefined
    >();
  });

  it("returns the slot recipe it was handed", () => {
    const recipe = { className: "dialog", slots: ["content", "title"] };

    expect(defineSlotRecipe(recipe)).toBe(recipe);
  });

  it("keeps the slots a slot recipe was given", () => {
    const recipe = defineSlotRecipe({ className: "dialog", slots: ["content", "title"] });

    expect(recipe.slots).toStrictEqual(["content", "title"]);
  });

  it("takes the props of a slot recipe from its variants", () => {
    const recipe = defineSlotRecipe({
      className: "dialog",
      slots: ["content"],
      variants: { size: { lg: {}, md: {} } },
    });

    expect(recipe.className).toBe("dialog");

    expectTypeOf<RecipeProps<typeof recipe>["size"]>().toEqualTypeOf<"lg" | "md" | undefined>();
  });

  it("returns the styles it was handed", () => {
    const styles = { color: "fg" };

    expect(defineStyles(styles)).toBe(styles);
  });
});
