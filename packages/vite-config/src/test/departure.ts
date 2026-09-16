/**
 * The coverage and setup departures a repository states for itself.
 */

import { type UserConfig } from "vite";

import { contribute, type Contribution, type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * The configuration path holding the globs coverage does not count.
 */
const AT = "test.coverage.exclude";

/**
 * The configuration path holding the files run once around the whole suite.
 */
const ONCE = "test.globalSetup";

/**
 * The coverage numbers a layer is allowed to restate.
 */
type Enough = NonNullable<NonNullable<NonNullable<UserConfig["test"]>["coverage"]>["thresholds"]>;

/**
 * A set of files a repository stops counting towards coverage.
 */
export interface Omitted {
  /**
   * Why covering these files is not worth the tests it would take.
   */
  because: string;

  /**
   * The globs to stop counting.
   */
  files: readonly string[];
}

/**
 * Stops counting a set of files towards coverage.
 *
 * @remarks
 *   What the tier already leaves out stays out. Each glob arrives as a
 *   contribution named for itself, so a report points at the glob rather than
 *   at the list it joined.
 * @returns One contribution per glob.
 */
export function omit(stated: Omitted): readonly Contribution[] {
  return stated.files.map((held) =>
    contribute({ at: AT, because: stated.because, item: held, name: `test.omit(${held})` }),
  );
}

/**
 * A set of files the runner executes once before any test file.
 */
export interface Prepared {
  /**
   * Describes the external state a suite needs before its first case runs.
   */
  because: string;

  /**
   * Paths to the setup files.
   */
  files: readonly string[];
}

/**
 * Runs a file once around the whole suite rather than once per test file.
 *
 * @remarks
 *   A file that starts a database belongs here. One that resets a mock does
 *   not, because this runs outside the process a test file runs in and shares
 *   no state with it.
 * @returns One contribution per file.
 */
export function prepare(stated: Prepared): readonly Contribution[] {
  return stated.files.map((held) =>
    contribute({ at: ONCE, because: stated.because, item: held, name: `test.prepare(${held})` }),
  );
}

/**
 * Lowers the coverage a package is held to, for the numbers it names.
 *
 * @remarks
 *   A number left out keeps the house figure. Stating only `branches` leaves
 *   lines, functions and statements where the tier put them, and the layer's
 *   name lists what was lowered so a reviewer sees it without opening the file.
 */
export function thresholds(stated: Enough): Preset {
  return preset({
    config: { test: { coverage: { thresholds: stated } } },
    name: `test.thresholds(${Object.keys(stated).join(", ")})`,
  });
}
