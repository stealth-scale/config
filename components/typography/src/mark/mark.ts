/**
 * Binds the mark element to its recipe.
 *
 * @remarks
 *   `mark` exposes the `mark` role. A screen reader announces the run's boundaries only where the
 *   reader has turned that on, so a highlight that carries meaning needs a second cue. The `text`
 *   variant supplies one in weight, and a caller who needs the meaning spoken puts it in a
 *   `VisuallyHidden` beside the run. WCAG 1.4.1 fails a distinction drawn in colour alone.
 */

import { type ComponentProps } from "react";

import { withContext } from "#mark/context.ts";

/**
 * Picks a run of words out of the text around it.
 */
export const Mark = withContext("mark");

/**
 * Describes the props a mark element takes.
 */
export type MarkProps = ComponentProps<typeof Mark>;
