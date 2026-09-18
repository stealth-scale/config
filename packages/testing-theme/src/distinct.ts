/**
 * Measures whether the steps a page and a palette are drawn from can be told apart: consecutive
 * surfaces, fills, inks and lines differ in lightness by at least a minimum.
 *
 * @remarks
 *   The contrast gate reads a pair of a text and its surface. It says nothing about two surfaces
 *   beside each other, and a theme that places a hovered fill on the same step as the fill at rest
 *   passes every text pair with a hover that no reader sees. The distance is measured on the OKLab
 *   lightness axis, which is the axis the foundation's own ramps are stepped along.
 */

import { MODES, type Theme } from "@stealthscale/theme/authoring";

import { type Thresholds } from "#contrast.ts";
import { lightnessAt, palettesOf, type Resolving } from "#theme.ts";

/**
 * Lists the surfaces in the order they step away from the page.
 */
const SURFACE_STEPS: ReadonlyArray<readonly [string, string]> = [
  ["bg", "bg.subtle"],
  ["bg.subtle", "bg.muted"],
  ["bg.muted", "bg.emphasized"],
];

/**
 * Lists the inks in the order they fade.
 */
const INK_STEPS: ReadonlyArray<readonly [string, string]> = [
  ["fg", "fg.muted"],
  ["fg.muted", "fg.subtle"],
];

/**
 * Lists the lines in the order they weigh.
 */
const LINE_STEPS: ReadonlyArray<readonly [string, string]> = [
  ["border.subtle", "border.muted"],
  ["border.muted", "border"],
  ["border", "border.emphasized"],
];

/**
 * Lists the steps of one palette a reader tells apart: the three quiet fills, the solid and its
 * hover, the two inks, and the line and its hover.
 */
const PALETTE_STEPS: ReadonlyArray<readonly [string, string]> = [
  ["subtle", "muted"],
  ["muted", "emphasized"],
  ["solid", "solid.hover"],
  ["fg", "fg.muted"],
  ["border", "border.hover"],
];

/**
 * Reports each pair of steps closer in lightness than the minimum, in either mode, or one that
 * could not be measured.
 */
function apart(
  theme: Theme,
  pairs: ReadonlyArray<readonly [string, string]>,
  options: Resolving,
  minimum: number,
): readonly string[] {
  return MODES.flatMap((mode) =>
    pairs.flatMap(([one, other]) => {
      const first = lightnessAt(theme, one, mode, options);
      const second = lightnessAt(theme, other, mode, options);

      if (first === undefined || second === undefined) {
        return [`${theme.name} ${one} and ${other} cannot be measured in ${mode}`];
      }

      const distance = Math.abs(first - second);

      if (distance >= minimum) return [];

      return [
        `${theme.name} ${one} and ${other} differ by ${distance.toFixed(3)} in ${mode}, below ${String(minimum)}`,
      ];
    }),
  );
}

/**
 * Reports two consecutive surfaces a reader cannot tell apart.
 */
export function surfaces(
  theme: Theme,
  options: Resolving,
  thresholds: Thresholds,
): readonly string[] {
  return apart(theme, SURFACE_STEPS, options, thresholds.distinct);
}

/**
 * Reports two consecutive inks a reader cannot tell apart.
 */
export function inks(theme: Theme, options: Resolving, thresholds: Thresholds): readonly string[] {
  return apart(theme, INK_STEPS, options, thresholds.distinct);
}

/**
 * Reports two consecutive lines a reader cannot tell apart.
 */
export function lines(theme: Theme, options: Resolving, thresholds: Thresholds): readonly string[] {
  return apart(theme, LINE_STEPS, options, thresholds.distinct);
}

/**
 * Reports two steps of a palette a reader cannot tell apart: a fill from the next, a solid from
 * its hover, an ink from the muted one, or a line from its hover.
 */
export function fills(theme: Theme, options: Resolving, thresholds: Thresholds): readonly string[] {
  return palettesOf(theme).flatMap((palette) =>
    apart(
      theme,
      PALETTE_STEPS.map(([one, other]) => [`${palette}.${one}`, `${palette}.${other}`] as const),
      options,
      thresholds.distinct,
    ),
  );
}
