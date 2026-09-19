/**
 * Draws the control that sits at the end of a row.
 *
 * @remarks
 *   The element is `span`, and the control goes inside it. A control nested in a link is not
 *   reachable on its own, so the action is a sibling of the link and is placed over the room the
 *   row leaves at its end.
 *   Name the control. A row already names where it goes, and an unnamed control beside it is
 *   announced as a button with nothing to say which row it belongs to.
 */

import { type ComponentProps } from "react";

import { withContext } from "#nav-list/context.ts";

/**
 * Draws the control at the end of the row.
 */
export const Action = withContext("span", "action");

/**
 * Describes what an action takes.
 */
export type ActionProps = ComponentProps<typeof Action>;
