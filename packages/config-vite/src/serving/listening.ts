/**
 * What the dev server and the preview server both state, stated once.
 */

import { type UserConfig } from "vite-plus";

import { type Preset, preset } from "@stealthscale/config-core";

import { bound as derived, hosts } from "#serving/environment.ts";

/**
 * Which of the two servers a layer is speaking about.
 */
export type Serving = "preview" | "server";

/**
 * The settings both servers take, which is every setting these layers write.
 */
interface Listening {
  /**
   * The names it answers to, beyond loopback.
   */
  allowedHosts?: string[];

  /**
   * The address it binds.
   */
  host?: boolean | string;

  /**
   * The port it serves at.
   */
  port?: number;

  /**
   * Whether a busy port fails rather than becoming another one.
   */
  strictPort?: boolean;
}

/**
 * Writes a block under whichever of the two keys was named.
 *
 * Stated as a branch rather than a computed key, because a computed one answers a record of
 * unknowns and neither block would then be checked against what it actually takes.
 *
 * @param where - Which server is being configured.
 * @param held - The settings that server takes.
 * @returns The config, under that one key.
 */
function stating(where: Serving, held: Listening): UserConfig {
  return where === "server" ? { server: held } : { preview: held };
}

/**
 * Listens on the address given rather than on IPv6 loopback alone.
 *
 * @param where - Which server is being configured.
 * @param at - The address, `true` for every interface, or the names to work it out from.
 * @returns The preset.
 */
export function bound(where: Serving, at: boolean | readonly string[] | string): Preset {
  return preset({
    config: (context) => {
      const held = typeof at === "object" ? derived(context, at) : at;

      return held === undefined ? {} : stating(where, { host: held });
    },
    name: `${where}.bound`,
  });
}

/**
 * Serves on the port given, and refuses to move off it.
 *
 * @param where - Which server is being configured.
 * @param at - The port to serve at.
 * @returns The preset.
 */
export function port(where: Serving, at: number): Preset {
  return preset({
    config: stating(where, { port: at, strictPort: true }),
    name: `${where}.port(${at})`,
  });
}

/**
 * Answers to the names given, beyond loopback.
 *
 * @param where - Which server is being configured.
 * @param names - The names the repository states, which the machine's own override.
 * @returns The preset.
 */
export function reachable(where: Serving, names: readonly string[]): Preset {
  return preset({
    config: (context) => stating(where, { allowedHosts: [...hosts(context, names)] }),
    name: `${where}.reachable`,
  });
}
