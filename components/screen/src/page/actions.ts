/**
 * Draws the controls that act on the page.
 *
 * @remarks
 *   They keep the end of the title's row at every width and never wrap under it. A control inside
 *   states its own priority, and the page's folding rules decide which survive a narrow row.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Draws the controls at the room the column states.
 */
export const Actions = withContext("div", "actions");

/**
 * Describes what the actions take.
 */
export type ActionsProps = ComponentProps<typeof Actions>;
