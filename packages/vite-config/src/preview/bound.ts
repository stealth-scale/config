/**
 * Decides which interface a preview server binds.
 */

import { type Preset } from "@stealthscale/vite-config-core";

import { bound as listens } from "#serving/listening.ts";

/**
 * Binds a preview server to an interface, and to loopback when hosts are named
 * instead.
 *
 * @remarks
 *   The development server keeps whatever address it was given, so showing the
 *   build to a phone on the same network does not also put the source within
 *   reach. An empty list contributes no configuration and leaves Vite's own
 *   default standing.
 */
export function bound(at: boolean | readonly string[] | string = []): Preset {
  return listens("preview", at);
}
