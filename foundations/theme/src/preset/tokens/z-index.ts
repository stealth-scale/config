/**
 * Defines the stacking order, so a dialog is never under the page it covers and a tooltip is
 * never under the dialog.
 *
 * @remarks
 *   Thirteen rungs, each far enough from the next that a component can sit a few steps above its
 *   rung without reaching the one above. `max` is the largest integer a browser accepts, for the
 *   one element that has to be above everything, such as a skip link while it has focus.
 */

import { type Tokens } from "#pandacss.ts";

/**
 * Describes the rungs a theme states.
 */
type ZIndex = NonNullable<Tokens["zIndex"]>;

/**
 * Places everything that stacks, lowest first.
 */
const LAYERS: ReadonlyArray<readonly [name: string, level: number]> = [
  ["hide", -1],
  ["base", 0],
  ["docked", 10],
  ["dropdown", 1000],
  ["sticky", 1100],
  ["banner", 1200],
  ["overlay", 1300],
  ["modal", 1400],
  ["popover", 1500],
  ["skipNav", 1600],
  ["toast", 1700],
  ["tooltip", 1800],
  ["max", 2_147_483_647],
];

/**
 * Lists the rungs, keyed by what stands on each.
 */
export const zIndex: ZIndex = Object.fromEntries(
  LAYERS.map(([name, level]) => [name, { value: level }]),
);
