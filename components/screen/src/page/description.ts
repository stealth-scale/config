/**
 * Draws the words explaining what the page is for.
 *
 * @remarks
 *   The element is `p`, and the line stops at the reading measure the theme states in characters,
 *   so it holds its count at every type size.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Draws the words under the title, held to the reading measure.
 */
export const Description = withContext("p", "description");

/**
 * Describes what the description takes.
 */
export type DescriptionProps = ComponentProps<typeof Description>;
