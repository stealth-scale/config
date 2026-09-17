/**
 * Draws a paragraph through its recipe.
 *
 * @remarks
 *   The binding stamps the recipe's name on the element and writes the class of each variant a
 *   caller picks. The component adds no ink, no size and no margin. All of that is the recipe's,
 *   so a theme moves every paragraph by extending it. A caller changes the element with `as`,
 *   for a run of words inside a line that reads as a paragraph and is a `span`.
 */

import { type ComponentProps } from "react";

import { withContext } from "#text/context.ts";

/**
 * Draws a paragraph in a size, an ink, a weight and an alignment.
 */
export const Text = withContext("p");

/**
 * Describes what a paragraph takes: the variants its recipe offers, and everything a styled
 * paragraph element takes.
 */
export type TextProps = ComponentProps<typeof Text>;
