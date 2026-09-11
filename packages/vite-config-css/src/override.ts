/**
 * Bending what this package decided, where a repository knows better than the house.
 */

import { type Layer, remove } from "@stealthscale/vite-config-core";

import { check, type Checked } from "#plugin/check.ts";

/**
 * Reports on stylesheets without failing the build.
 *
 * Two layers rather than one: the plugin is built once with the answers it is given, so changing
 * one of them means taking the plugin back by name and putting another in its place. Whatever else
 * was asked for is restated here, because a repository turning failures into warnings is not also
 * asking for its rules back.
 *
 * @param stated - Everything else the repository asked for. `Checked` documents every member.
 * @returns The removal and what replaces it, in that order.
 */
export function warn(stated: Checked = {}): readonly Layer[] {
  return [
    remove({
      because: "this repository is adopting the rules on a codebase that does not pass them yet",
      name: "stylelint.warn",
      target: "stylelint.check",
    }),
    check({ ...stated, warn: true }),
  ];
}
