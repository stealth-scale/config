/**
 * Draws a heading through its recipe.
 *
 * @remarks
 *   The binding stamps the recipe's name on the element and writes the class of each variant a
 *   caller picks. The element is `h2`, the level most headings on a page have, and a caller sets
 *   another level with `as`. The component adds no ink, no size and no margin. All of that is the
 *   recipe's, so a theme moves every heading by extending it.
 */

import { type ComponentProps } from "react";

import { withContext } from "#heading/context.ts";

/**
 * Draws a heading in a heading role, an ink, an effect and a motion, at the level `as` names.
 */
export const Heading = withContext("h2");

/**
 * Describes what a heading takes: the variants its recipe offers, and everything a styled heading
 * element takes.
 */
export type HeadingProps = ComponentProps<typeof Heading>;
