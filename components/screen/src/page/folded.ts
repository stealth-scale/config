/**
 * Draws the control that holds whatever the header dropped as the page narrowed.
 *
 * @remarks
 *   It appears only on a folded page, because a page keeping every control has nothing to put
 *   behind it. Put a menu in it holding the same actions the tertiary controls do, so what a wide
 *   page offers in the row a narrow one offers in one press.
 *   Name it. `More` says nothing about what it opens; `More invoice actions` does.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Draws the control at the room the column states.
 */
export const Folded = withContext("button", "folded", { defaultProps: { type: "button" } });

/**
 * Describes what the folded control takes.
 */
export type FoldedProps = ComponentProps<typeof Folded>;
