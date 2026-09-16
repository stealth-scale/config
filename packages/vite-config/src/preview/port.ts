/**
 * Fixes the port a preview server listens on.
 */

import { type Preset } from "@stealthscale/vite-config-core";

import { port as serves } from "#serving/listening.ts";

/**
 * Pins a preview server to one port and fails its start when that port is
 * taken.
 *
 * @remarks
 *   The development server's own port is untouched, so a repository fixing both
 *   can run the source and the build side by side and compare them. Fixing a
 *   development port alone leaves the preview inheriting it, which is why this
 *   exists separately.
 */
export function port(at: number): Preset {
  return serves("preview", at);
}
