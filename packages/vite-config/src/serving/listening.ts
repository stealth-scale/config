/**
 * Where the development server and the preview server listen.
 *
 * @remarks
 *   Every layer here takes the server it configures as its first argument and
 *   writes under that one alone, so the same call spells a development server
 *   and the preview of a build without either reaching the other.
 */

import { type UserConfig } from "vite";

import { type Preset, preset } from "@stealthscale/vite-config-core";

import { bound as derived, hosts } from "#serving/environment.ts";

/**
 * Which of the two servers a layer configures.
 */
export type Serving = "preview" | "server";

/**
 * The listening settings the two servers have in common.
 */
interface Listening {
  /**
   * The names the server answers to.
   */
  allowedHosts?: string[];

  /**
   * The interface to bind, or true for every one of them.
   */
  host?: boolean | string;

  /**
   * The port to bind.
   */
  port?: number;

  /**
   * Refuses to start on a taken port rather than moving to the next one.
   */
  strictPort?: boolean;
}

/**
 * Files a block of settings under the server it was written for.
 *
 * @remarks
 *   The other server is left absent rather than set to an empty object, so a
 *   composed config shows which of the two a layer touched.
 */
function stating(where: Serving, held: Listening): UserConfig {
  return where === "server" ? { server: held } : { preview: held };
}

/**
 * Binds the server to an address, or to the one its host names imply.
 *
 * @remarks
 *   An array asks for the address to be worked out, and works out nothing when
 *   the array and the machine are both empty. The layer then states no settings
 *   at all and leaves the engine's own default standing.
 */
export function bound(where: Serving, at: boolean | readonly string[] | string): Preset {
  return preset({
    config: (context) => {
      const held = typeof at === "object" ? derived(context, at) : at;

      return held === undefined ? {} : stating(where, { host: held });
    },
    name: `${where}.bound${spelled(typeof at === "object" ? at : [String(at)])}`,
  });
}

/**
 * Spells a layer's arguments into the name it carries.
 *
 * @remarks
 *   No arguments gives an empty string rather than an empty pair of brackets,
 *   so a layer stating nothing reads as `server.bound`.
 */
function spelled(args: readonly string[]): string {
  return args.length === 0 ? "" : `(${args.join(", ")})`;
}

/**
 * Pins the server to one port and refuses to start when it is taken.
 *
 * @remarks
 *   A server allowed to move up would still start, and everything that was told
 *   the first port would reach whatever is answering there instead.
 */
export function port(where: Serving, at: number): Preset {
  return preset({
    config: stating(where, { port: at, strictPort: true }),
    name: `${where}.port(${at})`,
  });
}

/**
 * Lists the names the server answers to, from the machine or from the caller.
 *
 * @remarks
 *   The names are copied into an array of the server's own, so a caller holding
 *   on to the list it passed cannot change what the server accepts once the
 *   config has resolved.
 */
export function reachable(where: Serving, names: readonly string[]): Preset {
  return preset({
    config: (context) => stating(where, { allowedHosts: [...hosts(context, names)] }),
    name: `${where}.reachable${spelled(names)}`,
  });
}

/**
 * Sets a whole address at once: the port, the names, and the interface to bind.
 *
 * @remarks
 *   The three layers are independent of one another, and a package that needs
 *   one of them states that one instead of this.
 * @param where - Which server to configure.
 * @param at - The port to pin.
 * @param names - The host names, which also decide whether the server binds
 *   loopback.
 */
export function address(
  where: Serving,
  at: number,
  names: readonly string[] = [],
): readonly Preset[] {
  return [port(where, at), reachable(where, names), bound(where, names)];
}
