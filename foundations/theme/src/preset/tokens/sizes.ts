/**
 * Defines the sizes: the spacing grid again, and the named widths a panel or a column is given.
 *
 * @remarks
 *   The compiler's own set, restated here as data so the vocabulary defines each size once. The
 *   grid is shared with the spacing, because a box sized to a step of the grid lines up with a
 *   box spaced by it. The named widths run from `xs` at 20rem to `8xl` at 90rem, and `prose` is
 *   the measure a column of text is read at. The compiler derives a size per breakpoint itself.
 */

import { type Tokens } from "#pandacss.ts";
import { grid } from "#preset/tokens/spacing.ts";

/**
 * Describes the sizes a theme states.
 */
type Sizes = NonNullable<Tokens["sizes"]>;

/**
 * Lists the named widths and the three intrinsic sizes.
 */
const NAMED: Sizes = {
  "2xl": { value: "42rem" },
  "3xl": { value: "48rem" },
  "4xl": { value: "56rem" },
  "5xl": { value: "64rem" },
  "6xl": { value: "72rem" },
  "7xl": { value: "80rem" },
  "8xl": { value: "90rem" },
  fit: { value: "fit-content" },
  full: { value: "100%" },
  lg: { value: "32rem" },
  max: { value: "max-content" },
  md: { value: "28rem" },
  min: { value: "min-content" },
  prose: { value: "60ch" },
  sm: { value: "24rem" },
  xl: { value: "36rem" },
  xs: { value: "20rem" },
};

/**
 * Lists the sizes: every step of the grid, then the named widths.
 */
export const sizes: Sizes = { ...grid, ...NAMED };
