/**
 * Draws the mark saying a row is chosen.
 *
 * @remarks
 *   The mark says nothing a screen reader needs. The row already carries `aria-selected`, so a
 *   reader is told once rather than twice, and a caller hands over a glyph without naming it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#listbox/context.ts";
import { type ListboxItem, useListbox } from "#listbox/machine.ts";

/**
 * Draws the mark at the end of the row.
 */
const Marked = withContext("span", "itemIndicator", { defaultProps: { "aria-hidden": true } });

/**
 * Describes what a row's mark takes.
 */
export interface ItemIndicatorProps extends ComponentProps<typeof Marked> {
  /**
   * The row of the collection this mark belongs to.
   */
  readonly item: ListboxItem;
}

/**
 * Appears at the end of a row that is chosen.
 *
 * @param props - The row it belongs to, and everything a styled span takes.
 * @returns The mark, drawn where the row is chosen.
 */
export function ItemIndicator({ item, ...rest }: ItemIndicatorProps): ReactElement {
  const api = useListbox();

  return <Marked {...mergeProps(api.getItemIndicatorProps({ item }), rest)} />;
}
