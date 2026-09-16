/**
 * Allows the origins named to read what a preview server serves.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

import { origins as allowed } from "#serving/environment.ts";

/**
 * Lets each named origin fetch a preview server's responses across origins.
 *
 * @remarks
 *   The origins are reflected back one by one rather than answered with a
 *   wildcard, which is what keeps a credentialed request possible. The
 *   STEALTH_ORIGINS environment variable replaces the stated list outright, and
 *   the list is copied so a caller mutating its array changes nothing the
 *   server does.
 */
export function shared(origins: readonly string[] = []): Preset {
  return preset({
    config: (context) => ({ preview: { cors: { origin: [...allowed(context, origins)] } } }),
    name: origins.length === 0 ? "preview.shared" : `preview.shared(${origins.join(", ")})`,
  });
}
