/**
 * What a repository states about its own tests beyond what the tier decided.
 */

import { type UserConfig } from "vite";

import { contribute, type Contribution, type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Where a contribution to the list of what coverage leaves out is appended.
 */
const AT = "test.coverage.exclude";

/**
 * Where a contribution to the list of files run once around the suite is appended.
 */
const ONCE = "test.globalSetup";

/**
 * How much of what is counted has to be reached, as the runner takes it.
 */
type Enough = NonNullable<NonNullable<NonNullable<UserConfig["test"]>["coverage"]>["thresholds"]>;

/**
 * Describes files coverage stops counting.
 */
export interface Omitted {
  /**
   * Why counting them says nothing, kept with the contribution so a later reader can weigh it.
   */
  because: string;

  /**
   * The globs to stop counting.
   */
  files: readonly string[];
}

/**
 * Stops counting files whose coverage would mean nothing.
 *
 * The conventional ones are left out already. This is for the rest: a file that only exists to be
 * imported by a tool, a shim around something with no behaviour of its own, generated output kept
 * somewhere unconventional.
 *
 * One contribution per glob, each named for the glob it carries, so a later module can take back
 * exactly one rather than the set.
 *
 * Belongs in the workspace root's config wherever `test.projects` is in use. Coverage is measured
 * across the whole run rather than per project, so the root's list is the one that is read and a
 * package stating its own is stating it where nothing looks. The globs are therefore written from
 * the root, not from the package.
 *
 * @param stated - The globs, and why.
 * @returns One contribution for each glob.
 */
export function omit(stated: Omitted): readonly Contribution[] {
  return stated.files.map((held) =>
    contribute({ at: AT, because: stated.because, item: held, name: `test.omit(${held})` }),
  );
}

/**
 * Describes a file run once around the whole test run.
 */
export interface Prepared {
  /**
   * Why this repository needs it, kept with the contribution so a later reader can weigh it.
   */
  because: string;

  /**
   * The files, as absolute paths. A relative one is read against the repository being tested rather
   * than against whatever stated it.
   */
  files: readonly string[];
}

/**
 * Runs a file once before the tests, and once after them.
 *
 * For the things a test suite needs standing up rather than mocking: a database, a server, a
 * fixture too expensive to build per file. A setup file runs before every file and is the wrong
 * place for any of them.
 *
 * There is no separate teardown. A file named here exports `setup` and `teardown`, or a default
 * function returning the teardown. One file holds both halves, which keeps the thing it started and
 * the thing that stops it from drifting apart.
 *
 * Nothing here ships one. What runs once around a suite is what the suite needs standing up, and a
 * configuration package knows nothing about that.
 *
 * @param stated - The files, and why.
 * @returns One contribution for each file.
 */
export function prepare(stated: Prepared): readonly Contribution[] {
  return stated.files.map((held) =>
    contribute({ at: ONCE, because: stated.because, item: held, name: `test.prepare(${held})` }),
  );
}

/**
 * Asks for less coverage than the house does.
 *
 * The house asks for all of it, which is the only number that needs no explaining. A repository
 * that cannot hold to it says so here, and what it states wins over what the tier set.
 *
 * Whatever is left out keeps the house's answer, so lowering the branch threshold does not quietly
 * lower the other three.
 *
 * Belongs in the workspace root's config wherever `test.projects` is in use, for the same reason
 * `omit` does: the thresholds are checked once against the whole run, so the root's are the ones
 * that decide and a package's are read by nothing.
 *
 * @param stated - The thresholds this repository holds itself to.
 * @returns The preset.
 */
export function thresholds(stated: Enough): Preset {
  return preset({
    config: { test: { coverage: { thresholds: stated } } },
    name: `test.thresholds(${Object.keys(stated).join(", ")})`,
  });
}
