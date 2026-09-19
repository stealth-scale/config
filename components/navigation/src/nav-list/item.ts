/**
 * Draws one row of the list.
 *
 * @remarks
 *   The element is `li`, and it is positioned so an action or a badge can be placed against its
 *   end. It holds the link and whatever sits beside it, which is why the placing belongs here
 *   rather than on the link.
 */

import { type ComponentProps } from "react";

import { withContext } from "#nav-list/context.ts";

/**
 * Draws a row at the size the list states.
 */
export const Item = withContext("li", "item");

/**
 * Describes what a row takes.
 */
export type ItemProps = ComponentProps<typeof Item>;
