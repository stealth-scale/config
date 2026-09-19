/**
 * Draws the shape of a row still on its way.
 *
 * @remarks
 *   The element is `li`, so a list of these counts as the rows it stands in for rather than
 *   collapsing to nothing. It draws no placeholder of its own: a caller puts the feedback package's
 *   skeleton inside it, and this states the room a row takes.
 *   Say that the list is loading. State `aria-busy` on the list around these, so a reader is told
 *   the rows are on their way rather than being read a set of empty items.
 */

import { type ComponentProps } from "react";

import { withContext } from "#nav-list/context.ts";

/**
 * Draws the room a row takes while it is on its way.
 */
export const Skeleton = withContext("li", "skeleton");

/**
 * Describes what a waiting row takes.
 */
export type SkeletonProps = ComponentProps<typeof Skeleton>;
