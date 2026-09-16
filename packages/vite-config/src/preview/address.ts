/**
 * Places a preview server on its whole listening address in one call.
 */

import { type Preset } from "@stealthscale/vite-config-core";

import { address as at } from "#serving/listening.ts";

/**
 * Places a preview server on a fixed port and admits each host named.
 *
 * @remarks
 *   A preview server serves the built output and takes an address of its own
 *   rather than borrowing the development server's. Giving the two the same
 *   port leaves whichever starts second failing.
 * @param port - The port to bind. A port already taken fails the start.
 * @param names - The hostnames a browser may use. An empty list leaves the
 *   server on the address Vite would have chosen and admits nothing by name.
 * @returns The port, the host list and the bind address, in that order.
 */
export function address(port: number, names: readonly string[] = []): readonly Preset[] {
  return at("preview", port, names);
}
