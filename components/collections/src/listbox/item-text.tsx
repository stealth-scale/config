/**
 * Draws the words of one row.
 *
 * @remarks
 *   The words are cut short rather than wrapped, so every row is one line and the list keeps a
 *   rhythm a reader scans down. A row whose words need more than a line belongs in a different
 *   component.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#listbox/context.ts";
import { type ListboxItem, useListbox } from "#listbox/machine.ts";

/**
 * Draws the words at the size the root states.
 */
const Named = withContext("span", "itemText");

/**
 * Describes what a row's words take.
 */
export interface ItemTextProps extends ComponentProps<typeof Named> {
  /**
   * The row of the collection these words belong to.
   */
  readonly item: ListboxItem;
}

/**
 * Labels one row, on the screen and to a screen reader.
 *
 * @param props - The row it names, and everything a styled span takes.
 * @returns The words, cut short where the row is too narrow for them.
 */
export function ItemText({ item, ...rest }: ItemTextProps): ReactElement {
  const api = useListbox();

  return <Named {...mergeProps(api.getItemTextProps({ item }), rest)} />;
}
