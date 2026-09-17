/**
 * Draws the values that do not change with the color mode: the two ramps the theme redraws, the
 * type scale and the faces.
 *
 * @remarks
 *   The greys keep a trace of the violet, so a rule beside the brand reads as belonging to it.
 *   Body text is set a sixteenth larger than the foundation's and the scale climbs by a major
 *   third rather than a major second, which is what a page read rather than scanned wants. The
 *   faces are the system serifs, so the theme names no font package.
 */

import { colorScale, fontSizes, type Tokens } from "@stealthscale/theme/authoring";

/**
 * Fixes the hue the product is drawn in, and the one the greys keep a trace of.
 */
export const PRODUCT = 295;

/**
 * Fixes the size body text is set at, in rem.
 */
export const BODY = 1.0625;

/**
 * Fixes how fast the scale climbs: a major third.
 */
export const RATIO = 1.25;

/**
 * Fixes the serif stack a page is read in.
 */
const SERIF = 'Georgia, "Times New Roman", Times, serif';

/**
 * Lists the ramps, the sizes and the faces the theme redraws.
 */
export const tokens: Tokens = {
  colors: { gray: colorScale(PRODUCT, 0.01), purple: colorScale(PRODUCT, 0.17) },
  fonts: { body: { value: SERIF }, heading: { value: SERIF } },
  fontSizes: fontSizes(BODY, RATIO),
};
