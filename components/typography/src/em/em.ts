/**
 * Binds the em element to its recipe.
 *
 * @remarks
 *   `em` marks stress. A screen reader announces it, and a reader who sees no italic face still
 *   receives the meaning. Set `as="i"` for a run drawn in italic for another reason, such as a
 *   ship's name or a term being introduced. That element states no stress.
 */

import { type ComponentProps } from "react";

import { withContext } from "#em/context.ts";

/**
 * Marks a run of words the writer stressed.
 */
export const Em = withContext("em");

/**
 * Describes the props an em element takes.
 */
export type EmProps = ComponentProps<typeof Em>;
