/**
 * States Graphite: a developer's product on cool greys, with a blue accent, a green call to action
 * and Mona Sans.
 *
 * @remarks
 *   The neutral ramp has fourteen steps and each hue ten, with a light ramp and a dark one for
 *   every hue. The dimmed and the high-contrast variants are derived from this theme.
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { semanticTokens } from "#graphite/semantic-tokens.ts";
import { textStyles } from "#graphite/text-styles.ts";
import { tokens } from "#graphite/tokens.ts";

/**
 * Draws a developer's product on cool greys, with a blue accent, a green call to action and Mona
 * Sans.
 */
export const graphite: Theme = defineTheme({
  fonts: ["@fontsource-variable/mona-sans"],
  name: "graphite",
  semanticTokens,
  textStyles,
  tokens,
});
