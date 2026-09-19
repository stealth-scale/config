/**
 * Draws the control that holds whatever the header dropped as the section narrowed.
 *
 * @remarks
 *   It appears only on a narrow section, because a section keeping every control has nothing to put
 *   behind it. Put a menu in it holding the same actions the tertiary controls do.
 *   Name it. `More` says nothing about what it opens; `More billing actions` does.
 */

import { type ComponentProps } from "react";

import { withContext } from "#section/context.ts";

/**
 * Draws the control at the room the block states.
 */
export const Folded = withContext("button", "folded", { defaultProps: { type: "button" } });

/**
 * Describes what the folded control takes.
 */
export type FoldedProps = ComponentProps<typeof Folded>;
