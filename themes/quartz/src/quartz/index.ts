/**
 * States Quartz: a productivity suite on plain greys with a deep blue brand, four-pixel corners and
 * Roboto.
 *
 * @remarks
 *   The brand ramp has sixteen steps keyed 160 to 10, the neutral ramp fifty steps of grey with
 *   white and black at its ends, and each shared hue twelve steps from tint60 to shade50. Every
 *   ramp is read in both modes.
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { semanticTokens } from "#quartz/semantic-tokens.ts";
import { textStyles } from "#quartz/text-styles.ts";
import { tokens } from "#quartz/tokens.ts";

/**
 * Draws a productivity suite on plain greys with a deep blue brand, four-pixel corners and Roboto.
 */
export const quartz: Theme = defineTheme({
  fonts: ["@fontsource-variable/roboto"],
  name: "quartz",
  semanticTokens,
  textStyles,
  tokens,
});
