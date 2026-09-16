/**
 * Publishes what a component imports: the generated runtime, the binding, and the two attributes
 * a page is switched with.
 *
 * @remarks
 *   Nothing from the authoring entry is here. A recipe file imports the vocabulary from
 *   `./authoring`, and a component imports the runtime from here, so the compiler's
 *   configuration never reaches the generated runtime through a recipe.
 * @packageDocumentation
 */

export { type RecipeProps } from "#authoring/recipe.ts";
export {
  createRecipeContext,
  createSlotRecipeContext,
  type RecipeContext,
  type SlotRecipeContext,
} from "#context.ts";
export * from "#runtime.ts";
