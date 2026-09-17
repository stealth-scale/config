/**
 * Holds a theme, a recipe and a preset to the theme contract, and reads what a recipe declares and
 * what a rendered component drew. Each gate returns violations rather than a verdict, so one
 * assertion reports which role, pair or file broke the contract. No reader reads a computed style,
 * because a unit test has no compiled stylesheet.
 *
 * @packageDocumentation
 */

export { type BoundChecks, boundViolations, type Draw } from "#bound.ts";
export { compoundClass, recipeClass, slotClass, slotVariantClass, variantClass } from "#classes.ts";
export { THRESHOLDS, type Thresholds } from "#contrast.ts";
export { type PresetCheck, type PresetChecks, presetViolations } from "#preset-checks.ts";
export { type RecipeCheck, type RecipeChecks, recipeViolations } from "#recipe-checks.ts";
export {
  axesOf,
  byStep,
  type Declared,
  defaultsOf,
  scaleOf,
  slotsOf,
  type Slotted,
  valuesOf,
} from "#recipe.ts";
export { classesOf, recipeClasses, recipeElement, slotClasses, slotElement } from "#rendered.ts";
export {
  extendedRecipes,
  fontsOf,
  palettesOf,
  publishedRecipes,
  resolved,
  type Resolving,
} from "#theme.ts";
export { type ThemeCheck, type ThemeChecks, violations } from "#violations.ts";
