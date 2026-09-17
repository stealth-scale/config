/**
 * Defines a preset: the values, recipes and conditions a package publishes for an application's
 * compiler to install.
 *
 * @remarks
 *   The compiler's preset type writes the record a recipe is registered in over every possible
 *   variant, and a recipe as `defineRecipe` returns it keeps the literal types of its own, so the
 *   one is refused as a value of the other. A preset is typed here over the members every recipe
 *   and every extension share, and handed to the compiler as the preset it reads.
 */

import { type Preset } from "#pandacss.ts";

export type { Preset } from "#pandacss.ts";

/**
 * Describes a recipe as a preset registers it: what `defineRecipe` and `defineSlotRecipe` return,
 * or what a theme's extension states, read by the members the compiler merges.
 */
export interface Registrable {
  /**
   * The styles every element starts from, for one element or keyed by slot.
   */
  base?: object | undefined;

  /**
   * The prefix of every class the recipe emits. A theme's extension states none, because the
   * component owns it.
   */
  className?: string | undefined;

  /**
   * The combinations that draw something no single variant does.
   */
  compoundVariants?: readonly object[] | undefined;

  /**
   * The value of each axis where a caller picks none.
   */
  defaultVariants?: object | undefined;

  /**
   * Why the recipe exists.
   */
  description?: string | undefined;

  /**
   * Every tag that carries the recipe's variant props.
   */
  jsx?: ReadonlyArray<RegExp | string> | undefined;

  /**
   * The parts a slot recipe styles.
   */
  slots?: readonly string[] | undefined;

  /**
   * Variants written into the stylesheet whether or not a source file reads them.
   */
  staticCss?: readonly unknown[] | undefined;

  /**
   * Each axis the recipe offers, against the values it takes.
   */
  variants?: object | undefined;
}

/**
 * Describes what the compiler accepts under a preset's `theme.extend`, before the recipes are
 * retyped.
 */
type Extended = NonNullable<NonNullable<Preset["theme"]>["extend"]>;

/**
 * Describes what a preset adds under `theme.extend`, with each recipe typed as this package
 * registers it.
 */
export type PresetExtension = {
  /**
   * The recipes that draw one element, keyed by the name a theme extends each under.
   */
  recipes?: Readonly<Record<string, Registrable>> | undefined;

  /**
   * The recipes that draw several parts, keyed the same way.
   */
  slotRecipes?: Readonly<Record<string, Registrable>> | undefined;
} & Omit<Extended, "recipes" | "slotRecipes">;

/**
 * Describes the theme section of a preset, which adds under `extend` so it merges over the presets
 * below it.
 */
interface Themed {
  /**
   * Everything the preset adds to the theme.
   */
  extend?: PresetExtension | undefined;
}

/**
 * Describes what a package publishes under `./theme`: the compiler's preset, with every recipe
 * typed as this package defines it.
 */
export type PresetConfig = {
  /**
   * The values, compositions and recipes the preset adds to the theme.
   */
  theme?: Themed | undefined;
} & Omit<Preset, "theme">;

/**
 * Returns a preset unchanged, typed as the compiler reads it.
 *
 * @remarks
 *   The compiler's own helper is the same identity function, and importing the compiler for it
 *   would put the compiler in the manifest of every package that publishes a preset.
 */
export function definePreset(preset: PresetConfig): Preset {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a registered recipe is what defineRecipe returned or what a theme extends, and the compiler merges either as a partial recipe config
  return preset as Preset;
}
