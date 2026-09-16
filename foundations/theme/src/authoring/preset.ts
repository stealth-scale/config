/**
 * Defines a preset: the values, recipes and conditions a package publishes for an application's
 * compiler to install.
 */

import { type Preset } from "#pandacss.ts";

export type { Preset } from "#pandacss.ts";

/**
 * Returns a preset unchanged, typed.
 *
 * @remarks
 *   The compiler's own helper is the same identity function, and importing the compiler for it
 *   would put the compiler in the manifest of every package that publishes a preset.
 */
export function definePreset(preset: Preset): Preset {
  return preset;
}
