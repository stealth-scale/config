/**
 * Reporting on stylesheets without failing the build.
 */

import { type Layer, named, remove } from "@stealthscale/vite-config-core";

import { check, type Checked } from "#plugin/check.ts";

/**
 * Describes a repository that reports on its stylesheets rather than failing on them.
 */
export interface Warned extends Checked {
  /**
   * Why this repository reports rather than fails, kept with the removal so a later reader can
   * weigh it.
   */
  because: string;
}

/**
 * Reports on stylesheets without failing the build.
 *
 * Two layers rather than one: the plugin is built once with the answers it is given, so changing
 * one of them means taking the check back by name and putting another in its place. Whatever else
 * was asked for is restated here, because a repository turning failures into warnings is not also
 * asking for its rules back. Both layers carry this call's name, so a repository that takes
 * `css.warn` back is left with neither.
 *
 * A temporary state by construction. Nothing that only warns gets fixed, so the reason for reaching
 * for this is the reason to stop.
 *
 * @param stated - Why, and everything else the repository asked for. `Warned` documents every
 *   member.
 * @returns The removal and what replaces it, in that order.
 */
export function warn(stated: Warned): readonly Layer[] {
  const { because, ...checked } = stated;

  return [
    remove({ because, name: "css.warn", target: "css.check" }),
    named("css.warn", check({ ...checked, warn: true })),
  ];
}
