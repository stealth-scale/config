/**
 * Draws the block the trigger shows and hides.
 *
 * @remarks
 *   The machine measures the block and writes its height as a custom property, which is what the
 *   animation runs to. It also hides the block from a screen reader and from the tab order while it
 *   is closed, so a control inside a closed block is not something a keyboard can reach.
 *   The open state arrives with an animation frame rather than with the press, which is how the
 *   machine keeps a block that starts open from animating in on the first render. A document that
 *   runs no animation frames therefore sees the block shown and no open state on it, so the
 *   specification beside this file measures the closed state and the hiding rather than the open
 *   state.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#collapsible/context.ts";
import { useCollapsible } from "#collapsible/machine.ts";

/**
 * Draws the block at the room the root states.
 */
const Shown = withContext("div", "content");

/**
 * Describes what the content takes.
 */
export type ContentProps = ComponentProps<typeof Shown>;

/**
 * Appears and goes as the trigger is pressed.
 *
 * @param props - Everything a styled div takes.
 * @returns The block, measured and named by the machine.
 */
export function Content(props: ContentProps): ReactElement {
  const api = useCollapsible();

  return <Shown {...mergeProps(api.getContentProps(), props)} />;
}
