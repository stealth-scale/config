/**
 * What a package with stylesheets states in its own config.
 */

import { type Layer } from "@stealthscale/vite-config-core";

import { check, type Checked } from "#plugin/check.ts";

/**
 * The layers a package with stylesheets adds beside its tier.
 *
 * One layer, the check, named `css.check`. A repository that reports rather than fails takes it
 * back with `warn`.
 *
 * @param stated - The repository's own answers about its stylesheets. `Checked` documents every
 *   member.
 * @returns Each layer the stylesheets need beside a tier, in the order they compose.
 */
export function layers(stated: Checked = {}): readonly Layer[] {
  return [check(stated)];
}
