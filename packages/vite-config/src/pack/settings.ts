/**
 * The packer's own settings, as the block reaches them.
 */

import { type UserConfig } from "vite";

/**
 * One packer configuration.
 *
 * A config may hold a list of them, for a build producing several packages at once. Every layer
 * here describes one, because the block is composed into a package's own config and that is the
 * only place which knows what the package publishes.
 *
 * Read off the config's own field rather than imported from the toolchain, so nothing here names
 * the toolchain.
 */
export type Packing = Exclude<NonNullable<UserConfig["pack"]>, readonly unknown[]>;

/**
 * What the packer runs around a build, against the moment it runs.
 */
export type Hooks = NonNullable<Packing["hooks"]>;

/**
 * The hooks written as a map, which is the form this block states them in.
 *
 * The packer takes a function instead, handed its whole registry to call as it likes. Nothing here
 * offers that: a layer composes with the layers around it by being merged, and a function that
 * registers whatever it wants cannot be merged with another one.
 */
export type Moments = Exclude<Hooks, (...args: never[]) => unknown>;

/**
 * The command names a package installs, against the source file behind each.
 */
export type Commands = Readonly<Record<string, string>>;
