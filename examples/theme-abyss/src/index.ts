/**
 * States Abyss: Fathom taken into deep water. The same teal, now the accent, an indigo brand on
 * pages nearer black and nearer white, a sharper corner, and every button's label tracked wide.
 * Everything else is Fathom's, which Abyss extends rather than restates.
 *
 * @packageDocumentation
 */

import { fathom } from "@stealthscale/example-theme-fathom";
import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { extension as button } from "#recipes/button.ts";
import { semanticTokens } from "#semantic-tokens.ts";

/**
 * Draws Fathom in deep water, derived from it.
 */
export const abyss: Theme = defineTheme({
  extends: fathom,
  name: "abyss",
  recipes: { button },
  semanticTokens,
});
