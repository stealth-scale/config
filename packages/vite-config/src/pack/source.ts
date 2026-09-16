/**
 * Publishes the condition under which a package inside this repository resolves to its own source.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

import { SOURCE } from "#resolve/condition.ts";

/**
 * Writes a source condition into the export map beside every built subpath.
 *
 * @remarks
 *   Builds inside this repository put that condition first when resolving, so one package imports
 *   another and loads its TypeScript directly. An edit in a dependency is then visible without
 *   packing it. Nothing outside the repository sets the condition, so a consumer from a registry
 *   resolves past it to the built file.
 */
export function source(): Preset {
  return preset({
    config: { pack: { exports: { devExports: SOURCE } } },
    name: `pack.source(${SOURCE})`,
  });
}
