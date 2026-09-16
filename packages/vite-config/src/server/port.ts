/**
 * Fixes the port a development server listens on.
 */

import { type Preset } from "@stealthscale/vite-config-core";

import { port as serves } from "#serving/listening.ts";

/**
 * Pins a development server to one port and fails its start when that port is
 * taken.
 *
 * @remarks
 *   Vite otherwise searches upward until a port is free. A proxy rule, an OAuth
 *   redirect and a federated remote's URL are all written against a number, and
 *   none of them learns that the server moved. Failing loudly is what tells a
 *   developer to free the port.
 */
export function port(at: number): Preset {
  return serves("server", at);
}
