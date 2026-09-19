/**
 * Draws the heading naming a set of rows.
 *
 * @remarks
 *   It carries a presentation role and the group points at it, so the words reach a reader through
 *   the group's name rather than as a row of the list. A heading counted as a row would be one a
 *   reader walks onto and cannot choose.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#listbox/context.ts";
import { useListbox } from "#listbox/machine.ts";

/**
 * Draws the heading at the size the root states.
 */
const Headed = withContext("span", "itemGroupLabel");

/**
 * Describes what a group's heading takes.
 */
export interface ItemGroupLabelProps extends ComponentProps<typeof Headed> {
  /**
   * The identifier of the group these words name.
   */
  readonly htmlFor: string;
}

/**
 * Labels a set of rows, without being a row itself.
 *
 * @param props - The group it names, and everything a styled span takes.
 * @returns The heading, pointed at by its group.
 */
export function ItemGroupLabel({ htmlFor, ...rest }: ItemGroupLabelProps): ReactElement {
  const api = useListbox();

  return <Headed {...mergeProps(api.getItemGroupLabelProps({ htmlFor }), rest)} />;
}
