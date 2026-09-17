/**
 * States what Abyss moves under Fathom: the pages, the primary palette and the corners.
 *
 * @remarks
 *   A derived theme states what differs and nothing else. The pages go nearer black and nearer
 *   white than Fathom's, the primary palette points at the indigo while the teal stays the
 *   accent, and the corners are half as round. Everything Fathom states and Abyss leaves alone is
 *   Fathom's, the inks and the shadows included.
 */

import {
  backgrounds,
  paletteAlias,
  radii,
  type SemanticTokens,
} from "@stealthscale/theme/authoring";

/**
 * Fixes where the page sits in each mode: deeper than Fathom's in both.
 */
const PAGE = { dark: 6, light: 93 };

/**
 * Fixes the hue the page is tinted with, which is Fathom's.
 */
const SURFACE = 195;

/**
 * Fixes how far the page's tint goes, a touch further than Fathom's.
 */
const TINT = 0.02;

/**
 * Fixes the roundest corner, half as round as Fathom's.
 */
const CORNER = "0.5rem";

/**
 * Lists the semantic tokens Abyss moves.
 */
export const semanticTokens: SemanticTokens = {
  colors: {
    accent: paletteAlias("teal"),
    bg: backgrounds(PAGE, SURFACE, TINT),
    primary: paletteAlias("indigo"),
  },
  radii: radii(CORNER),
};
