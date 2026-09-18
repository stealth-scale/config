/**
 * Draws the semantic sizes and spacing a recipe reads, each a scale of eight from one base value.
 *
 * @remarks
 *   A recipe writes `height: "control.md"` and `paddingInline: "inset.md"` rather than a step of
 *   the spacing grid, so a theme moves the layout by restating one base rather than editing every
 *   recipe. The three steps above `xl` are for a hero: a call to action, the mark beside it and
 *   the room around it grow together on the same names.
 */

import { type SemanticTokens } from "#pandacss.ts";

/**
 * Selects one of the eight steps every scale here offers.
 */
export type Scale = "2xl" | "3xl" | "4xl" | "lg" | "md" | "sm" | "xl" | "xs";

/**
 * Lists the eight steps in the order they grow, which is the order a recipe offers them in and a
 * README reads them in.
 */
export const SCALE: readonly Scale[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"];

/**
 * Selects one of the twelve measures a page and its columns are read at.
 */
export type Width =
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "lg"
  | "md"
  | "sm"
  | "xl"
  | "xs";

/**
 * Selects one of the shapes a box that holds a picture is drawn in.
 */
export type Ratio = "golden" | "landscape" | "portrait" | "square" | "ultrawide" | "video" | "wide";

/**
 * Lists the shapes, from the squarest to the widest.
 */
export const RATIOS: readonly Ratio[] = [
  "square",
  "landscape",
  "portrait",
  "golden",
  "video",
  "wide",
  "ultrawide",
];

/**
 * Selects one of the corners a box is drawn with: the three a theme draws from one value, and the
 * one that rounds a box to its own edge.
 */
export type Corner = "full" | "l1" | "l2" | "l3";

/**
 * Lists the corners, from the tightest to the fully round.
 */
export const CORNERS: readonly Corner[] = ["l1", "l2", "l3", "full"];

/**
 * Lists the measures in the order they grow.
 */
export const WIDTHS: readonly Width[] = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
];

/**
 * Describes one scale of eight, as the compiler reads it.
 */
type Steps = Record<Scale, Record<"value", string>>;

/**
 * Describes a category of semantic sizes or spacing.
 */
type Sized = NonNullable<SemanticTokens["sizes"]>;

/**
 * Places each step as a share of the base, for a control's height.
 */
const CONTROLS: Readonly<Record<Scale, number>> = {
  "2xl": 1.4,
  "3xl": 1.6,
  "4xl": 2,
  lg: 1.1,
  md: 1,
  sm: 0.9,
  xl: 1.2,
  xs: 0.8,
};

/**
 * Places each step as a share of the base, for an icon's box.
 */
const ICONS: Readonly<Record<Scale, number>> = {
  "2xl": 2,
  "3xl": 2.5,
  "4xl": 3,
  lg: 1.2,
  md: 1,
  sm: 0.8,
  xl: 1.6,
  xs: 0.6,
};

/**
 * Places each step as a share of the base, for the padding inside a control.
 */
const INSETS: Readonly<Record<Scale, number>> = {
  "2xl": 2,
  "3xl": 2.5,
  "4xl": 3,
  lg: 1.25,
  md: 1,
  sm: 0.75,
  xl: 1.5,
  xs: 0.5,
};

/**
 * Places each step as a share of the base, for the gap between things.
 */
const GAPS: Readonly<Record<Scale, number>> = {
  "2xl": 3,
  "3xl": 4,
  "4xl": 6,
  lg: 1.5,
  md: 1,
  sm: 0.75,
  xl: 2,
  xs: 0.5,
};

/**
 * Writes one step of a scale in rem.
 */
function step(base: number, share: number): Record<"value", string> {
  return { value: `${(base * share).toFixed(4)}rem` };
}

/**
 * Draws eight steps from a base in rem.
 */
function scaled(base: number, shares: Readonly<Record<Scale, number>>): Steps {
  return {
    "2xl": step(base, shares["2xl"]),
    "3xl": step(base, shares["3xl"]),
    "4xl": step(base, shares["4xl"]),
    lg: step(base, shares.lg),
    md: step(base, shares.md),
    sm: step(base, shares.sm),
    xl: step(base, shares.xl),
    xs: step(base, shares.xs),
  };
}

/**
 * Draws the heights of a control, keyed `xs` to `4xl`.
 *
 * @param base - The height of a medium control, in rem.
 */
export function controls(base = 2.5): Sized {
  return scaled(base, CONTROLS);
}

/**
 * Draws the boxes of an icon, keyed `xs` to `4xl`.
 *
 * @param base - The box of a medium icon, in rem.
 */
export function icons(base = 1.25): Sized {
  return scaled(base, ICONS);
}

/**
 * Draws the heights of a tag, keyed `xs` to `4xl`.
 *
 * @remarks
 *   A tag is a badge, a chip or a pill: something read beside a control rather than pressed, and
 *   drawn shorter than one. It grows on the control's own shares, so a theme that stretches its
 *   controls stretches the tags beside them by the same amount and the two keep their proportion.
 * @param base - The height of a medium tag, in rem.
 */
export function tags(base = 1.5): Sized {
  return scaled(base, CONTROLS);
}

/**
 * Draws the padding inside a control, keyed `xs` to `4xl`.
 *
 * @param base - The padding of a medium control, in rem.
 */
export function insets(base = 1): Sized {
  return scaled(base, INSETS);
}

/**
 * Draws the gaps between things, keyed `xs` to `4xl`.
 *
 * @param base - The gap inside a medium control, in rem.
 */
export function gaps(base = 0.5): Sized {
  return scaled(base, GAPS);
}
