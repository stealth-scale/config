/**
 * Draws the words explaining what the section is for.
 *
 * @remarks
 *   The element is `p`. The line stops at the reading measure through padding at its end rather
 *   than a maximum width, because a maximum width shortens the line before it wraps and leaves the
 *   last word hanging in the space that is left.
 */

import { type ComponentProps } from "react";

import { withContext } from "#section/context.ts";

/**
 * Draws the words under the title, held to the reading measure.
 */
export const Description = withContext("p", "description");

/**
 * Describes what the description takes.
 */
export type DescriptionProps = ComponentProps<typeof Description>;
