/**
 * Draws the type scale: the sizes, and the line height and tracking each one is read at.
 */

import { type TextStyles, type Tokens } from "#pandacss.ts";

/**
 * Describes the sizes a theme states.
 */
type Sizes = NonNullable<Tokens["fontSizes"]>;

/**
 * Places each step on the scale, counted in rungs from the body size.
 *
 * @remarks
 *   The display sizes climb faster than the ratio would take them, because a heading three rungs
 *   above the body reads as emphasis rather than as a heading.
 */
const STEPS: ReadonlyArray<readonly [name: string, rungs: number]> = [
  ["2xs", -3],
  ["xs", -2],
  ["sm", -1],
  ["md", 0],
  ["lg", 1],
  ["xl", 2],
  ["2xl", 3],
  ["3xl", 4.5],
  ["4xl", 6],
  ["5xl", 8],
  ["6xl", 10],
  ["7xl", 12],
];

/**
 * Sets the line height by size: small text needs the room, and large text is crowded by it.
 */
const LEADING: ReadonlyArray<readonly [ceiling: number, height: number]> = [
  [1.25, 1.5],
  [2, 1.35],
  [3, 1.2],
];

/**
 * Fixes the line height a display size is set at, once the table above runs out.
 */
const TIGHTEST = 1.1;

/**
 * Describes one step of the scale once placed.
 */
interface Step {
  /**
   * The step's name, `2xs` to `7xl`.
   */
  name: string;

  /**
   * The size, in rem.
   */
  rem: number;
}

/**
 * Places every step of the scale once.
 *
 * @param base - The body size, in rem.
 * @param ratio - The step between rungs.
 */
function steps(base: number, ratio: number): readonly Step[] {
  return STEPS.map(([name, rungs]) => ({ name, rem: base * ratio ** rungs }));
}

/**
 * Reads the line height for a size.
 */
function lineHeightFor(rem: number): number {
  return LEADING.find(([ceiling]) => rem <= ceiling)?.[1] ?? TIGHTEST;
}

/**
 * Reads the tracking for a size, which tightens as the size grows.
 */
function letterSpacingFor(rem: number): string {
  if (rem >= 2) return "-0.02em";
  if (rem >= 1.25) return "-0.01em";

  return "0em";
}

/**
 * Draws the sizes alone, keyed `2xs` to `7xl`, for a recipe that sets one without the leading that
 * goes with it.
 *
 * @param base - The body size, in rem.
 * @param ratio - The step between rungs.
 */
export function fontSizes(base = 1, ratio = 1.125): Sizes {
  return Object.fromEntries(
    steps(base, ratio).map(({ name, rem }) => [name, { value: `${rem.toFixed(4)}rem` }]),
  );
}

/**
 * Draws the text styles, keyed `2xs` to `7xl`: each size with the leading and tracking it is read
 * at.
 *
 * @remarks
 *   A recipe states `textStyle` rather than `fontSize`, so the three move together.
 * @param base - The body size, in rem.
 * @param ratio - The step between rungs.
 */
export function typography(base = 1, ratio = 1.125): TextStyles {
  return Object.fromEntries(
    steps(base, ratio).map(({ name, rem }) => [
      name,
      {
        value: {
          fontSize: `${rem.toFixed(4)}rem`,
          letterSpacing: letterSpacingFor(rem),
          lineHeight: String(lineHeightFor(rem)),
        },
      },
    ]),
  );
}
