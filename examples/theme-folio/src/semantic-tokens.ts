/**
 * States the values that change with the color mode: the surfaces, the inks, the lines, every
 * palette and the shadows.
 *
 * @remarks
 *   The contract asks a root theme for every hue palette and every semantic palette, and two
 *   calls fill it. The page sits nearer white and nearer black than the foundation's, and every
 *   shadow is cast with half again the default ink, because an editorial page shows few surfaces
 *   and each one is meant to lift off the paper.
 */

import { families, palettes, shadows, type ThemeTokens } from "@stealthscale/theme/authoring";

import { PRODUCT } from "#tokens.ts";

/**
 * Fixes the hue the page is tinted with, a little further round than the brand.
 */
const SURFACE = 300;

/**
 * Fixes where the page sits in each mode.
 */
const PAGE = { dark: 9, light: 98 };

/**
 * Fixes how far the page's tint goes.
 */
const TINT = 0.01;

/**
 * Fixes how much ink every shadow carries against the default weight.
 */
const DEPTH = 1.5;

/**
 * Lists every semantic token, by category.
 */
export const semanticTokens: ThemeTokens = {
  colors: {
    ...families(PAGE, SURFACE, TINT),
    ...palettes({ accent: "indigo", primary: "purple", secondary: "pink" }),
  },
  shadows: shadows(PRODUCT, DEPTH),
};
