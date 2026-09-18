/**
 * States Lantern: an enterprise product on a light grey page with a daybreak blue, six-pixel
 * corners and a system face.
 *
 * @remarks
 *   Every hue has ten steps keyed 1 to 10, with a dark ramp of its own nested under the light one.
 *   The neutral ramp is built from the composited surfaces, fills, inks and lines of each mode. The
 *   page is a light grey and the panels are white.
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { semanticTokens } from "#lantern/semantic-tokens.ts";
import { textStyles } from "#lantern/text-styles.ts";
import { tokens } from "#lantern/tokens.ts";

/**
 * Draws an enterprise product on a light grey page with a daybreak blue, six-pixel corners and a
 * system face.
 */
export const lantern: Theme = defineTheme({
  name: "lantern",
  semanticTokens,
  textStyles,
  tokens,
});
