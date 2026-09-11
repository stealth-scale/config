/**
 * What a machine says about how the servers on it are reached.
 */

import { type Context } from "@stealthscale/vite-config-core";

/**
 * Where the names a server answers to are read from.
 */
const HOSTS = "STEALTH_HOSTS";

/**
 * Where the origins allowed to fetch from it are read from.
 */
const ORIGINS = "STEALTH_ORIGINS";

/**
 * What a server binds to once names are in play.
 *
 * A wildcard record pointed at a developer's own machine answers `127.0.0.1`, and a server left
 * alone binds IPv6 loopback and nothing else — so the name resolves, the connection is refused, and
 * it looks like the server is down rather than bound somewhere else.
 */
const LOOPBACK = "127.0.0.1";

/**
 * Reads a list out of the environment.
 *
 * Comma separated, and empty where the variable is unset. Nothing here fails on an absent one: a
 * machine that has arranged no names is the ordinary case, and a server on loopback alone is what
 * it should get.
 *
 * @param context - The command, the mode and the repository around them, whose variables are its
 *   own `.env` files and the shell around them.
 * @param named - The variable to read.
 * @returns Each entry, with the empties dropped.
 */
function listed(context: Context, named: string): readonly string[] {
  const held = context.env[named];

  return typeof held === "string" ? held.split(",").filter((one) => one.length > 0) : [];
}

/**
 * The names the servers on this machine answer to, beyond loopback.
 *
 * What a repository states is the answer until a machine says otherwise, and then the machine's
 * list replaces it rather than adding to it. Which names a machine answers to is that machine's
 * arrangement — one developer points a wildcard record at loopback, another has none and uses ports
 * — so a repository stating names is stating what it expects rather than what is true.
 *
 * @param context - The command, the mode and the repository around them.
 * @param stated - The names the repository states, used where the machine names none.
 * @returns Each name, or none where neither names any.
 */
export function hosts(context: Context, stated: readonly string[] = []): readonly string[] {
  const held = listed(context, HOSTS);

  return held.length > 0 ? held : stated;
}

/**
 * The origins allowed to fetch what the servers on this machine serve.
 *
 * A different list from the names, and not derivable from them: an origin is a scheme, a name and a
 * port together, so a server answering to a name says nothing about which pages may read it.
 *
 * @param context - The command, the mode and the repository around them.
 * @param stated - The origins the repository states, used where the machine names none.
 * @returns Each origin, or none where nothing else loads from here.
 */
export function origins(context: Context, stated: readonly string[] = []): readonly string[] {
  const held = listed(context, ORIGINS);

  return held.length > 0 ? held : stated;
}

/**
 * The address a server should listen on.
 *
 * Derived from whether any name is in play at all, which is the condition that makes the default
 * bind wrong. A repository stating names counts, and not only a machine arranging them: the name
 * resolves to IPv4 loopback either way, so a server left on `::1` refuses the connection either
 * way.
 *
 * @param context - The command, the mode and the repository around them.
 * @param stated - The names the repository states.
 * @returns IPv4 loopback where names are in play, and otherwise nothing, which leaves the server on
 *   its own answer.
 */
export function bound(context: Context, stated: readonly string[] = []): string | undefined {
  return hosts(context, stated).length > 0 ? LOOPBACK : undefined;
}
