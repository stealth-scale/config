/**
 * Draws an icon through its recipe.
 *
 * @remarks
 *   The binding stamps the recipe's name on the element and writes the class of each variant a
 *   caller picks. The element is `svg`, and the artwork inside it is the caller's children, so
 *   the component ships no mark of its own. It is hidden from assistive technology by default,
 *   because a mark beside a word is decoration, and a caller who draws a mark that stands alone
 *   labels it.
 */

import { type ComponentProps } from "react";

import { withContext } from "#icon/context.ts";

/**
 * Draws the artwork it is handed at a size, in an ink and with a motion, hidden from assistive
 * technology unless a caller labels it.
 */
export const Icon = withContext("svg", { defaultProps: { "aria-hidden": true } });

/**
 * Describes what an icon takes: the variants its recipe offers, and everything a styled svg
 * element takes.
 */
export type IconProps = ComponentProps<typeof Icon>;
