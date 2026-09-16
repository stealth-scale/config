/**
 * Settles the module format a bundled worker is emitted in.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Emits every worker as a module rather than as a classic script.
 *
 * @remarks
 *   A classic worker cannot take a static import, so the bundler inlines
 *   everything it reaches into one file and duplicates whatever the main bundle
 *   also uses. A module worker keeps its chunks and shares them.
 */
export function format(): Preset {
  return preset({ config: { worker: { format: "es" } }, name: "worker.format" });
}
