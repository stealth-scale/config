/**
 * Stops counting the specimens a package holds towards its coverage.
 */

import { test } from "@stealthscale/vite-config";
import { type Contribution, named } from "@stealthscale/vite-config-core";

/**
 * The files the runner stops counting.
 */
const SPECIMENS = ["**/*.specimen.tsx"];

/**
 * Renames one omission so its layer name identifies this package.
 *
 * @remarks
 *   A layer is named for the call a consumer wrote, and a consumer writes `layers` rather than
 *   `test.omit`.
 */
function renamed(contribution: Contribution): Contribution {
  return named(contribution.name.replace("test.omit", "specimen.uncounted"), contribution);
}

/**
 * Stops counting each specimen towards the coverage its package is held to.
 *
 * @remarks
 *   A specimen is an entry point the catalogue loads, like the `main` of an application, and it
 *   declares a page rather than behaviour to assert. Counted, every specimen would sit at nothing
 *   until somebody wrote a specification for a page description.
 * @param files - Which files are specimens. Defaults to any `*.specimen.tsx` in the package.
 */
export function uncounted(files: readonly string[] = SPECIMENS): readonly Contribution[] {
  return test
    .omit({
      because:
        "a specimen declares a page for the catalogue to draw rather than behaviour to assert, " +
        "so it is an entry point in the way an application's main is",
      files,
    })
    .map((contribution) => renamed(contribution));
}
