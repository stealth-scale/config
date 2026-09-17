/**
 * Draws a key through its recipe.
 *
 * @remarks
 *   The binding stamps the recipe's name on the element and writes the class of each variant a
 *   caller picks. The element is `kbd`, which a screen reader announces as keyboard input. The
 *   component adds no ink, no size and no margin. All of that is the recipe's, so a theme moves
 *   every key by extending it.
 */

import { type ComponentProps } from "react";

import { withContext } from "#kbd/context.ts";

/**
 * Draws a key a reader is asked to press, in a look, a size and the palette of its status.
 */
export const Kbd = withContext("kbd");

/**
 * Describes what a key takes: the variants its recipe offers, and everything a styled kbd element
 * takes.
 */
export type KbdProps = ComponentProps<typeof Kbd>;
