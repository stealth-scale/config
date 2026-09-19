/**
 * Draws the controls that act on the section.
 *
 * @remarks
 *   The element is `div`. The controls keep the end of the title's row at every width and never
 *   wrap under it, so the title is the column that gives and a long title wraps beside them rather
 *   than pushing them onto a line of their own.
 */

import { type ComponentProps } from "react";

import { withContext } from "#section/context.ts";

/**
 * Draws the controls beside the title.
 */
export const Actions = withContext("div", "actions");

/**
 * Describes what the actions take.
 */
export type ActionsProps = ComponentProps<typeof Actions>;
