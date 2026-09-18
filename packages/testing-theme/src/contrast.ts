/**
 * Measures every pair of colors a page draws text, a line or a ring in, and reports the ones a
 * reader cannot use.
 *
 * @remarks
 *   The thresholds are WCAG 1.4.6 for text and 1.4.11 for a boundary or a focus indicator. The
 *   pairs are the ones the vocabulary draws: every ink on every surface, and every palette's inks
 *   on its fills, its solid and its lines on the page, and its ring on every surface.
 */

import { contrast, type Mode, MODES, type Theme } from "@stealthscale/theme/authoring";

import { colorAt, palettesOf, type Resolving } from "#theme.ts";

/**
 * Fixes the ratio each class of pair is held to, and the distance each class of step is held
 * apart.
 */
export interface Thresholds {
  /**
   * The ratio a line or a fill has to clear against the surface it sits on.
   */
  boundary: number;

  /**
   * The difference in OKLab lightness two consecutive steps have to keep, so a surface, a fill,
   * an ink or a line can be told from the one beside it.
   */
  distinct: number;

  /**
   * The ratio a focus ring has to clear against every surface.
   */
  focus: number;

  /**
   * The degrees a step of a ramp may drift from the ramp's median hue.
   */
  hue: number;

  /**
   * The distance in OKLab two status solids have to keep from each other.
   */
  status: number;

  /**
   * The ratio text has to clear against the surface it is set on.
   */
  text: number;
}

/**
 * Fixes the thresholds WCAG sets, 7:1 for text at AAA and 3:1 for a boundary or a focus ring, and
 * the distances a ramp keeps: a hundredth of the lightness axis between consecutive steps, a
 * twentieth of the OKLab space between status solids, and forty-five degrees of hue along a
 * ramp, which is how far an orange or a yellow drifts between its light end and its dark end.
 */
export const THRESHOLDS: Thresholds = {
  boundary: 3,
  distinct: 0.01,
  focus: 3,
  hue: 45,
  status: 0.05,
  text: 7,
};

/**
 * Lists the surfaces text and lines are drawn on.
 */
export const SURFACES = ["bg", "bg.subtle", "bg.muted", "bg.emphasized", "bg.panel", "bg.popover"];

/**
 * Lists the inks a page is written in.
 */
const INKS = ["fg", "fg.muted", "fg.info", "fg.success", "fg.warning", "fg.error"];

/**
 * Lists the text pairs each palette draws: the ink and the fill it is set on.
 */
const PALETTE_TEXT: ReadonlyArray<readonly [ink: string, fill: string]> = [
  ["contrast", "solid"],
  ["contrast", "solid.hover"],
  ["fg", "subtle"],
  ["fg", "muted"],
  ["fg", "emphasized"],
  ["fg.muted", "subtle"],
  ["fg.muted", "muted"],
  ["fg.muted", "emphasized"],
];

/**
 * Lists the palette roles that have to stand out against the page.
 */
const PALETTE_BOUNDARY = ["solid", "border", "border.hover"];

/**
 * Describes one pair to measure: what is in front, what is behind, and the ratio it is held to.
 */
export interface Pair {
  /**
   * The token path behind.
   */
  back: string;

  /**
   * The token path in front.
   */
  front: string;

  /**
   * The ratio the pair has to clear.
   */
  minimum: number;
}

/**
 * Describes one pair as measured in one mode.
 */
export interface Measured extends Pair {
  /**
   * The mode the pair was measured in.
   */
  mode: Mode;

  /**
   * The ratio measured, or `NaN` where a color could not be resolved.
   */
  ratio: number;
}

/**
 * Measures every pair in both modes.
 */
export function measured(
  theme: Theme,
  pairs: readonly Pair[],
  options: Resolving,
): readonly Measured[] {
  return MODES.flatMap((mode) =>
    pairs.map((pair) => {
      const before = colorAt(theme, pair.front, mode, options);
      const behind = colorAt(theme, pair.back, mode, options);
      const ratio =
        before === undefined || behind === undefined ? Number.NaN : contrast(before, behind);

      return { ...pair, mode, ratio };
    }),
  );
}

/**
 * Reports each measured pair below its ratio, or one that could not be measured.
 */
function failing(theme: Theme, pairs: readonly Pair[], options: Resolving): readonly string[] {
  return measured(theme, pairs, options).flatMap(({ back, front, minimum, mode, ratio }) => {
    if (ratio >= minimum) return [];

    const reading = Number.isNaN(ratio) ? "cannot be measured" : `measures ${ratio.toFixed(2)}`;

    return [`${theme.name} ${front} on ${back} ${reading} in ${mode}, below ${String(minimum)}`];
  });
}

/**
 * Pairs each front with every surface.
 */
function onSurfaces(fronts: readonly string[], minimum: number): readonly Pair[] {
  return fronts.flatMap((front) => SURFACES.map((back) => ({ back, front, minimum })));
}

/**
 * Pairs each role of each palette with the fill or the page it has to clear.
 */
function perPalette(
  theme: Theme,
  roles: ReadonlyArray<readonly [front: string, back: string]>,
  minimum: number,
): readonly Pair[] {
  return palettesOf(theme).flatMap((palette) =>
    roles.map(([front, back]) => ({
      back: back === "bg" ? back : `${palette}.${back}`,
      front: `${palette}.${front}`,
      minimum,
    })),
  );
}

/**
 * Lists every text pair: the inks on the surfaces, and each palette's inks on its fills and on
 * the page.
 */
export function textPairs(theme: Theme, thresholds: Thresholds): readonly Pair[] {
  return onSurfaces(INKS, thresholds.text).concat(
    perPalette(theme, [...PALETTE_TEXT, ["fg", "bg"]], thresholds.text),
  );
}

/**
 * Lists every boundary pair: the emphasized line and the subtle ink on the surfaces, and each
 * palette's solid and lines on the page.
 */
export function boundaryPairs(theme: Theme, thresholds: Thresholds): readonly Pair[] {
  return onSurfaces(["border.emphasized", "fg.subtle"], thresholds.boundary).concat(
    perPalette(
      theme,
      PALETTE_BOUNDARY.map((role) => [role, "bg"] as const),
      thresholds.boundary,
    ),
  );
}

/**
 * Lists every focus pair: each palette's ring on every surface.
 */
export function focusPairs(theme: Theme, thresholds: Thresholds): readonly Pair[] {
  return onSurfaces(
    palettesOf(theme).map((palette) => `${palette}.focusRing`),
    thresholds.focus,
  );
}

/**
 * Reports every text pair below the text ratio.
 */
export function text(theme: Theme, options: Resolving, thresholds: Thresholds): readonly string[] {
  return failing(theme, textPairs(theme, thresholds), options);
}

/**
 * Reports every boundary pair below the boundary ratio.
 */
export function boundary(
  theme: Theme,
  options: Resolving,
  thresholds: Thresholds,
): readonly string[] {
  return failing(theme, boundaryPairs(theme, thresholds), options);
}

/**
 * Reports every palette's focus ring below the focus ratio on any surface.
 */
export function focus(theme: Theme, options: Resolving, thresholds: Thresholds): readonly string[] {
  return failing(theme, focusPairs(theme, thresholds), options);
}
