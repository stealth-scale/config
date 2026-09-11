/**
 * The names a preview answers to.
 */

import { type Preset } from "@stealthscale/vite-config-core";

import { reachable as answers } from "#serving/listening.ts";

/**
 * Answers to the names given, beyond the loopback ones every server answers to.
 *
 * A server refuses a request whose `Host` header it does not recognise, and answers `403` with the
 * name it was asked for. That is a defence against DNS rebinding, where a name under somebody
 * else's control is pointed at a developer's own machine so that a page they visit can read what is
 * running on it. Loopback is allowed already, so this is only needed once a real name is involved.
 *
 * A real name is involved sooner than it looks. Two applications joined at run time have to be
 * served from somewhere a browser will treat as two origins, and a deployment's own names are the
 * honest way to do that — the alternative is a pair of ports, which is neither what production
 * looks like nor something a cookie or a redirect behaves the same way under.
 *
 * Named rather than opened to everything. `true` turns the check off, which is the setting this
 * exists to avoid.
 *
 * @param names - The host names to answer to, each without a scheme or a port. What the repository
 *   knows about itself, which `STEALTH_HOSTS` overrides where a machine needs its own.
 * @returns The preset.
 */
export function reachable(names: readonly string[] = []): Preset {
  return answers("preview", names);
}
