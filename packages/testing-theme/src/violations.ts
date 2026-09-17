/**
 * Runs every check a theme is held to and reports each breach as one sentence.
 *
 * @remarks
 *   Every selected check runs, and a breach found by one never stops another, so a specification
 *   reports the whole set in a single run. Skipping a check costs a written reason.
 */

import { type Preset, type Theme } from "@stealthscale/theme/authoring";

import * as contract from "#contract.ts";
import * as contrast from "#contrast.ts";
import { installed } from "#fonts.ts";
import { type Declared } from "#recipe.ts";

/**
 * Enumerates every check a theme specification can select or skip.
 */
export type ThemeCheck =
  | "contract.compounds"
  | "contract.extensions"
  | "contract.listed"
  | "contract.modes"
  | "contract.references"
  | "contract.roles"
  | "contract.styles"
  | "contrast.boundary"
  | "contrast.focus"
  | "contrast.text"
  | "fonts.installed"
  | "name.attribute";

/**
 * Describes what a theme specification states beside the theme.
 */
export interface ThemeChecks {
  /**
   * The theme package's source directory. With it, every file under `recipes/` and
   * `slot-recipes/` that exports `extension` has to be listed in the theme, and a font package has
   * to resolve from the package.
   */
  at?: string | undefined;

  /**
   * The preset the theme is layered on, read for the scales a reference names and the theme does
   * not restate.
   */
  base?: Preset | undefined;

  /**
   * The recipe keys the workspace publishes, as a list, or as a map from each key to its recipe.
   * An extension naming any other key is reported, and with the map, so is a compound whose
   * selection the recipe does not declare.
   */
  recipes?: Readonly<Record<string, Declared>> | readonly string[] | undefined;

  /**
   * The checks to leave out, each with a reason a reviewer can weigh.
   */
  skip?: Readonly<Partial<Record<ThemeCheck, string>>> | undefined;

  /**
   * The ratio each class of pair is held to, over the defaults from WCAG 1.4.6 and 1.4.11.
   */
  thresholds?: Partial<contrast.Thresholds> | undefined;
}

/**
 * Matches a name a page can write as the value of the theme attribute.
 */
const ATTRIBUTE_VALUE = /^[a-z][a-z0-9-]*$/u;

/**
 * Reports whether the recipes were stated as a list of keys rather than a map.
 */
function isKeys(recipes: NonNullable<ThemeChecks["recipes"]>): recipes is readonly string[] {
  return Array.isArray(recipes);
}

/**
 * Lists the recipe keys the specification states, in either form.
 */
function keysOf(options: ThemeChecks): readonly string[] | undefined {
  if (options.recipes === undefined) return undefined;

  return isKeys(options.recipes) ? options.recipes : Object.keys(options.recipes);
}

/**
 * Reports a theme's unapplied compounds where the specification maps each key to its recipe.
 */
function compoundsOf(theme: Theme, options: ThemeChecks): readonly string[] {
  if (options.recipes === undefined || isKeys(options.recipes)) return [];

  return contract.compounds(theme, options.recipes);
}

/**
 * Runs one check and reports what it found.
 */
type Runner = (theme: Theme, options: ThemeChecks) => readonly string[];

/**
 * Maps each check to the call that performs it, in the order they report.
 */
const RUNNERS: ReadonlyArray<readonly [ThemeCheck, Runner]> = [
  [
    "name.attribute",
    (theme) =>
      ATTRIBUTE_VALUE.test(theme.name) ? [] : [`${theme.name} is not a valid attribute value`],
  ],
  ["contract.roles", (theme) => contract.roles(theme)],
  ["contract.modes", (theme) => contract.modes(theme)],
  ["contract.references", (theme, options) => contract.references(theme, options)],
  ["contract.extensions", (theme, options) => contract.extensions(theme, keysOf(options))],
  ["contract.compounds", compoundsOf],
  [
    "contract.listed",
    (theme, options) => (options.at === undefined ? [] : contract.listed(theme, options.at)),
  ],
  ["contract.styles", (theme) => contract.styles(theme)],
  ["contrast.text", (theme, options) => contrast.text(theme, options, thresholdsOf(options))],
  [
    "contrast.boundary",
    (theme, options) => contrast.boundary(theme, options, thresholdsOf(options)),
  ],
  ["contrast.focus", (theme, options) => contrast.focus(theme, options, thresholdsOf(options))],
  ["fonts.installed", (theme, options) => installed(theme, options.at)],
];

/**
 * Fills in every threshold the specification did not state.
 */
function thresholdsOf(options: ThemeChecks): contrast.Thresholds {
  return { ...contrast.THRESHOLDS, ...options.thresholds };
}

/**
 * Reports a skip that gives no reason.
 */
function unreasoned(options: ThemeChecks): readonly string[] {
  return Object.entries(options.skip ?? {})
    .filter(([, because]) => because.trim() === "")
    .map(([check]) => `skip of ${check} gives no reason`);
}

/**
 * Runs every check the specification leaves standing over a theme.
 *
 * @returns Each violation, opening with the check that reported it, or an empty array for a theme
 *   that keeps the contract.
 */
export function violations(theme: Theme, options: ThemeChecks = {}): readonly string[] {
  const reported = RUNNERS.filter(([check]) => options.skip?.[check] === undefined).flatMap(
    ([check, run]) => run(theme, options).map((violation) => `${check}: ${violation}`),
  );

  return [...unreasoned(options), ...reported];
}
