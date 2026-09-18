/**
 * States Pebble: a web application in plain neutrals with a black primary button, ten-pixel corners
 * and Geist.
 *
 * @remarks
 *   Every ramp has eleven steps keyed 50 to 950 in OKLCH, read in both modes. The primary palette
 *   is the neutral one, so the primary button is near black on white and near white on near black.
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { semanticTokens } from "#pebble/semantic-tokens.ts";
import { textStyles } from "#pebble/text-styles.ts";
import { tokens } from "#pebble/tokens.ts";

/**
 * Draws a web application in plain neutrals with a black primary button, ten-pixel corners and
 * Geist.
 */
export const pebble: Theme = defineTheme({
  fonts: ["@fontsource-variable/geist", "@fontsource-variable/geist-mono"],
  name: "pebble",
  semanticTokens,
  textStyles,
  tokens,
});
