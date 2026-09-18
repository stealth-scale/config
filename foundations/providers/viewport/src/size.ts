/**
 * Reads the widths the design system's breakpoints start at.
 */

import { breakpointKeys, type BreakpointToken, token } from "@stealthscale/theme";

/**
 * The root font size the styling engine converts a length against.
 */
const ROOT_FONT_SIZE = 16;

/**
 * Matches the unit a length ends in.
 */
const UNIT = /[a-z]+$/u;

/**
 * The breakpoint every theme starts at, which no theme lists and which has no token.
 */
const BASE = "base";

/**
 * A breakpoint a hook may ask for, which is `base` or one the design system's vocabulary states.
 *
 * @remarks
 *   Typed from the vocabulary rather than as text, so a breakpoint misspelt in a component is
 *   refused where it is written rather than answered with nothing.
 */
export type Breakpoint = BreakpointToken | typeof BASE;

/**
 * Describes one width a subtree can be laid out for, named after the breakpoint that starts there.
 */
export interface Size {
  /**
   * The narrowest width it covers, in pixels.
   */
  min: number;

  /**
   * The name a toolbar lists it under: `sm`, `md`, `lg`.
   */
  name: string;
}

/**
 * The width `base` starts at, which is none.
 */
export const BASE_SIZE: Size = { min: 0, name: BASE };

/**
 * Reads a length the way the styling engine writes one, in pixels.
 *
 * @remarks
 *   The engine keeps its breakpoints in rem, and a theme may state one in px or em. Either way the
 *   root font size is the engine's own sixteen pixels rather than the document's, because the
 *   engine compiled the query against that number and the query is what a browser matches.
 * @param length - The length, such as `30rem` or `480px`, or nothing where a breakpoint states no
 *   start.
 * @returns The width in pixels, and zero for no length.
 */
export function pixelsOf(length: null | string | undefined): number {
  if (length === null || length === undefined) return 0;

  const value = Number(length.replace(UNIT, ""));

  return length.endsWith("em") ? value * ROOT_FONT_SIZE : value;
}

/**
 * The sizes read from the vocabulary, built on first use.
 */
let known: readonly Size[] | undefined;

/**
 * Reads the widths the design system's breakpoints start at.
 *
 * @remarks
 *   Read from the compiled vocabulary rather than from a theme, because a breakpoint is physics. A
 *   theme that moved one would move it for every component written against the foundation, so the
 *   compiler's own preset states them and a theme leaves them alone. The list is built once,
 *   because the vocabulary does not change while a page runs and a hook reads it on every render.
 *   `base` is left out. It starts at nothing and has no token, and every reader here puts it back
 *   itself. What this answers is the widths a page can be previewed at.
 * @returns One size per breakpoint above `base`, narrowest first.
 */
export function sizesOf(): readonly Size[] {
  known ??= breakpointKeys
    .filter((name): name is BreakpointToken => name !== BASE)
    .map((name) => ({ min: pixelsOf(token(`breakpoints.${name}`)), name }));

  return known;
}
