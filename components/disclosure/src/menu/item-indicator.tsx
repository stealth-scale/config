/**
 * Draws the mark that says a row is on.
 *
 * @remarks
 *   The row above hands down what the machine needs to read its state, so this takes no props of
 *   its own. It sits in the gutter the size axis leaves at the leading edge rather than in the flow
 *   of the row, so the words of every row in a menu start at the same place whether or not a mark
 *   is showing. A caller draws whatever artwork they like inside it.
 *   It is hidden from assistive technology, because the row already reports whether it is on
 *   through `aria-checked` and the mark would otherwise be read out as part of the row's name. A
 *   caller who draws something here that carries meaning of its own says so.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu, useMenuItem } from "#menu/machine.ts";

/**
 * Draws the mark at the size the root states.
 */
const Marked = withContext("span", "itemIndicator");

/**
 * Describes what the mark takes.
 */
export type ItemIndicatorProps = ComponentProps<typeof Marked>;

/**
 * Says the row is on.
 *
 * @param props - Everything a styled span takes.
 * @returns The mark, carrying the row's state.
 */
export function ItemIndicator(props: ItemIndicatorProps): ReactElement {
  const { api } = useMenu();
  const item = useMenuItem();

  return (
    <Marked {...mergeProps({ "aria-hidden": true }, api.getItemIndicatorProps(item), props)} />
  );
}
