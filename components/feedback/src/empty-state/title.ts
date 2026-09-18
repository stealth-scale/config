/**
 * Draws the line saying what is not here.
 *
 * @remarks
 *   The element is `h2`, because an empty state takes the place of a section's content and its
 *   title takes the place of that section's heading. A page whose outline puts it deeper states
 *   its own level with `as`, since a heading that skips a level reads as a gap in the outline a
 *   screen reader moves through.
 */

import { type ComponentProps } from "react";

import { withContext } from "#empty-state/context.ts";

/**
 * Draws the title at the size the panel states.
 */
export const Title = withContext("h2", "title");

/**
 * Describes what the title takes.
 */
export type TitleProps = ComponentProps<typeof Title>;
