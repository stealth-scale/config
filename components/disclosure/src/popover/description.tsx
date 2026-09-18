/**
 * Draws the paragraph the panel is described by.
 *
 * @remarks
 *   The machine points the panel at it, so it is read out after the heading as the panel opens.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#popover/context.ts";
import { usePopover } from "#popover/machine.ts";

/**
 * Draws the part at the size the root states.
 */
const Drawn = withContext("p", "description");

/**
 * Describes what the part takes.
 */
export type DescriptionProps = ComponentProps<typeof Drawn>;

/**
 * Draws the paragraph the panel is described by.
 *
 * @param props - Everything a styled p takes.
 * @returns The part, carrying what the machine writes onto it.
 */
export function Description(props: DescriptionProps): ReactElement {
  const api = usePopover();

  return <Drawn {...mergeProps(api.getDescriptionProps(), props)} />;
}
