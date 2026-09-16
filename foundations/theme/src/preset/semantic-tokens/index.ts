/**
 * Assembles the semantic tokens: the values that change with the color mode, and the sizes and
 * spacing a recipe reads by use.
 *
 * @remarks
 *   Typed as the tokens a root theme states, so the foundation is held to the same contract as
 *   every theme: a role left out of a palette here fails to compile.
 */

import { type ThemeTokens } from "#authoring/contract.ts";
import { families } from "#preset/semantic-tokens/colors.ts";
import { palettes } from "#preset/semantic-tokens/palettes.ts";
import { radii } from "#preset/semantic-tokens/radii.ts";
import { shadows } from "#preset/semantic-tokens/shadows.ts";
import { sizes } from "#preset/semantic-tokens/sizes.ts";
import { spacing } from "#preset/semantic-tokens/spacing.ts";

/**
 * Lists every semantic token, by category.
 */
export const semanticTokens: ThemeTokens = {
  colors: { ...families, ...palettes },
  radii,
  shadows,
  sizes,
  spacing,
};
