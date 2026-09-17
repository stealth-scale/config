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

import { colorsOf, palettesOf, resolved, type Resolving } from "#theme.ts";
import { nodeAt } from "#tokens.ts";

/**
 * Fixes the ratio each class of pair is held to.
 */
export interface Thresholds {
  /**
   * The ratio a line or a fill has to clear against the surface it sits on.
   */
  boundary: number;

  /**
   * The ratio a focus ring has to clear against every surface.
   */
  focus: number;

  /**
   * The ratio text has to clear against the surface it is set on.
   */
  text: number;
}

/**
 * Fixes the thresholds WCAG sets: 7:1 for text at AAA, and 3:1 for a boundary or a focus ring.
 */
export const THRESHOLDS: Thresholds = { boundary: 3, focus: 3, text: 7 };

/**
 * Lists the surfaces text and lines are drawn on.
 */
const SURFACES = ["bg", "bg.subtle", "bg.muted", "bg.emphasized", "bg.panel", "bg.popover"];

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
interface Pair {
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
 * Reads the color a dotted path names in one mode, or undefined where it cannot be resolved.
 *
 * @remarks
 *   A path the theme states is read from the theme, with a group read at its own value. A path
 *   the theme leaves to the preset beneath it is resolved as a reference, which the resolver
 *   follows into that preset.
 */
function colorAt(theme: Theme, path: string, mode: Mode, options: Resolving): string | undefined {
  const node = nodeAt(colorsOf(theme), path);
  const token =
    typeof node === "object" && node !== null && !("value" in node)
      ? nodeAt(node, "DEFAULT")
      : node;

  return resolved(theme, token ?? { value: `{colors.${path}}` }, mode, options);
}

/**
 * Measures every pair in both modes and reports each one below its ratio, or one that could not
 * be measured.
 */
function failing(theme: Theme, pairs: readonly Pair[], options: Resolving): readonly string[] {
  return MODES.flatMap((mode) =>
    pairs.flatMap(({ back, front, minimum }) => {
      const before = colorAt(theme, front, mode, options);
      const behind = colorAt(theme, back, mode, options);
      const ratio =
        before === undefined || behind === undefined ? Number.NaN : contrast(before, behind);

      if (ratio >= minimum) return [];

      const measured = Number.isNaN(ratio) ? "cannot be measured" : `measures ${ratio.toFixed(2)}`;

      return [`${theme.name} ${front} on ${back} ${measured} in ${mode}, below ${String(minimum)}`];
    }),
  );
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
 * Reports every text pair below the text ratio: the inks on the surfaces, and each palette's inks
 * on its fills and on the page.
 */
export function text(theme: Theme, options: Resolving, thresholds: Thresholds): readonly string[] {
  const pairs = onSurfaces(INKS, thresholds.text).concat(
    perPalette(theme, [...PALETTE_TEXT, ["fg", "bg"]], thresholds.text),
  );

  return failing(theme, pairs, options);
}

/**
 * Reports every boundary pair below the boundary ratio: the emphasized line and the subtle ink on
 * the surfaces, and each palette's solid and lines on the page.
 */
export function boundary(
  theme: Theme,
  options: Resolving,
  thresholds: Thresholds,
): readonly string[] {
  const pairs = onSurfaces(["border.emphasized", "fg.subtle"], thresholds.boundary).concat(
    perPalette(
      theme,
      PALETTE_BOUNDARY.map((role) => [role, "bg"] as const),
      thresholds.boundary,
    ),
  );

  return failing(theme, pairs, options);
}

/**
 * Reports every palette's focus ring below the focus ratio on any surface.
 */
export function focus(theme: Theme, options: Resolving, thresholds: Thresholds): readonly string[] {
  const rings = palettesOf(theme).map((palette) => `${palette}.focusRing`);

  return failing(theme, onSurfaces(rings, thresholds.focus), options);
}
