/**
 * Draws the text styles over the theme's own type scale, so the leading and the tracking climb
 * with the sizes.
 */

import { type TextStyles, typography } from "@stealthscale/theme/authoring";

import { BODY, RATIO } from "#lantern/tokens.ts";

/**
 * Lists the text styles, keyed `2xs` to `9xl`, each with the leading and tracking it is read at.
 */
export const textStyles: TextStyles = typography(BODY, RATIO);
