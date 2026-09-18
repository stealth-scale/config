/**
 * Draws the panel the rows sit in.
 *
 * @remarks
 *   The machine gives it the menu role, points it at the row the reader is on through
 *   `aria-activedescendant`, and keeps the focus here rather than moving it row by row, which is
 *   what the menu pattern asks for. It holds the keyboard: the arrows move the highlight, the arrow
 *   towards a submenu opens it, typing jumps to a row by its words, and Escape closes the menu and
 *   returns the focus to the control that opened it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Draws the panel at the size the root states.
 */
const Drawn = withContext("div", "content");

/**
 * Describes what the panel takes.
 */
export type ContentProps = ComponentProps<typeof Drawn>;

/**
 * Shows the rows of the menu.
 *
 * @param props - Everything a styled div takes.
 * @returns The panel, carrying what the machine writes onto it.
 */
export function Content(props: ContentProps): ReactElement {
  const { api } = useMenu();

  return <Drawn {...mergeProps(api.getContentProps(), props)} />;
}
