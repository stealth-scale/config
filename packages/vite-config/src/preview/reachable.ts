/**
 * Lists the hostnames a preview server answers to.
 */

import { type Preset } from "@stealthscale/vite-config-core";

import { reachable as answers } from "#serving/listening.ts";

/**
 * Admits each named host to the preview server and turns away every other Host
 * header.
 *
 * @remarks
 *   The names are listed rather than the check switched off, so a preview
 *   shared across a network still refuses a Host header nobody arranged. The
 *   STEALTH_HOSTS environment variable replaces this list outright, which is
 *   how a review machine names an origin the source never knew.
 */
export function reachable(names: readonly string[] = []): Preset {
  return answers("preview", names);
}
