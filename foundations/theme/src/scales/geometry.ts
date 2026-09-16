/**
 * Draws the semantic sizes and spacing a recipe reads, each a scale of five from one base value.
 *
 * @remarks
 *   A recipe writes `height: "control.md"` and `paddingInline: "inset.md"` rather than a step of
 *   the spacing grid, so a theme moves the layout by restating one base rather than editing every
 *   recipe.
 */

import { type SemanticTokens } from "#pandacss.ts";

/**
 * Selects one of the five steps every scale here offers.
 */
export type Scale = "lg" | "md" | "sm" | "xl" | "xs";

/**
 * Describes one scale of five, as the compiler reads it.
 */
type Steps = Record<Scale, Record<"value", string>>;

/**
 * Describes a category of semantic sizes or spacing.
 */
type Sized = NonNullable<SemanticTokens["sizes"]>;

/**
 * Places each step as a share of the base, for a control's height.
 */
const CONTROLS: Readonly<Record<Scale, number>> = { lg: 1.1, md: 1, sm: 0.9, xl: 1.2, xs: 0.8 };

/**
 * Places each step as a share of the base, for an icon's box.
 */
const ICONS: Readonly<Record<Scale, number>> = { lg: 1.2, md: 1, sm: 0.8, xl: 1.6, xs: 0.6 };

/**
 * Places each step as a share of the base, for the padding inside a control.
 */
const INSETS: Readonly<Record<Scale, number>> = { lg: 1.25, md: 1, sm: 0.75, xl: 1.5, xs: 0.5 };

/**
 * Places each step as a share of the base, for the gap between things.
 */
const GAPS: Readonly<Record<Scale, number>> = { lg: 1.5, md: 1, sm: 0.75, xl: 2, xs: 0.5 };

/**
 * Draws five steps from a base in rem.
 */
function scaled(base: number, shares: Readonly<Record<Scale, number>>): Steps {
  return {
    lg: { value: `${(base * shares.lg).toFixed(4)}rem` },
    md: { value: `${(base * shares.md).toFixed(4)}rem` },
    sm: { value: `${(base * shares.sm).toFixed(4)}rem` },
    xl: { value: `${(base * shares.xl).toFixed(4)}rem` },
    xs: { value: `${(base * shares.xs).toFixed(4)}rem` },
  };
}

/**
 * Draws the heights of a control, keyed `xs` to `xl`.
 *
 * @param base - The height of a medium control, in rem.
 */
export function controls(base = 2.5): Sized {
  return scaled(base, CONTROLS);
}

/**
 * Draws the boxes of an icon, keyed `xs` to `xl`.
 *
 * @param base - The box of a medium icon, in rem.
 */
export function icons(base = 1.25): Sized {
  return scaled(base, ICONS);
}

/**
 * Draws the padding inside a control, keyed `xs` to `xl`.
 *
 * @param base - The padding of a medium control, in rem.
 */
export function insets(base = 1): Sized {
  return scaled(base, INSETS);
}

/**
 * Draws the gaps between things, keyed `xs` to `xl`.
 *
 * @param base - The gap inside a medium control, in rem.
 */
export function gaps(base = 0.5): Sized {
  return scaled(base, GAPS);
}
