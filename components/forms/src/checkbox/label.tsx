/**
 * Draws the words naming the checkbox.
 *
 * @remarks
 *   The element is `span` rather than `label`, because the root is already the label and a label
 *   inside a label names nothing. The machine points the input's `aria-labelledby` at this part, so
 *   the words a reader hears are the words on the screen.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#checkbox/context.ts";
import { useCheckbox } from "#checkbox/machine.ts";

/**
 * Draws the words at the size the root states.
 */
const Named = withContext("span", "label");

/**
 * Describes what the label takes.
 */
export type LabelProps = ComponentProps<typeof Named>;

/**
 * Labels the checkbox, for a reader and on the screen alike.
 *
 * @param props - Everything a styled span takes.
 * @returns The words, carrying the state the machine is in.
 */
export function Label(props: LabelProps): ReactElement {
  const api = useCheckbox();

  return <Named {...mergeProps(api.getLabelProps(), props)} />;
}
