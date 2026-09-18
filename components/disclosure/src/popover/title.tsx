/**
 * Draws the heading the panel is announced by.
 *
 * @remarks
 *   The element is `h2`, and a page whose outline puts the panel deeper states its own level with
 *   `as`. The machine points the panel at this heading, so a panel without one is a panel a screen
 *   reader announces by nothing.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#popover/context.ts";
import { usePopover } from "#popover/machine.ts";

/**
 * Draws the part at the size the root states.
 */
const Drawn = withContext("h2", "title");

/**
 * Describes what the part takes.
 */
export type TitleProps = ComponentProps<typeof Drawn>;

/**
 * Draws the heading the panel is announced by.
 *
 * @param props - Everything a styled h2 takes.
 * @returns The part, carrying what the machine writes onto it.
 */
export function Title(props: TitleProps): ReactElement {
  const api = usePopover();

  return <Drawn {...mergeProps(api.getTitleProps(), props)} />;
}
