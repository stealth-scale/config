/**
 * Draws the strip the controls sit in.
 *
 * @remarks
 *   The machine writes the tablist role and the orientation, which is what tells a screen reader
 *   that the controls inside are one set and which arrow keys move between them.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tabs/context.ts";
import { useTabs } from "#tabs/machine.ts";

/**
 * Draws the strip, which turns into a column where the set runs down.
 */
const Strip = withContext("div", "list");

/**
 * Describes what the strip takes.
 */
export type ListProps = ComponentProps<typeof Strip>;

/**
 * Draws the controls in a row, with the bar that marks the one in force.
 *
 * @param props - Everything a styled div takes.
 * @returns The strip, carrying its role and its orientation.
 */
export function List(props: ListProps): ReactElement {
  const api = useTabs();

  return <Strip {...mergeProps(api.getListProps(), props)} />;
}
