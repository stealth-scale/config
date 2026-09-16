/**
 * The formatting departures a repository states, each carrying its reason.
 *
 * @remarks
 *   Every layer here adds to what a preset already set rather than replacing
 *   it, so a repository skipping one directory keeps the house list of
 *   generated files as well.
 */

import { type UserConfig } from "vite";

import {
  contribute,
  type Contribution,
  type Override,
  override,
} from "@stealthscale/vite-config-core";

import { GENERATED } from "#ignore/generated.ts";

/**
 * The import-sorting settings a contributed group is folded into.
 */
type Sorted = Exclude<NonNullable<NonNullable<UserConfig["fmt"]>["sortImports"]>, boolean>;

/**
 * The configuration path holding the globs the formatter walks past.
 */
const SKIPPED = "fmt.ignorePatterns";

/**
 * The configuration path holding the prefixes counted as an internal import.
 */
const OWN = "fmt.sortImports.internalPattern";

/**
 * A set of files the formatter is told to leave as they were written.
 */
export interface Skipped {
  /**
   * Why these files go unformatted, recorded beside the entry it adds.
   */
  because: string;

  /**
   * Globs resolved against the directory the formatter runs in.
   */
  files: readonly string[];
}

/**
 * A set of package prefixes a repository counts as its own code.
 */
export interface Owned {
  /**
   * Why these prefixes are this repository's rather than somebody else's.
   */
  because: string;

  /**
   * Prefixes matched against a specifier, not regular expressions.
   */
  patterns: readonly string[];
}

/**
 * A band of imports that sorts above every band the house order defines.
 */
export interface Grouped {
  /**
   * Why these imports are worth separating from the rest.
   */
  because: string;

  /**
   * The band's name, which also names the layer.
   */
  name: string;

  /**
   * Patterns matched against an import specifier.
   */
  patterns: readonly string[];
}

/**
 * Takes the import order out of the configuration a group is joining.
 *
 * @remarks
 *   Setting `sortImports` to a boolean turns sorting on without stating an
 *   order, and a group has nothing to join in that case. It is refused the same
 *   way an absent setting is.
 * @throws {@link Error} When no layer above this one states an import order.
 */
function sorting(config: UserConfig, name: string): Sorted {
  const held = config.fmt?.sortImports;
  const sorted = typeof held === "object" ? held : undefined;

  if (sorted === undefined) {
    throw new Error(
      `fmt.group(${name}) has no import order to join: nothing above it sorts imports`,
    );
  }

  return sorted;
}

/**
 * Tells the formatter to leave a set of files as they are.
 *
 * @remarks
 *   Each glob becomes a contribution of its own, named for itself, so a
 *   repository dropping one glob never disturbs a glob another layer added.
 * @returns One contribution per glob.
 */
export function skip(stated: Skipped): readonly Contribution[] {
  return stated.files.map((held) =>
    contribute({ at: SKIPPED, because: stated.because, item: held, name: `fmt.skip(${held})` }),
  );
}

/**
 * Leaves alone the files a code generator owns.
 *
 * @remarks
 *   A formatted generated file differs from what its generator writes on the
 *   next run, and the difference lands on whoever runs the generator.
 */
export function generated(): readonly Contribution[] {
  return skip({
    because: "written by a tool, and overwritten by it on the next run",
    files: GENERATED,
  });
}

/**
 * Counts a further package prefix as an import of this repository's own code.
 *
 * @remarks
 *   The house scope stays in the list. A repository publishing under a second
 *   scope names that one here rather than restating both.
 * @returns One contribution per prefix.
 */
export function own(stated: Owned): readonly Contribution[] {
  return stated.patterns.map((held) =>
    contribute({ at: OWN, because: stated.because, item: held, name: `fmt.own(${held})` }),
  );
}

/**
 * Lifts the imports matching a set of patterns into a band of their own.
 *
 * @remarks
 *   The band goes above every band already in the order, and the order beneath
 *   it is untouched. Two modules each adding a band both keep theirs.
 * @throws {@link Error} When the config it refines states no import order.
 */
export function group(stated: Grouped): Override {
  return override({
    because: stated.because,
    name: `fmt.group(${stated.name})`,
    refine: (_context, config: UserConfig): UserConfig => {
      const held = sorting(config, stated.name);

      return {
        ...config,
        fmt: {
          ...config.fmt,
          sortImports: {
            ...held,
            customGroups: [
              { elementNamePattern: [...stated.patterns], groupName: stated.name },
              ...(held.customGroups ?? []),
            ],
            groups: [stated.name, ...(held.groups ?? [])],
          },
        },
      };
    },
  });
}
