/**
 * What a test runs inside.
 */

import { type UserConfig } from "vite-plus";

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * The environments the runner knows, read off the block rather than written out again.
 */
export type Environment = NonNullable<NonNullable<UserConfig["test"]>["environment"]>;

/**
 * Runs a package's tests inside the environment it is written for.
 *
 * A tier states this rather than a repository, because where a package runs is the thing a tier
 * already decides. It is an entry point because one package occasionally needs the other answer: a
 * library tested against `jsdom` for a browser quirk `happy-dom` does not reproduce.
 *
 * Whatever is named has to be installed. `node` is the runner's own and needs nothing; the two
 * document implementations come from npm, and this package asks for one of them as a peer.
 *
 * @param inside - The environment, as the runner names it.
 * @returns The preset.
 */
export function environment(inside: Environment): Preset {
  return preset({ config: { test: { environment: inside } }, name: `test.environment(${inside})` });
}
