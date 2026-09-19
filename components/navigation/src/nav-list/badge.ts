/**
 * Draws the count at the end of a row.
 *
 * @remarks
 *   The element is `span`, and it takes no pointer, so a press over the count reaches the row
 *   behind it. It stays in the document where the rows are drawn as squares, out of sight and still
 *   read, because a count a reader cannot see is still a count they are told about.
 */

import { type ComponentProps } from "react";

import { withContext } from "#nav-list/context.ts";

/**
 * Draws the count at the end of the row.
 */
export const Badge = withContext("span", "badge");

/**
 * Describes what a count takes.
 */
export type BadgeProps = ComponentProps<typeof Badge>;
