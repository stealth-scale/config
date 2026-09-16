/**
 * Selects the runtime a server bundle is built to run on.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Builds the server bundle for a runtime without Node built-ins, such as an edge worker.
 *
 * @remarks
 *   Vite resolves the browser export condition under this target and leaves
 *   every Node built-in unresolved. A server module reaching for `node:fs`
 *   breaks the build rather than the first request in production.
 */
export function runtime(): Preset {
  return preset({ config: { ssr: { target: "webworker" } }, name: "ssr.runtime(webworker)" });
}
