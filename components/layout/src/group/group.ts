/**
 * Draws a group through its recipe.
 *
 * @remarks
 *   The element is `div`, because a group arranges controls that already carry their own meaning.
 *   A group whose children are one set of choices takes `as="fieldset"` or a role from the caller,
 *   so a screen reader hears the set rather than three unrelated controls.
 */

import { type ComponentProps } from "react";

import { withContext } from "#group/context.ts";

/**
 * Lays its children along one direction, a gap apart or attached into one control.
 */
export const Group = withContext("div");

/**
 * Describes what a group takes: the variants its recipe offers, and everything a styled div
 * element takes.
 */
export type GroupProps = ComponentProps<typeof Group>;
