/**
 * Where a dev server is reached: its port, its names, and the address that follows from them.
 */

import { type Preset } from "@stealthscale/config-core";

import { reached as at } from "#serving/listening.ts";

/**
 * States where the dev server is reached, in one layer set rather than three.
 *
 * `server.port`, `server.reachable` and `server.bound` answer one question between them, and an
 * application states all three or none: a name the server answers to is a name that resolves to
 * loopback, so the address follows from the names rather than being a separate decision.
 *
 * Each of the three is still its own layer under its own name, so a repository that disagrees with
 * one takes that one back.
 *
 * @param port - The port to serve at.
 * @param names - The names it answers to, beyond loopback. What the repository knows about itself,
 *   which `STEALTH_HOSTS` overrides where a machine needs its own.
 * @returns The layers, in the order they compose.
 */
export function reached(port: number, names: readonly string[] = []): readonly Preset[] {
  return at("server", port, names);
}
