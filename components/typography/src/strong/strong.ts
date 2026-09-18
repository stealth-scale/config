/**
 * Binds the strong element to its recipe.
 *
 * @remarks
 *   `strong` marks importance rather than weight. A screen reader announces it, and a reader who
 *   sees no heavier face still receives the meaning. Set `as="b"` for a run drawn heavy for another
 *   reason, such as a keyword in a definition. That element states no importance.
 */

import { type ComponentProps } from "react";

import { withContext } from "#strong/context.ts";

/**
 * Marks a run of words as more important than the words around it.
 */
export const Strong = withContext("strong");

/**
 * Describes the props a strong element takes.
 */
export type StrongProps = ComponentProps<typeof Strong>;
