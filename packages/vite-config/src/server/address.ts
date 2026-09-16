/**
 * Opens a development server on its whole listening address in one call.
 */

import { type Preset } from "@stealthscale/vite-config-core";

import { address as at } from "#serving/listening.ts";

/**
 * Opens a development server on a fixed port and admits each host named.
 *
 * @remarks
 *   The three layers come back separately rather than merged into one, so a
 *   repository can drop the host list by name and keep the port it was given.
 * @param port - The port to bind. A port already taken fails the start.
 * @param names - The hostnames a browser may use. An empty list leaves the
 *   server on the address Vite would have chosen and admits nothing by name.
 * @returns The port, the host list and the bind address, in that order.
 */
export function address(port: number, names: readonly string[] = []): readonly Preset[] {
  return at("server", port, names);
}
