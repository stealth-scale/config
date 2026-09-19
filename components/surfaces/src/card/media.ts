/**
 * Draws the band a card's picture sits in.
 *
 * @remarks
 *   The element is `div` and holds the caller's picture, video or map. The band takes back the
 *   room the root leaves, so the picture meets the card's edges and its corners are clipped by the
 *   root rather than restated here. Which edges it meets follows the orientation: the top and both
 *   sides of a card that runs down the page, and the leading side of one that runs across it.
 *   The band names nothing. Alternative text stays with the picture inside it, where a screen
 *   reader reads it, and a decorative picture states `alt=""`.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Bleeds the picture to the card's edges.
 */
export const Media = withContext("div", "media");

/**
 * Describes what the band takes: everything a styled div takes.
 */
export type MediaProps = ComponentProps<typeof Media>;
