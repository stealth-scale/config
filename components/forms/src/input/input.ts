/**
 * Draws a text field through its recipe.
 *
 * @remarks
 *   The element is `input`, which a browser focuses, types into, and fills from what it remembers.
 *   It carries no label of its own: a field is named by a `label` pointing at it, or by
 *   `aria-label` where a page has drawn the name elsewhere, and a field with neither is a field a
 *   screen reader announces as `edit text` and nothing more.
 *   A field that is wrong states `aria-invalid`, which is what the recipe's invalid styling reads.
 *   That is one attribute rather than a prop, because it is the attribute a screen reader reads
 *   too, and a prop would leave the two able to disagree.
 */

import { type ComponentProps } from "react";

import { withContext } from "#input/context.ts";

/**
 * Draws a box a person types one line into.
 */
export const Input = withContext("input");

/**
 * Describes what a field takes: the variants its recipe offers, and everything a styled input
 * takes.
 */
export type InputProps = ComponentProps<typeof Input>;
