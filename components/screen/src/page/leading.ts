/**
 * Draws what stands before the title: an avatar, a logo, a mark for the kind of thing shown.
 *
 * @remarks
 *   It keeps its place at every width, because what it stands for is what the title names and the
 *   two read as one line. Label it where it carries meaning, and hide it from a screen reader where
 *   it repeats the title.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Draws the mark at the room the column states.
 */
export const Leading = withContext("div", "leading");

/**
 * Describes what the leading mark takes.
 */
export type LeadingProps = ComponentProps<typeof Leading>;
