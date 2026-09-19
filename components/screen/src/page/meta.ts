/**
 * Draws what sits beside the title: a status, a count, a label saying what state the thing is in.
 *
 * @remarks
 *   It sits close to the title on a wide page and moves onto a line of its own once the page folds,
 *   so the title's words wrap before the marks stack.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Draws the row at the room the column states.
 */
export const Meta = withContext("div", "meta");

/**
 * Describes what the marks beside the title take.
 */
export type MetaProps = ComponentProps<typeof Meta>;
