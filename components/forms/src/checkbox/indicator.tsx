/**
 * Draws the mark inside the box, for one of the two states that carry one.
 *
 * @remarks
 *   A checkbox reports three states and two of them carry a mark, so the two marks are two
 *   indicators and each states which state it belongs to. A checkbox with one indicator and no
 *   `indeterminate` draws the tick and nothing else, which is correct for a box that never goes
 *   partly on.
 *   The mark says nothing a screen reader needs. The input inside the root already reports whether
 *   the box is checked, so a caller hands over a glyph without naming it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#checkbox/context.ts";
import { useCheckbox } from "#checkbox/machine.ts";

/**
 * Draws the mark inside the box the root states.
 */
const Marked = withContext("span", "indicator");

/**
 * Describes what an indicator takes.
 */
export interface IndicatorProps extends Omit<ComponentProps<typeof Marked>, "hidden"> {
  /**
   * Whether this mark belongs to the partly-on state rather than the on state.
   */
  readonly indeterminate?: boolean | undefined;
}

/**
 * Shows the mark while the checkbox is in the state the mark belongs to.
 *
 * @param props - Whether the mark is the partly-on one, and everything a styled span takes.
 * @returns The mark, drawn for its own state and hidden for the rest.
 */
export function Indicator({ indeterminate = false, ...rest }: IndicatorProps): ReactElement {
  const api = useCheckbox();
  const shown = indeterminate ? api.indeterminate : api.checked && !api.indeterminate;

  return <Marked {...mergeProps(api.getIndicatorProps(), rest)} hidden={!shown} />;
}
