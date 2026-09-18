/**
 * Draws a spacer through its recipe.
 *
 * @remarks
 *   The element is `div` and holds nothing. It is hidden from assistive technology, because empty
 *   room is not something a reader is told about, and a reader moving through a row of controls
 *   would otherwise meet a thing with no name between them.
 */

import { type ComponentProps } from "react";

import { withContext } from "#spacer/context.ts";

/**
 * Takes the room a stack has left over, which pushes what follows it to the far end.
 */
export const Spacer = withContext("div", { defaultProps: { "aria-hidden": true } });

/**
 * Describes what a spacer takes: everything a styled div element takes.
 */
export type SpacerProps = ComponentProps<typeof Spacer>;
