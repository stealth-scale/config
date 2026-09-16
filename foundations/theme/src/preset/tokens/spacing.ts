/**
 * Defines the spacing grid, a quarter rem per step.
 *
 * @remarks
 *   The compiler's own grid, restated here as data so the vocabulary defines each step once. The
 *   grid runs in halves up to six rem and then in larger jumps, because nothing on a page is
 *   spaced by 57 pixels. A recipe reads the semantic spacing, `inset` and `gap`, and a theme moves
 *   those; the grid is what a page layout and the semantic scales are measured against. The
 *   compiler derives the negative steps itself.
 */

import { type Tokens } from "#pandacss.ts";

/**
 * Describes the spacing a theme states.
 */
type Spacing = NonNullable<Tokens["spacing"]>;

/**
 * Lists every step of the grid, in quarter rems.
 */
const STEPS: readonly number[] = [
  0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32,
  36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96,
];

/**
 * Fixes the size of one step of the grid, in rem.
 */
const STEP = 0.25;

/**
 * Lists the grid as tokens, keyed by step, which the spacing and the sizes share.
 */
export const grid: Readonly<Record<string, Record<"value", string>>> = Object.fromEntries(
  STEPS.map((step) => [String(step), { value: `${String(step * STEP)}rem` }]),
);

/**
 * Lists the spacing, which is the grid.
 */
export const spacing: Spacing = grid;
