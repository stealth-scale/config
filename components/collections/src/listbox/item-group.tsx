/**
 * Draws a set of rows gathered under one heading.
 *
 * @remarks
 *   The element carries `role="group"` and points at its own heading, so a screen reader says which
 *   set a row belongs to as the highlight crosses into it. The identifier is the caller's, because
 *   the heading beside it has to name the same one.
 *   The element is `div`. The role is stated outright, and a group drawn as a list item inside the
 *   list's own list item is markup no browser accepts.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#listbox/context.ts";
import { useListbox } from "#listbox/machine.ts";

/**
 * Draws the set at the size the root states.
 */
const Gathered = withContext("div", "itemGroup");

/**
 * Describes what a group takes.
 */
export interface ItemGroupProps extends Omit<ComponentProps<typeof Gathered>, "id"> {
  /**
   * The identifier the group and its heading are tied together by.
   */
  readonly id: string;
}

/**
 * Gathers rows under a heading a reader is told about.
 *
 * @param props - The identifier it shares with its heading, and everything a styled list item
 *   takes.
 * @returns The set, carrying its role and the heading it is named by.
 */
export function ItemGroup({ id, ...rest }: ItemGroupProps): ReactElement {
  const api = useListbox();

  return <Gathered {...mergeProps(api.getItemGroupProps({ id }), rest)} />;
}
