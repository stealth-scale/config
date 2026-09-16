/**
 * Narrows the packer's own settings to the single shapes the layers here write.
 */

import { type UserConfig } from "vite";

/**
 * Describes one packer configuration, with the multi-bundle form ruled out.
 *
 * @remarks
 *   A `pack` field may hold an array, and a package that wants two bundles from one source writes
 *   one. Every layer in this directory spreads into a single object, which cannot be done to an
 *   array without deciding which element it belongs to.
 */
export type Packing = Exclude<NonNullable<UserConfig["pack"]>, readonly unknown[]>;

/**
 * Covers both forms the packer accepts for its hooks.
 */
export type Hooks = NonNullable<Packing["hooks"]>;

/**
 * Keys the code the packer runs by the moment it runs it at.
 *
 * @remarks
 *   The registrar form is ruled out because two layers each merge their moments into what the
 *   configuration already holds, and two registrars merge only by calling both.
 */
export type Moments = Exclude<Hooks, (...args: never[]) => unknown>;

/**
 * Pairs each command a package installs with the source file it is built from.
 *
 * @remarks
 *   The path is a file the packer builds, not one it ships as-is. The published `bin` field points
 *   at the output instead.
 */
export type Commands = Readonly<Record<string, string>>;
