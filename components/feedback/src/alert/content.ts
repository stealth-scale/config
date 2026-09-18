/**
 * Draws the band an alert's words sit in.
 *
 * @remarks
 *   The element is `div` and carries no role. The band lays the title and the description out, in
 *   a column or on one line, whichever the root's `layout` states. It takes the room the mark and
 *   the aside leave, and holds a minimum inline size of zero so a long word wraps inside it rather
 *   than pushing the aside off the end.
 */

import { type ComponentProps } from "react";

import { withContext } from "#alert/context.ts";

/**
 * Lays out the title and the description.
 */
export const Content = withContext("div", "content");

/**
 * Describes what the band takes: everything a styled div takes.
 */
export type ContentProps = ComponentProps<typeof Content>;
