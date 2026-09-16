/**
 * Gives a package one call that checks its stylesheets as it builds.
 */

import { type Layer } from "@stealthscale/vite-config-core";

import { check, type Checked } from "#plugin/check.ts";

/**
 * Lists the layers a package with stylesheets extends its tier with.
 *
 * @remarks
 *   The result is a single contribution, so where a config places it among its
 *   other add-ons decides nothing. The check appends to `plugins` and reads no
 *   key another layer sets.
 * @param stated - The globs and rules this repository departs on, passed
 *   through untouched.
 */
export function layers(stated: Checked = {}): readonly Layer[] {
  return [check(stated)];
}
