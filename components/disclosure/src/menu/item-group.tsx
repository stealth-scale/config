/**
 * Draws a set of rows that belong together.
 *
 * @remarks
 *   The machine gives it the group role and points it at the label above it, so a screen reader
 *   announces what the rows have in common as the reader enters the set. A group takes no part in
 *   the keyboard: the arrows move through every row of the menu in order, and a group is a heading
 *   over them rather than a stop of its own.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Draws the set at the size the root states.
 */
const Grouped = withContext("div", "itemGroup");

/**
 * Describes what a set takes.
 */
export interface ItemGroupProps extends ComponentProps<typeof Grouped> {
  /**
   * Ties the set to the label that names it.
   */
  readonly value: string;
}

/**
 * Groups the rows that belong together.
 *
 * @param props - The name the label shares, beside everything a styled div takes.
 * @returns The set, carrying what the machine writes onto it.
 */
export function ItemGroup({ value, ...rest }: ItemGroupProps): ReactElement {
  const { api } = useMenu();

  return <Grouped {...mergeProps(api.getItemGroupProps({ id: value }), rest)} />;
}
