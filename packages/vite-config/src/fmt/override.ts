/**
 * Bending the house format where a repository or a module knows something it does not.
 */

import { type UserConfig } from "vite-plus";

import { contribute, type Contribution, type Override, override } from "@stealthscale/config-core";

import { GENERATED } from "#ignore/generated.ts";

/**
 * The `sortImports` settings, as they stand once the layers have merged.
 *
 * Read off the block rather than written out again, so a change upstream is a type error here
 * rather than a config the formatter rejects at run time.
 */
type Sorted = Exclude<NonNullable<NonNullable<UserConfig["fmt"]>["sortImports"]>, boolean>;

/**
 * Where a contribution to the list of what the formatter leaves alone lands.
 */
const SKIPPED = "fmt.ignorePatterns";

/**
 * Where a contribution to the list of what counts as this repository's own lands.
 */
const OWN = "fmt.sortImports.internalPattern";

/**
 * Describes a path the formatter leaves as it found it.
 */
export interface Skipped {
  /**
   * Why this repository needs it, kept with the contribution so a later reader can weigh it.
   */
  because: string;

  /**
   * The globs to leave alone.
   */
  files: readonly string[];
}

/**
 * Describes a kind of import that belongs above the ordinary ones.
 */
export interface Grouped {
  /**
   * Why this module needs its imports kept together.
   */
  because: string;

  /**
   * What the group is called, which is what appears in the order.
   */
  name: string;

  /**
   * The globs an import's source matches to land in it. Globs rather than patterns, which is what
   * the formatter reads them as.
   */
  patterns: readonly string[];
}

/**
 * Reads the import settings a group is being added to.
 *
 * @param config - The merged config.
 * @param name - The group being added, for the message.
 * @returns Those settings.
 * @throws Error Where nothing above it sorts imports, so there is no order to join.
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
 * Leaves a path as the formatter found it.
 *
 * The conventional spellings for a written file are walked past already. This is for the rest: a
 * generator that writes somewhere of its own, a vendored file kept byte for byte, a fixture whose
 * layout is the thing under test.
 *
 * One contribution per glob, each named for the glob it carries, so a later module can take back
 * exactly one rather than the set.
 *
 * @param stated - The globs, and why.
 * @returns One contribution for each glob.
 */
export function skip(stated: Skipped): readonly Contribution[] {
  return stated.files.map((held) =>
    contribute({ at: SKIPPED, because: stated.because, item: held, name: `fmt.skip(${held})` }),
  );
}

/**
 * Leaves alone what a tool wrote, by either conventional spelling.
 *
 * A formatter rewriting a generated file starts a fight it loses on the next run, and the diff it
 * leaves behind is nobody's to read.
 *
 * @returns One contribution for each conventional spelling.
 */
export function generated(): readonly Contribution[] {
  return skip({
    because: "written by a tool, and overwritten by it on the next run",
    files: GENERATED,
  });
}

/**
 * Counts another scope's packages as this repository's own.
 *
 * Which scope a repository publishes under is the repository's to say. The house default stands
 * alongside whatever is added here, so a workspace spanning two scopes groups both together rather
 * than filing one of them among strangers.
 *
 * @param patterns - The scopes, as prefixes an import's source starts with.
 * @returns One contribution for each pattern.
 */
export function internal(patterns: readonly string[]): readonly Contribution[] {
  return patterns.map((held) =>
    contribute({
      at: OWN,
      because: "a scope this workspace publishes under, so its packages are not strangers",
      item: held,
      name: `fmt.internal(${held})`,
    }),
  );
}

/**
 * Puts a kind of import in a group of its own, above the ordinary ones.
 *
 * What a framework's imports are is the framework package's knowledge: React knows `react` and
 * `react-dom` belong together at the top of every file that renders, and nothing here does. The
 * order itself stays the house's, which is why this arrives last and only inserts.
 *
 * An override rather than a contribution because two lists have to change together. The formatter
 * refuses a group named in the order that nothing defines, so appending to either one alone leaves
 * a config that will not parse.
 *
 * @param stated - The group, its patterns, and why.
 * @returns The override.
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
