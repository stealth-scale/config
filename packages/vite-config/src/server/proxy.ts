/**
 * Forwards a request path from a development server to a back end.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Sends every request under a path prefix on to another origin.
 *
 * @remarks
 *   The layer is named for its path, so two modules each adding a route both
 *   survive and two naming the same path resolve to the later one. Vite reads
 *   the same table in a preview server, which receives the route without being
 *   asked.
 * @param path - The prefix to match, leading slash included.
 * @param target - The origin to forward to, scheme included.
 */
export function proxy(path: string, target: string): Preset {
  return preset({
    config: { server: { proxy: { [path]: target } } },
    name: `server.proxy(${path})`,
  });
}
