/**
 * Publishes the vocabulary a recipe, a theme and an application are written in, and nothing that
 * runs in a browser.
 *
 * @remarks
 *   Every name here is read at build time. Separate from the package's own entry because that
 *   entry re-exports the generated runtime, and the compiler's configuration reaches this package
 *   through whatever a theme imports. A theme importing the entry would put every generated file
 *   behind the configuration, and regenerating them would read as the configuration changing.
 * @packageDocumentation
 */

export { type Application } from "#authoring/application.ts";
export {
  BACKGROUNDS,
  BORDERS,
  contract,
  type ContractedVariant,
  type Family,
  type Filled,
  FOREGROUNDS,
  type Hue,
  type HuePalette,
  HUES,
  type Mode,
  type Moded,
  MODES,
  type Palette,
  type PaletteRoles,
  PALETTES,
  type Referenced,
  type Role,
  ROLES,
  type SemanticPalette,
  type Status,
  STATUSES,
  type ThemeColors,
  type ThemeTokens,
} from "#authoring/contract.ts";
export { contrast, type Level, luminance, readable } from "#authoring/contrast.ts";
export { type RecipeExtension, type SlotRecipeExtension } from "#authoring/extension.ts";
export { deepMerge } from "#authoring/merge.ts";
export { definePreset, type Preset } from "#authoring/preset.ts";
export {
  defineRecipe,
  defineSlotRecipe,
  defineStyles,
  type Recipe,
  type RecipeProps,
  type SlotRecipe,
} from "#authoring/recipe.ts";
export * from "#authoring/recipes/index.ts";
export {
  defineTheme,
  type DerivedThemeConfig,
  type RootThemeConfig,
  type Theme,
  type ThemeConfig,
} from "#authoring/theme.ts";
export * from "#patterns/index.ts";
export * from "#scales/index.ts";
