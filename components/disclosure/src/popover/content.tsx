/**
 * Draws the panel itself.
 *
 * @remarks
 *   The machine gives it the dialog role and points it at the heading and the paragraph inside it,
 *   so a screen reader announces what the panel is for as it opens. It takes focus on opening and
 *   gives it back to the control on closing.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#popover/context.ts";
import { usePopover } from "#popover/machine.ts";

/**
 * Draws the part at the size the root states.
 */
const Drawn = withContext("div", "content");

/**
 * Describes what the part takes.
 */
export type ContentProps = ComponentProps<typeof Drawn>;

/**
 * Draws the panel itself.
 *
 * @param props - Everything a styled div takes.
 * @returns The part, carrying what the machine writes onto it.
 */
export function Content(props: ContentProps): ReactElement {
  const api = usePopover();

  return <Drawn {...mergeProps(api.getContentProps(), props)} />;
}
