/**
 * Describes what a theme changes about a recipe, which is anything but the two keys that belong to
 * the component.
 *
 * @remarks
 *   `className` decides what every class a recipe emits is called, and the classes are already in
 *   the markup when a theme is read, so renaming it orphans every one of them. `slots` is a list,
 *   and a list under `extend` is appended to rather than replaced, so a restated one names every
 *   slot twice. Both fail without a report, so both are refused by type.
 */

import { type Recipe, type SlotRecipe } from "#authoring/recipe.ts";

/**
 * Refuses the two keys a theme never restates.
 */
interface Owned {
  /**
   * Never stated. The component decides what its classes are called.
   */
  className?: never;

  /**
   * Never stated. The component's anatomy decides what its slots are.
   */
  slots?: never;
}

/**
 * Describes a theme's change to a recipe that draws one element.
 */
export type RecipeExtension = Omit<Partial<Recipe>, "className" | "slots"> & Owned;

/**
 * Describes a theme's change to a recipe that draws several parts, keyed by slot where the change
 * is a style.
 */
export type SlotRecipeExtension = Omit<Partial<SlotRecipe>, "className" | "slots"> & Owned;
