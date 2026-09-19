/**
 * Draws one row a person picks.
 *
 * @remarks
 *   The element is `div` carrying `role="option"`, and it takes the row it stands for so the
 *   machine can name it, mark it and say whether it is chosen. A row carries no tab stop: focus
 *   rests on the list and the highlight moves.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#listbox/context.ts";
import { type ListboxItem, useListbox } from "#listbox/machine.ts";

/**
 * Draws the row at the size the root states.
 */
const Offered = withContext("div", "item");

/**
 * Describes what a row takes.
 */
export interface ItemProps extends ComponentProps<typeof Offered> {
  /**
   * The row of the collection this element stands for.
   */
  readonly item: ListboxItem;
}

/**
 * Offers one row, marked where it is chosen and highlighted where a reader is on it.
 *
 * @param props - The row it stands for, and everything a styled list item takes.
 * @returns The row, carrying its role and its state.
 */
export function Item({ item, ...rest }: ItemProps): ReactElement {
  const api = useListbox();

  return <Offered {...mergeProps(api.getItemProps({ item }), rest)} />;
}
