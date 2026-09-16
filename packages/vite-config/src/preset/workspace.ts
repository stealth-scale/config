/**
 * Configuring a workspace root, which states once what every package below it shares.
 */

import { configuring, type Defining, type Extendable } from "@stealthscale/vite-config-core";

import { layers as node } from "#preset/node.ts";
import * as run from "#run/index.ts";
import * as staged from "#staged/index.ts";
import * as test from "#test/index.ts";

/**
 * The layers a workspace root is built on.
 *
 * The node tier underneath, for three reasons. The linter and the formatter read the root config
 * and nowhere else, so the root has to carry them. A package with no config of its own is built
 * through the root's, so the root has to carry the pack layers too. And the root's own files, its
 * config among them, run on node.
 *
 * On top of that, what only a root states. The task runner's cache and its continuous integration
 * task describe the whole tree. What happens to a file before it is committed is arranged once per
 * repository, because there is one hook. The list of projects is what the root has instead of tests
 * of its own.
 *
 * Every layer here is the toolchain's own, under its own name, so a repository takes one back by
 * the name it already knows.
 *
 * @returns Each layer a root is built on, in the order they compose.
 */
export function layers(): readonly Extendable[] {
  return [...node(), run.cache(), run.ci(), staged.checked(), staged.formatted(), test.projects()];
}

/**
 * Composes a config for a workspace root.
 */
export const defineConfig: Defining = configuring(layers);
