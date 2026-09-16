/**
 * What a workspace holding anything that renders states once, at its root.
 */

import { type Layer } from "@stealthscale/vite-config";

import * as fmt from "#fmt/index.ts";
import * as lint from "#lint/index.ts";

/**
 * The layers a workspace root adds on behalf of what renders below it.
 *
 * The formatter and the linter read the root config and nowhere else, so these belong there even
 * though what they describe is a package two directories down. A workspace holding anything that
 * renders states this, and every file in it is then grouped and checked as React.
 *
 * What a root states about the runner is not here. Every workspace needs it, including one that
 * renders through something other than React, so the toolchain's workspace tier states it.
 *
 * The rules come before the relaxations. The linter reads its overrides in order and the later one
 * wins for a file both name, so a relaxation listed first is undone by the rules that follow it.
 *
 * @returns Each layer the root config needs on behalf of what renders below it.
 */
export function workspace(): readonly Layer[] {
  return [
    fmt.imports(),
    ...lint.plugins(),
    lint.rules(),
    lint.runtime(),
    lint.rendered(),
    lint.fixtures(),
  ];
}
