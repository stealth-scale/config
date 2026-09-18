/**
 * Draws stressed words through their recipe.
 *
 * @remarks
 *   The element is `em`, which a screen reader reads with the stress a writer meant and which
 *   carries that meaning to a reader who sees no italic at all. A run set in italic for a reason
 *   other than stress, a ship's name or a term being introduced, is an `i` a caller reaches
 *   through `as`.
 */

import { type ComponentProps } from "react";

import { withContext } from "#em/context.ts";

/**
 * Marks the words a writer stressed.
 */
export const Em = withContext("em");

/**
 * Describes what stressed words take: everything a styled em element takes.
 */
export type EmProps = ComponentProps<typeof Em>;
