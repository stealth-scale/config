/**
 * States Steel: an enterprise product on plain greys with a cobalt blue, square corners and IBM
 * Plex.
 *
 * @remarks
 *   Every ramp has ten steps keyed 10 to 100 and is read in both modes. The corners are square. The
 *   gray variant is derived from this theme.
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { semanticTokens } from "#steel/semantic-tokens.ts";
import { textStyles } from "#steel/text-styles.ts";
import { tokens } from "#steel/tokens.ts";

/**
 * Draws an enterprise product on plain greys with a cobalt blue, square corners and IBM Plex.
 */
export const steel: Theme = defineTheme({
  fonts: ["@fontsource-variable/ibm-plex-sans", "@fontsource/ibm-plex-mono"],
  name: "steel",
  semanticTokens,
  textStyles,
  tokens,
});
