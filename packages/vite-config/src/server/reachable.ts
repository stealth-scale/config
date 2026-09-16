/**
 * Lists the hostnames a development server answers to.
 */

import { type Preset } from "@stealthscale/vite-config-core";

import { reachable as answers } from "#serving/listening.ts";

/**
 * Admits each named host to the development server and turns away every other
 * Host header.
 *
 * @remarks
 *   Vite refuses an unrecognised Host header so that a page in another tab
 *   cannot rebind DNS and read a developer's source. The STEALTH_HOSTS
 *   environment variable replaces this list outright where a machine has
 *   arranged names the source never knew.
 */
export function reachable(names: readonly string[] = []): Preset {
  return answers("server", names);
}
