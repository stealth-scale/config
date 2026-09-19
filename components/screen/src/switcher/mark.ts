/**
 * Draws the mark standing for the current thing: a logo, an avatar, an initial.
 *
 * @remarks
 *   It stands for what the name beside it already says, so it is decoration and takes
 *   `aria-hidden`. A mark carrying something the name does not say is labelled by the caller.
 */

import { type ComponentProps } from "react";

import { withContext } from "#switcher/context.ts";

/**
 * Draws the mark at the size the control states.
 */
export const Mark = withContext("span", "mark", { defaultProps: { "aria-hidden": true } });

/**
 * Describes what the mark takes.
 */
export type MarkProps = ComponentProps<typeof Mark>;
