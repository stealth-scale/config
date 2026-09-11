/**
 * The address a dev server listens on.
 */

import { type Preset, preset } from "#core/layer.ts";
import { bound as derived } from "#serving/environment.ts";

/**
 * Listens on the address given rather than on IPv6 loopback alone.
 *
 * A server left alone binds `::1`, which is `localhost` and nothing else. A name that resolves to
 * `127.0.0.1` — which is what a wildcard record pointed at a developer's own machine usually gives
 * — then reaches nothing at all, and the failure is a refused connection rather than a refused
 * request, so it looks like the server is down.
 *
 * Needed once anything is reached by a real name, which for two applications joined at run time is
 * immediately: they have to be two origins, and names are the only way to get two origins that
 * behave in development the way they will in production.
 *
 * `true` listens on every interface, which puts the server on the network the machine is on. That
 * is a decision about where a person is working rather than about the application, so it is asked
 * for rather than assumed.
 *
 * @param at - The address to listen on, or `true` for every interface. Worked out from the
 *   machine's own environment where none is given.
 * @returns The preset.
 */
export function bound(at: boolean | string | undefined = derived()): Preset {
  return preset({
    config: at === undefined ? {} : { server: { host: at } },
    name: `server.bound(${at ?? "its own answer"})`,
  });
}
