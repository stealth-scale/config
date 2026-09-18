/**
 * States Compass: a team product on soft neutrals with a bright blue, a lime success and small
 * corners.
 *
 * @remarks
 *   Every hue ramp runs 100 to 1000 with two half steps, read in both modes, and the neutral ramp
 *   has a light scale and a dark one. The high-contrast variant is derived from this theme.
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { semanticTokens } from "#compass/semantic-tokens.ts";
import { textStyles } from "#compass/text-styles.ts";
import { tokens } from "#compass/tokens.ts";

/**
 * Draws a team product on soft neutrals with a bright blue, a lime success and small corners.
 */
export const compass: Theme = defineTheme({
  fonts: ["@fontsource-variable/ubuntu-sans", "@fontsource-variable/ubuntu-sans-mono"],
  name: "compass",
  semanticTokens,
  textStyles,
  tokens,
});
