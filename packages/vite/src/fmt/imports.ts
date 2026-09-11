/**
 * Where each kind of import sits, and who decides.
 */

import { type Preset, preset } from "@stealthscale/config-core";

/**
 * The scope whose imports group as this repository's own rather than as a stranger's.
 *
 * A prefix rather than a pattern: the formatter matches the start of the import's source, so a
 * regex written here would be read as a literal and match nothing.
 *
 * A default rather than the only answer: a repository publishing under another scope says so with
 * `fmt.internal`, and both prefixes then count.
 */
const INTERNAL = "@stealthscale/";

/**
 * Where each kind of import sits, in the order a reader meets them.
 *
 * What was installed, then this repository's own packages, then the file's own — the order of
 * decreasing distance from the file, so an import's position says how far away it came from.
 *
 * A side effect goes first, because it is the one import whose position is its meaning: a polyfill
 * has to run before what needs it. Within that group nothing is reordered, so two of them keep the
 * order they were written in. A stylesheet and anything matching nothing else go last, named rather
 * than left out, so that an import nobody anticipated lands somewhere stated instead of wherever it
 * happened to be.
 *
 * No framework is named. A file that renders is about rendering and its framework belongs at the
 * top, but which import that is belongs to the package configuring the framework: `fmt.group` puts
 * it there, and the group has to arrive with its pattern because the formatter refuses a group
 * named here that nothing defines.
 */
const GROUPS = [
  "side_effect",
  ["builtin", "external"],
  "internal",
  "subpath",
  ["parent", "sibling", "index"],
  "style",
  "unknown",
];

/**
 * Sorts every import, in groups, with a blank line between them.
 *
 * The formatter does this rather than the linter, though both can. A formatter puts the file right
 * on every save; a linter reports that it is wrong and waits to be asked to fix it. Running both
 * would mean two sorters that have to agree forever, and the first time they disagreed the file
 * would flip on every run.
 *
 * @returns The preset.
 */
export function imports(): Preset {
  return preset({
    config: {
      fmt: {
        sortImports: {
          customGroups: [],
          groups: GROUPS,
          internalPattern: [INTERNAL],
          newlinesBetween: true,
          order: "asc",
        },
      },
    },
    name: "fmt.imports",
  });
}
