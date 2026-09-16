/**
 * Decides which interface a development server binds.
 */

import { type Preset } from "@stealthscale/vite-config-core";

import { bound as listens } from "#serving/listening.ts";

/**
 * Binds a development server to an interface, and to loopback when hosts are
 * named instead.
 *
 * @remarks
 *   A list of hostnames is not an interface. Passing one binds loopback,
 *   because a named host arrives through a resolver rather than through a wider
 *   bind. An empty list contributes no configuration at all and leaves Vite's
 *   own default standing. The preview server is untouched either way.
 */
export function bound(at: boolean | readonly string[] | string = []): Preset {
  return listens("server", at);
}
