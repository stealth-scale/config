/**
 * Draws the line that supports a card's title.
 *
 * @remarks
 *   The element is `p`. The description reads in the muted ink at the small body style, which the
 *   contrast gate holds to the text ratio, so it sits under the title without dropping below what
 *   a reader can read.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Says what the card is about, under its title.
 */
export const Description = withContext("p", "description");

/**
 * Describes what the description takes: everything a styled p takes.
 */
export type DescriptionProps = ComponentProps<typeof Description>;
