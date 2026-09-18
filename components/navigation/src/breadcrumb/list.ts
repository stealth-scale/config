/**
 * Draws the ordered list the crumbs are rows of.
 *
 * @remarks
 *   The element is `ol`, because the order of a trail is its meaning. It states its list role
 *   rather than relying on the element, because a list drawn with no marker loses its role in
 *   Safari and a reader is then told nothing about how many crumbs there are or which one they
 *   are on.
 */

import { type ComponentProps } from "react";

import { withContext } from "#breadcrumb/context.ts";

/**
 * Draws the crumbs in order, at the gap its size states.
 */
export const List = withContext("ol", "list", { defaultProps: { role: "list" } });

/**
 * Describes what the list takes.
 */
export type ListProps = ComponentProps<typeof List>;
