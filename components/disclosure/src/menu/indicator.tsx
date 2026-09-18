/**
 * Draws the mark on the control that says whether the menu is open.
 *
 * @remarks
 *   The machine writes the open state onto it and the recipe turns it half a revolution, so a
 *   caller draws whatever artwork they like inside and the turn follows the menu. It carries no
 *   label of its own, because the control beside it already says what pressing it does.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Draws the mark at the size the root states.
 */
const Marked = withContext("div", "indicator");

/**
 * Describes what the mark takes.
 */
export type IndicatorProps = ComponentProps<typeof Marked>;

/**
 * Says whether the menu is open.
 *
 * @param props - Everything a styled div takes.
 * @returns The mark, carrying the open state.
 */
export function Indicator(props: IndicatorProps): ReactElement {
  const { api } = useMenu();

  return <Marked {...mergeProps(api.getIndicatorProps(), props)} />;
}
