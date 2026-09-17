/**
 * Publishes what a component imports: the generated runtime, the binding, the provider that
 * switches a page, and the two attributes it switches with. Nothing from the authoring entry is
 * here. A recipe file imports the vocabulary from `./authoring`, and a component imports the
 * runtime from here, so the compiler's configuration never reaches the generated runtime through a
 * recipe.
 *
 * @packageDocumentation
 */

export { type RecipeProps } from "#authoring/recipe.ts";
export {
  createRecipeContext,
  createSlotRecipeContext,
  type RecipeBinding,
  type RootProvider,
  type RootProviderOptions,
  type SlotRecipeBinding,
} from "#context.ts";
export { ThemeProvider, type ThemeProviderProps } from "#provider.tsx";
export * from "#runtime.ts";
export { type ColorMode, type Switched, useTheme } from "#use-theme.ts";
