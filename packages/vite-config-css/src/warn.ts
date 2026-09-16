/**
 * Demotes the stylesheet check to a reporting one while a repository works
 * through a backlog of violations.
 */

import { type Layer, named, remove } from "@stealthscale/vite-config-core";

import { check, type Checked } from "#plugin/check.ts";

/**
 * Records why a repository reports stylesheet violations instead of failing on them.
 *
 * @remarks
 *   Everything the check itself takes is accepted here too, so demoting the
 *   check keeps the globs and rules a repository had already configured.
 */
export interface Warned extends Checked {
  /**
   * Why this repository departs from a failing check. It is recorded against
   * the removal and read back when somebody asks what took the check away.
   */
  because: string;
}

/**
 * Takes the failing check back by name and states a reporting one in its place.
 *
 * @remarks
 *   The removal names `css.check`, which composition resolves against the
 *   layers stated above it. A config listing this before `layers()`, or
 *   without it, fails to load rather than quietly reporting nothing.
 * @returns The removal, then the replacement, in the order a config keeps.
 */
export function warn(stated: Warned): readonly Layer[] {
  const { because, ...checked } = stated;

  return [
    remove({ because, name: "css.warn", target: "css.check" }),
    named("css.warn", check({ ...checked, warn: true })),
  ];
}
