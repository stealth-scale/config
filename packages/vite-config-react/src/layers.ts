/**
 * Gives a package that renders one call to add beside its tier.
 */

import { type Layer } from "@stealthscale/vite-config";

import * as plugin from "#plugin/index.ts";
import * as test from "#test/index.ts";

/**
 * Composes the JSX transform and the document its tests render into.
 *
 * @remarks
 *   No rule and no format appears here. A linter and a formatter read the root configuration only,
 *   so a package repeating them lints nothing extra and slows its own build down.
 * @returns Each layer under the name of the call that produced it, so a consumer can drop one by
 *   name and keep the other two.
 */
export function layers(): readonly Layer[] {
  return [plugin.refresh(), test.cleanup(), test.document()];
}
