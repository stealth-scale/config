/**
 * Draws the region a right-click or a long press opens the menu over.
 *
 * @remarks
 *   The machine opens the menu at the point the pointer was at rather than beside a control, which
 *   is what a context menu does. It handles the long press itself, so the same region answers a
 *   touch as well as a mouse, and it stops the browser drawing its own menu over ours.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Draws the region at the size the root states.
 */
const Held = withContext("div", "contextTrigger");

/**
 * Describes what the region takes.
 */
export interface ContextTriggerProps extends ComponentProps<typeof Held> {
  /**
   * The value that identifies this region, for a menu opened from more than one.
   */
  readonly value?: string | undefined;
}

/**
 * Opens the menu where the pointer is.
 *
 * @param props - The name of this region, and everything a styled div takes.
 * @returns The region, carrying what the machine writes onto it.
 */
export function ContextTrigger({ value, ...rest }: ContextTriggerProps): ReactElement {
  const { api } = useMenu();
  const named = value === undefined ? {} : { value };

  return <Held {...mergeProps(api.getContextTriggerProps(named), rest)} />;
}
