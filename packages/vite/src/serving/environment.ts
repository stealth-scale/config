/**
 * What a machine says about how the servers on it are reached.
 */

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
 * @param named - The variable to read.
 * @returns Each entry, with the empties dropped.
 */
function listed(named: string): readonly string[] {
  const held: unknown = Reflect.get(process.env, named);

  return typeof held === "string" ? held.split(",").filter((one) => one.length > 0) : [];
}

/**
 * The names the servers on this machine answer to, beyond loopback.
 *
 * Read from the environment rather than written into a repository. Which names a machine answers to
 * is that machine's arrangement — one developer points a wildcard record at loopback, another has
 * none and uses ports — and a name committed to the repository is one everybody has to arrange.
 *
 * @returns Each name, or none where this machine has arranged none.
 */
export function hosts(): readonly string[] {
  return listed(HOSTS);
}

/**
 * The origins allowed to fetch what the servers on this machine serve.
 *
 * A different list from the names, and not derivable from them: an origin is a scheme, a name and a
 * port together, so a server answering to a name says nothing about which pages may read it.
 *
 * @returns Each origin, or none where nothing else loads from here.
 */
export function origins(): readonly string[] {
  return listed(ORIGINS);
}

/**
 * The address a server should listen on.
 *
 * @returns IPv4 loopback where names are in play, and otherwise nothing, which leaves the server on
 *   its own answer.
 */
export function bound(): string | undefined {
  return hosts().length > 0 ? LOOPBACK : undefined;
}
