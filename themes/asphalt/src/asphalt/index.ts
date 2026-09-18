/**
 * States Asphalt: a mobility product in black and white, with a blue accent, eight-pixel corners
 * and Inter.
 *
 * @remarks
 *   The primary palette is the neutral one: a black button on a white page, and a light grey button
 *   on a near-black page. Every hue has ten steps and most have a dark ramp of their own.
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { semanticTokens } from "#asphalt/semantic-tokens.ts";
import { textStyles } from "#asphalt/text-styles.ts";
import { tokens } from "#asphalt/tokens.ts";

/**
 * Draws a mobility product in black and white, with a blue accent, eight-pixel corners and Inter.
 */
export const asphalt: Theme = defineTheme({
  fonts: ["@fontsource-variable/inter"],
  name: "asphalt",
  semanticTokens,
  textStyles,
  tokens,
});
