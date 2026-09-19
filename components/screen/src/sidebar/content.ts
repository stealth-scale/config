/**
 * Draws what scrolls between the head and the foot.
 *
 * @remarks
 *   This is what scrolls rather than the column, so a switcher at the head and an account at the
 *   foot stay where a reader left them however long the list of destinations grows.
 */

import { type ComponentProps } from "react";

import { withContext } from "#sidebar/context.ts";

/**
 * Draws the scroller at the room the column states.
 */
export const Content = withContext("div", "content");

/**
 * Describes what the content takes.
 */
export type ContentProps = ComponentProps<typeof Content>;
