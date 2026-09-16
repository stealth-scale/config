/**
 * Defines how heavy a line is, whether it is drawn as a border, an outline or an element standing
 * in for one, and the shorthand that carries the style along.
 *
 * @remarks
 *   Stated in pixels rather than off the spacing scale, because a rule is a graphic and not type:
 *   a reader who enlarges the text wants the words bigger, not the line between them thicker.
 *   Nearly everything is drawn at `sm`. A heavier rule is saying something, and `xl` is a slab.
 *   `xs` is a hairline, drawn on the displays that can and rounded up on the ones that cannot.
 */

import { type Tokens } from "#pandacss.ts";

/**
 * Describes the widths a theme states.
 */
type BorderWidths = NonNullable<Tokens["borderWidths"]>;

/**
 * Describes the shorthands a theme states.
 */
type Borders = NonNullable<Tokens["borders"]>;

/**
 * Lists the widths, from none to a slab.
 */
export const borderWidths: BorderWidths = {
  lg: { value: "4px" },
  md: { value: "2px" },
  none: { value: "0" },
  sm: { value: "1px" },
  xl: { value: "8px" },
  xs: { value: "0.5px" },
};

/**
 * Lists the same weights as the shorthand `border` takes, each derived from its width.
 *
 * @remarks
 *   Derived rather than restated, so a theme moving a weight moves both the shorthand and the
 *   width. No color: how thick a rule is measures something, and what color it is decides
 *   something, and a token setting both would make the two one choice.
 */
export const borders: Borders = {
  lg: { value: "{borderWidths.lg} solid" },
  md: { value: "{borderWidths.md} solid" },
  none: { value: "none" },
  sm: { value: "{borderWidths.sm} solid" },
  xl: { value: "{borderWidths.xl} solid" },
  xs: { value: "{borderWidths.xs} solid" },
};
