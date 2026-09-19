/**
 * Draws the row above the title saying where the page sits.
 *
 * @remarks
 *   A trail of crumbs, or a link back to what holds this page. It reads as the description's kin
 *   rather than as part of the title, so a reader takes the title first.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Draws the row at the room the column states.
 */
export const Context = withContext("div", "context");

/**
 * Describes what the context row takes.
 */
export type ContextProps = ComponentProps<typeof Context>;
