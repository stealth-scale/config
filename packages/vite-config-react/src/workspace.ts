/**
 * Lints and sorts what renders, from one call a repository root adds.
 */

import { type Layer } from "@stealthscale/vite-config";

import * as fmt from "#fmt/index.ts";
import * as lint from "#lint/index.ts";

/**
 * Turns on the React and accessibility rules, the import order, and the excuses a specification
 * needs.
 *
 * @remarks
 *   A relaxation only reaches a rule that is already on, so every layer enforcing something is
 *   ordered ahead of every layer excusing a file from it.
 * @returns Each layer under the name of the call that produced it, in the order a root resolves
 *   them.
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
