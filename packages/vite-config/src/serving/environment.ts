/**
 * The host names and origins a machine states for its own servers.
 *
 * @remarks
 *   A name that resolves on one developer's machine has no business in a file
 *   everybody shares. These variables let that machine say what it arranged,
 *   and replace what the repository declared rather than adding to it.
 */

import { type Context } from "@stealthscale/vite-config-core";

/**
 * The variable naming the hosts a server answers to.
 */
const HOSTS = "STEALTH_HOSTS";

/**
 * The variable naming the origins allowed to fetch from it.
 */
const ORIGINS = "STEALTH_ORIGINS";

/**
 * The address a server binds once it is reached under a name.
 */
const LOOPBACK = "127.0.0.1";

/**
 * Splits a comma-separated variable into the entries it names.
 *
 * @remarks
 *   An empty entry is dropped, so a trailing comma costs nothing. A variable
 *   that is unset and one set to an empty string both give no entries, which is
 *   what makes an empty setting fall back rather than blank the list.
 */
function listed(context: Context, named: string): readonly string[] {
  const held = context.env[named];

  return typeof held === "string" ? held.split(",").filter((one) => one.length > 0) : [];
}

/**
 * Reports the host names the server answers to.
 *
 * @remarks
 *   A machine naming any host replaces the whole list the repository declared.
 *   A developer setting the variable gets those names and no others, rather
 *   than theirs appended to a list they cannot see.
 */
export function hosts(context: Context, stated: readonly string[] = []): readonly string[] {
  const held = listed(context, HOSTS);

  return held.length > 0 ? held : stated;
}

/**
 * Reports the origins allowed to fetch from the server.
 *
 * @remarks
 *   Each entry is a whole origin, scheme and all. A bare host name matches
 *   nothing at run time and is not reported as a mistake here.
 */
export function origins(context: Context, stated: readonly string[] = []): readonly string[] {
  const held = listed(context, ORIGINS);

  return held.length > 0 ? held : stated;
}

/**
 * Reports the address to bind once the server is reached under a name.
 *
 * @remarks
 *   A server answering to a name is reached through something that forwards to
 *   it, so it listens on loopback rather than on every interface.
 * @returns The loopback address, or undefined when neither the machine nor the
 *   repository names a host.
 */
export function bound(context: Context, stated: readonly string[] = []): string | undefined {
  return hosts(context, stated).length > 0 ? LOOPBACK : undefined;
}
