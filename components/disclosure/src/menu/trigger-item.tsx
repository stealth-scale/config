/**
 * Draws the row of a menu that opens a submenu.
 *
 * @remarks
 *   The row belongs to two menus at once. It is a row of the menu above, which moves its highlight
 *   over it and counts it in the typeahead, and it is the control of the menu below, which opens
 *   when a pointer rests on it or the arrow key towards the submenu is pressed. The machine of the
 *   menu above merges both sets of props, so this reads the menu it is written inside and the one
 *   that holds it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Draws the row at the size the root states.
 */
const Pressed = withContext("button", "triggerItem");

/**
 * Describes what the row takes.
 */
export type TriggerItemProps = ComponentProps<typeof Pressed>;

/**
 * Opens a submenu from a row of the menu above it.
 *
 * @param props - Everything a styled button takes.
 * @returns The row, carrying what both machines write onto it.
 * @throws {@link Error} Where the menu it belongs to opens from no other menu.
 */
export function TriggerItem(props: TriggerItemProps): ReactElement {
  const { api, parent } = useMenu();

  if (parent === undefined) {
    throw new Error("Menu.TriggerItem was drawn in a menu that opens from no other menu.");
  }

  return <Pressed {...mergeProps(parent.api.getTriggerItemProps(api), props)} />;
}
