/**
 * Draws a button through its recipe.
 *
 * @remarks
 *   The element is `button`, which the browser focuses, presses with Space and Enter, and names
 *   from its content. `type` defaults to `button`, because the platform's default is `submit`
 *   and a button inside a form would send it. The component adds no ink, no size and no shape.
 *   All of that is the recipe's, so a theme moves every button by extending it. A caller changes
 *   the element with `as`, for a link drawn as a button.
 */

import { type ComponentProps } from "react";

import { withContext } from "#button/context.ts";

/**
 * Draws a button in a look, a size and a status, square where it holds one glyph.
 */
export const Button = withContext("button", { defaultProps: { type: "button" } });

/**
 * Describes what a button takes: the variants its recipe offers, and everything a styled button
 * element takes.
 */
export type ButtonProps = ComponentProps<typeof Button>;
