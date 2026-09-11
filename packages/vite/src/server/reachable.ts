/**
 * The names a dev server answers to.
 */

import { type Preset, preset } from "#core/layer.ts";
import { hosts } from "#serving/environment.ts";

/**
 * Answers to the names given, beyond the loopback ones every server answers to.
 *
 * The dev server's half of `preview.reachable`, and needed for the same reason: a request whose
 * `Host` header the server does not recognise is refused with a `403`, because a name somebody else
 * controls can be pointed at this machine.
 *
 * `server.origin` belongs beside this wherever another origin loads what this one serves. The dev
 * server writes relative URLs for its own assets, and a page on another origin resolves those
 * against itself.
 *
 * @param names - The host names to answer to, each without a scheme or a port. Read from the
 *   machine's own environment where none are given.
 * @returns The preset.
 */
export function reachable(names: readonly string[] = hosts()): Preset {
  return preset({
    config: { server: { allowedHosts: [...names] } },
    name: `server.reachable(${names.join(", ")})`,
  });
}
