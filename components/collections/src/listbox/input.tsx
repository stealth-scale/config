/**
 * Draws the field a person narrows the list from.
 *
 * @remarks
 *   The field keeps focus while the highlight moves over the rows, and the machine points
 *   `aria-activedescendant` from here at the row a reader is on. That is what lets a person type
 *   and walk the rows without leaving the field, which a list that took focus itself cannot do.
 *   Narrowing is the caller's. The field reports what was typed and the caller hands back a
 *   collection holding what is left, so the machine never filters and never holds two lists.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#listbox/context.ts";
import { useListbox } from "#listbox/machine.ts";

/**
 * Draws the field at the size the root states.
 */
const Typed = withContext("input", "input");

/**
 * Describes what the field takes.
 */
export type InputProps = ComponentProps<typeof Typed>;

/**
 * Takes what a person types, and walks the rows without giving up focus.
 *
 * @param props - Everything a styled input takes.
 * @returns The field, naming the list it drives and the row a reader is on.
 */
export function Input(props: InputProps): ReactElement {
  const api = useListbox();

  return <Typed {...mergeProps(api.getInputProps(), props)} />;
}
