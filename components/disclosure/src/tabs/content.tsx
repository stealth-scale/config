/**
 * Draws one panel of the set.
 *
 * @remarks
 *   A panel names the control that shows it with `value`. The machine writes the tabpanel role, the
 *   reference back to that control, and the hiding, so a panel nobody chose is out of the tab order
 *   and out of the accessibility tree.
 *   The panel takes a tab stop of its own where it holds nothing a keyboard can reach, which is how
 *   a person tabbing out of the strip lands on what they just chose rather than skipping it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tabs/context.ts";
import { useTabs } from "#tabs/machine.ts";

/**
 * Draws the panel at the room the root states.
 */
const Shown = withContext("div", "content");

/**
 * Describes what a panel takes.
 */
export interface ContentProps extends ComponentProps<typeof Shown> {
  /**
   * Says which control shows this panel.
   */
  readonly value: string;
}

/**
 * Appears while the control it names is the one in force.
 *
 * @param props - The control it names, and everything a styled div takes.
 * @returns The panel, named and hidden by the machine.
 */
export function Content({ value, ...rest }: ContentProps): ReactElement {
  const api = useTabs();

  return <Shown {...mergeProps(api.getContentProps({ value }), rest)} />;
}
