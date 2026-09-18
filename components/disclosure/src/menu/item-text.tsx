/**
 * Draws the words of a row.
 *
 * @remarks
 *   The row above hands down what the machine needs to read its state, so this takes no props of
 *   its own. It fills the room the mark and any artwork leave, and a label too long for the panel
 *   is cut with an ellipsis rather than wrapped, because a menu whose rows are different heights is
 *   harder to aim at.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu, useMenuItem } from "#menu/machine.ts";

/**
 * Draws the words at the size the root states.
 */
const Worded = withContext("span", "itemText");

/**
 * Describes what the words take.
 */
export type ItemTextProps = ComponentProps<typeof Worded>;

/**
 * Says what the row offers.
 *
 * @param props - Everything a styled span takes.
 * @returns The words, carrying the row's state.
 */
export function ItemText(props: ItemTextProps): ReactElement {
  const { api } = useMenu();
  const item = useMenuItem();

  return <Worded {...mergeProps(api.getItemTextProps(item), props)} />;
}
