/**
 * States the values that change with the color mode: the surfaces, the inks, the lines, every
 * palette and the shadows.
 *
 * @remarks
 *   The contract asks a root theme for every hue palette and every semantic palette, and two
 *   calls fill it. The primary palette points at the amber, so warnings point at the yellow to
 *   stay apart from it. Every shadow is cast with half the default ink, because a dense screen
 *   draws many surfaces at once and a full-weight shadow under each of them reads as noise.
 */

import { families, palettes, shadows, type ThemeTokens } from "@stealthscale/theme/authoring";

import { NEUTRAL } from "#tokens.ts";

/**
 * Fixes the hue the page is tinted with, a touch further from the brand than the greys, so a rule
 * between two rows belongs to the cream it sits on.
 */
const SURFACE = 75;

/**
 * Fixes where the page sits in each mode.
 */
const PAGE = { dark: 14, light: 96 };

/**
 * Fixes how far the page's tint goes.
 */
const TINT = 0.02;

/**
 * Fixes how much ink every shadow carries against the default weight.
 */
const DEPTH = 0.5;

/**
 * Lists every semantic token, by category.
 */
export const semanticTokens: ThemeTokens = {
  colors: {
    ...families(PAGE, SURFACE, TINT),
    ...palettes({ accent: "teal", primary: "orange", secondary: "gray", warning: "yellow" }),
  },
  shadows: shadows(NEUTRAL, DEPTH),
};
