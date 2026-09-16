/**
 * Defines the shadows, tinted in the grey ramp's hue and darker in dark mode.
 *
 * @remarks
 *   A shadow tinted in the page's own hue reads as a shadow rather than as a smudge, which is why
 *   the hue is the grey ramp's and not neutral.
 */

import { type SemanticTokens } from "#pandacss.ts";
import { shadows as scale } from "#scales/depth.ts";

/**
 * Describes the shadows a theme states.
 */
type Shadows = NonNullable<SemanticTokens["shadows"]>;

/**
 * Fixes the hue every shadow is tinted with, which is the grey ramp's.
 */
const TINT_HUE = 262;

/**
 * Lists the shadows, `xs` to `2xl`, then `inner` and `inset`.
 */
export const shadows: Shadows = scale(TINT_HUE);
