/**
 * States Prism: a creative tool on cool greys with an indigo-blue accent, eight-pixel corners and
 * Source Sans.
 *
 * @remarks
 *   Every hue has sixteen steps keyed 100 to 1600 and the neutral ramp thirteen from 25 to 1000,
 *   each with a light ramp and a dark one nested under it. Every hue of the contract has a ramp of
 *   its own.
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { semanticTokens } from "#prism/semantic-tokens.ts";
import { textStyles } from "#prism/text-styles.ts";
import { tokens } from "#prism/tokens.ts";

/**
 * Draws a creative tool on cool greys with an indigo-blue accent, eight-pixel corners and Source
 * Sans.
 */
export const prism: Theme = defineTheme({
  fonts: ["@fontsource-variable/source-sans-3", "@fontsource-variable/source-code-pro"],
  name: "prism",
  semanticTokens,
  textStyles,
  tokens,
});
