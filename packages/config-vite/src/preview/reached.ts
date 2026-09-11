/**
 * Where a preview is reached: its port, its names, and the address that follows from them.
 */

import { type Preset } from "@stealthscale/config-core";

import { reached as at } from "#serving/listening.ts";

/**
 * States where the preview is reached, in one layer set rather than three.
 *
 * The dev server's counterpart, and the same three decisions. A preview keeps its own port, which
 * is what lets an application be previewed while it is also being served, so this is stated beside
 * `server.reached` rather than instead of it.
 *
 * Each of the three is still its own layer under its own name, so a repository that disagrees with
 * one takes that one back.
 *
 * @param port - The port to serve the build at.
 * @param names - The names it answers to, beyond loopback. What the repository knows about itself,
 *   which `STEALTH_HOSTS` overrides where a machine needs its own.
 * @returns The layers, in the order they compose.
 */
export function reached(port: number, names: readonly string[] = []): readonly Preset[] {
  return at("preview", port, names);
}
