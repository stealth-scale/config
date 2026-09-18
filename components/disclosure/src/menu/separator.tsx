/**
 * Draws a line between two sets of rows.
 *
 * @remarks
 *   The machine gives it the separator role, so a screen reader reports the break rather than
 *   passing over it in silence. It takes no part in the keyboard, and the arrows move from the row
 *   above it to the row below in one press.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Draws the line at the size the root states.
 */
const Ruled = withContext("div", "separator");

/**
 * Describes what the line takes.
 */
export type SeparatorProps = ComponentProps<typeof Ruled>;

/**
 * Breaks the rows into sets.
 *
 * @param props - Everything a styled div takes.
 * @returns The line, carrying what the machine writes onto it.
 */
export function Separator(props: SeparatorProps): ReactElement {
  const { api } = useMenu();

  return <Ruled {...mergeProps(api.getSeparatorProps(), props)} />;
}
