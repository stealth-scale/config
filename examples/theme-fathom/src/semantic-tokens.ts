/**
 * States the values that change with the color mode: the surfaces, the inks, the lines, every
 * palette, the corners and the shadows.
 *
 * @remarks
 *   The contract asks a root theme for every hue palette and every semantic palette, and two
 *   calls fill it. The primary palette points at the teal, and every palette the theme leaves
 *   unnamed points where the foundation points it.
 */

import {
  families,
  palettes,
  radii,
  shadows,
  type ThemeTokens,
} from "@stealthscale/theme/authoring";

import { NEUTRAL } from "#tokens.ts";

/**
 * Fixes the hue the page is tinted with, between the greys and the product, so a panel belongs
 * to both.
 */
const SURFACE = 195;

/**
 * Fixes where the page sits in each mode.
 */
const PAGE = { dark: 11, light: 96 };

/**
 * Fixes how far the page's tint goes.
 */
const TINT = 0.016;

/**
 * Fixes the roundest corner. Rounder than the foundation, which is most of what makes the theme
 * read as softer than it is.
 */
const CORNER = "1rem";

/**
 * Lists every semantic token, by category.
 */
export const semanticTokens: ThemeTokens = {
  colors: {
    ...families(PAGE, SURFACE, TINT),
    ...palettes({ accent: "cyan", primary: "teal", secondary: "indigo" }),
  },
  radii: radii(CORNER),
  shadows: shadows(NEUTRAL),
};
