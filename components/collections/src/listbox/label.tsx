/**
 * Draws the words naming the whole set.
 *
 * @remarks
 *   The machine points the list's `aria-labelledby` at this part, so the words a reader hears on
 *   reaching the list are the words on the screen. A list drawn without one states `aria-label` on
 *   the content instead, and a list with neither is announced as an unnamed listbox.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#listbox/context.ts";
import { useListbox } from "#listbox/machine.ts";

/**
 * Draws the words at the size the root states.
 */
const Named = withContext("span", "label");

/**
 * Describes what the label takes.
 */
export type LabelProps = ComponentProps<typeof Named>;

/**
 * Labels the set, for a reader and on the screen alike.
 *
 * @param props - Everything a styled span takes.
 * @returns The words, pointed at by the list.
 */
export function Label(props: LabelProps): ReactElement {
  const api = useListbox();

  return <Named {...mergeProps(api.getLabelProps(), props)} />;
}
