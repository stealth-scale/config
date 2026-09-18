/**
 * Marks what the panel is positioned against, where that is not the control.
 *
 * @remarks
 *   A caller who wants the panel beside a whole row rather than beside the control that opens it
 *   draws this around the row. The machine measures whichever of the two is present.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#popover/context.ts";
import { usePopover } from "#popover/machine.ts";

/**
 * Draws the part at the size the root states.
 */
const Drawn = withContext("div", "anchor");

/**
 * Describes what the part takes.
 */
export type AnchorProps = ComponentProps<typeof Drawn>;

/**
 * Marks what the panel is positioned against, where that is not the control.
 *
 * @param props - Everything a styled div takes.
 * @returns The part, carrying what the machine writes onto it.
 */
export function Anchor(props: AnchorProps): ReactElement {
  const api = usePopover();

  return <Drawn {...mergeProps(api.getAnchorProps(), props)} />;
}
