/**
 * Draws the words naming the group.
 *
 * @remarks
 *   The element is `legend`. A screen reader reads it before each control in the group, so a set of
 *   radio options is announced as "Delivery, Standard, radio button 1 of 3" rather than as three
 *   unrelated buttons. Nothing else gives a group of controls one name.
 *   It stays reachable while the group is disabled, which is the exception the specification makes
 *   for the first legend.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#fieldset/context.ts";
import { useFieldset } from "#fieldset/state.ts";

/**
 * Draws the words at the size the root states.
 */
const Worded = withContext("legend", "legend");

/**
 * Describes what the legend takes: everything a styled legend takes.
 */
export type LegendProps = ComponentProps<typeof Worded>;

/**
 * Labels the group, for every control inside it.
 *
 * @param props - Everything a styled legend takes.
 * @returns The words, carrying the identifier the group's texts are keyed by.
 */
export function Legend(props: LegendProps): ReactElement {
  const { ids } = useFieldset();

  return <Worded id={ids.label} {...props} />;
}
