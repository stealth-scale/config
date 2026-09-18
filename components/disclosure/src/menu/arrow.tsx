/**
 * Draws the point between the panel and the control it opened from.
 *
 * @remarks
 *   The machine places it against whichever side the panel was put on and sizes it from the custom
 *   property the recipe sets. It holds the tip, which is the rotated square that carries the fill
 *   and the edge, because a point drawn as one element cannot carry an edge on two sides alone.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Draws the point at the size the root states.
 */
const Pointed = withContext("div", "arrow");

/**
 * Describes what the point takes.
 */
export type ArrowProps = ComponentProps<typeof Pointed>;

/**
 * Points from the panel back at the control.
 *
 * @param props - Everything a styled div takes.
 * @returns The point, carrying the place the machine measured.
 */
export function Arrow(props: ArrowProps): ReactElement {
  const { api } = useMenu();

  return <Pointed {...mergeProps(api.getArrowProps(), props)} />;
}
