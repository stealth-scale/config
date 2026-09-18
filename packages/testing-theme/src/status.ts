/**
 * Measures whether the four status palettes can be told from each other, as a solid and as an
 * ink, in both modes.
 *
 * @remarks
 *   A status is read from its color before its word, so information, success, warning and error
 *   have to keep a distance from each other in OKLab. The gate holds the solids to it. The inks
 *   are measured for the report alone, because an ink that reads at 7:1 on a dark page is a pale
 *   tint whatever its hue, and four pale tints sit close together however well the theme is
 *   drawn. The distance under a color vision deficiency is reported rather than gated for the
 *   same reason: a red and a green converge for a reader with deuteranopia whatever the theme
 *   does, and the recipe pairs each status with an icon for that reader.
 */

import { type Mode, MODES, STATUSES, type Theme } from "@stealthscale/theme/authoring";

import { type Thresholds } from "#contrast.ts";
import { colorAt, type Resolving } from "#theme.ts";
import { distance } from "#vision.ts";

/**
 * Lists the roles a status is read from: its fill and its ink.
 */
const READ_FROM = ["solid", "fg"];

/**
 * Fixes the role the gate holds the statuses apart on.
 */
const GATED = "solid";

/**
 * Describes one pair of statuses to measure on one role.
 */
export interface StatusPair {
  /**
   * The first status.
   */
  one: string;

  /**
   * The second status.
   */
  other: string;

  /**
   * The role both are read on.
   */
  role: string;
}

/**
 * Lists every pair of statuses on each role, each pair once.
 */
export function statusPairs(): readonly StatusPair[] {
  return READ_FROM.flatMap((role) =>
    STATUSES.flatMap((one, index) =>
      STATUSES.slice(index + 1).map((other) => ({ one, other, role })),
    ),
  );
}

/**
 * Measures the distance between two statuses on one role in one mode.
 *
 * @returns The OKLab distance, or `NaN` where either color cannot be resolved.
 */
export function statusDistance(
  theme: Theme,
  pair: StatusPair,
  mode: Mode,
  options: Resolving,
): number {
  const first = colorAt(theme, `${pair.one}.${pair.role}`, mode, options);
  const second = colorAt(theme, `${pair.other}.${pair.role}`, mode, options);

  return first === undefined || second === undefined ? Number.NaN : distance(first, second);
}

/**
 * Reports each pair of statuses closer than the status distance on their solids, in either
 * mode, or one that could not be measured.
 */
export function distinct(
  theme: Theme,
  options: Resolving,
  thresholds: Thresholds,
): readonly string[] {
  const gated = statusPairs().filter((pair) => pair.role === GATED);

  return MODES.flatMap((mode) =>
    gated.flatMap((pair) => {
      const apart = statusDistance(theme, pair, mode, options);
      const where = `${pair.one}.${pair.role} and ${pair.other}.${pair.role}`;

      if (Number.isNaN(apart)) return [`${theme.name} ${where} cannot be measured in ${mode}`];
      if (apart >= thresholds.status) return [];

      return [
        `${theme.name} ${where} differ by ${apart.toFixed(3)} in ${mode}, below ${String(thresholds.status)}`,
      ];
    }),
  );
}
