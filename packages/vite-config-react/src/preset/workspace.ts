/**
 * What a workspace holding anything that renders states once, at its root.
 */

import { type Layer, owned } from "@stealthscale/config-vite";

import * as fmt from "#fmt/index.ts";
import * as lint from "#lint/index.ts";

/**
 * The layers a workspace states once, at its root.
 *
 * The formatter and the linter are read from the root config and nowhere else, so these belong
 * there even though what they describe is a package two directories down. A workspace holding
 * anything that renders states this, and every file in it is then grouped and checked as React.
 *
 * Neither a tier nor part of one. A root config is not a package: it has nothing to pack, nothing
 * to build and no tests of its own, so it takes this rather than any of the three.
 *
 * What a root states about the runner is not here. Every workspace needs it, including one that
 * renders through something other than React, so it is the toolchain's `test.projects` rather than
 * this package's to hand out.
 *
 * @returns Each layer the root config needs on behalf of what renders below it.
 */
export function workspace(): readonly Layer[] {
  return owned("react", [fmt.imports(), lint.plugins(), lint.rules(), lint.runtime()]);
}
