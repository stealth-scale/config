/**
 * Draws inline code through its recipe.
 *
 * @remarks
 *   The binding stamps the recipe's name on the element and writes the class of each variant a
 *   caller picks. The element is `code`, which a screen reader announces as such. The component
 *   adds no ink, no size and no margin. All of that is the recipe's, so a theme moves every
 *   snippet by extending it.
 */

import { type ComponentProps } from "react";

import { withContext } from "#code/context.ts";

/**
 * Draws a snippet of code inside a line, in a look, a size and the palette of its status.
 */
export const Code = withContext("code");

/**
 * Describes what a snippet takes: the variants its recipe offers, and everything a styled code
 * element takes.
 */
export type CodeProps = ComponentProps<typeof Code>;
