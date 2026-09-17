/**
 * Draws the text styles over the theme's own type scale, so the leading and the tracking climb
 * with the sizes.
 *
 * @remarks
 *   The sizes are stated beside the faces in the tokens. The styles are stated here from the same
 *   two numbers, because a text style names its size by token and reads its leading from the rem
 *   the same arguments produce.
 */

import { type TextStyles, typography } from "@stealthscale/theme/authoring";

import { BODY, RATIO } from "#tokens.ts";

/**
 * Lists the text styles, keyed `2xs` to `7xl`, each with the leading and tracking it is read at.
 */
export const textStyles: TextStyles = typography(BODY, RATIO);
