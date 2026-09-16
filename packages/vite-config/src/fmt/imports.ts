/**
 * The order the imports at the top of a file are written in.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * The scope whose packages count as this repository's own code.
 */
const INTERNAL = "@stealthscale/";

/**
 * The bands of imports, from the furthest from a file to the nearest.
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
 * Sorts imports into bands and separates each band with a blank line.
 *
 * @remarks
 *   No framework is named. A package wanting React at the top of its files adds
 *   a group of its own, which sorts above every band this states.
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
