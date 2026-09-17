/**
 * Draws a button that holds one glyph and no words, through the button's recipe.
 *
 * @remarks
 *   The same recipe as the button, bound once more with the square shape as its default, so a
 *   theme that moves the button moves this with it. A glyph names nothing, so the props require
 *   an accessible name: `aria-label`, or `aria-labelledby` pointing at the words that name it.
 *   The type refuses a nameless icon button where a lint rule would only report one.
 */

import { type ComponentProps, type JSX } from "react";

import { withContext } from "#button/context.ts";

/**
 * Binds the button's recipe with the square shape fixed, beside the button's own default type.
 */
const Square = withContext("button", { defaultProps: { shape: "square", type: "button" } });

/**
 * Gives the control a label of its own.
 */
interface Labelled {
  /**
   * The words that name the control.
   */
  "aria-label": string;
}

/**
 * Points the control at the element that holds its name.
 */
interface LabelledBy {
  /**
   * The id of the element that holds the words.
   */
  "aria-labelledby": string;
}

/**
 * Requires an accessible name for a control whose content gives it none.
 */
export type Named = Labelled | LabelledBy;

/**
 * Describes what an icon button takes: everything a button takes, and an accessible name.
 */
export type IconButtonProps = ComponentProps<typeof Square> & Named;

/**
 * Draws a square button in a look, a size and a status, named in words for the glyph it holds.
 */
export const IconButton: (props: IconButtonProps) => JSX.Element = Square;
