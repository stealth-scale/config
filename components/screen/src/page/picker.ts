/**
 * Draws the control a folded page offers in place of a strip of tabs.
 *
 * @remarks
 *   A strip of tabs does not survive a narrow page: the tabs either wrap onto three lines or scroll
 *   out of sight, and neither says how many there are. This is a control naming the tab a reader is
 *   on, which opens the rest as a list. The name is cut short before the mark at its end rather
 *   than wrapping the control, so the control keeps one line at every width. It states neither
 *   `aria-expanded` nor `aria-controls`, because it is the trigger of a disclosure rather than a
 *   disclosure of its own. Draw it as one: `<Menu.Trigger as={Page.Picker} />` gives it both, keeps
 *   them in step with the list, and gives a reader the keys the pattern calls for. A picker wired
 *   to a list by hand states them itself.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Draws the control at the room the navigation states.
 */
export const Picker = withContext("button", "picker", { defaultProps: { type: "button" } });

/**
 * Describes what the picker takes.
 */
export type PickerProps = ComponentProps<typeof Picker>;
