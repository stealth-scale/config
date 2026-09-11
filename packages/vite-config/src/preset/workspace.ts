/**
 * What a workspace states once, at its root, on behalf of every package below it.
 */

import { type Extendable } from "@stealthscale/vite-config-core";

import * as run from "#run/index.ts";
import * as staged from "#staged/index.ts";
import * as test from "#test/index.ts";

/**
 * The layers a root config states rather than a package.
 *
 * Each of these is read from the root and nowhere else. The task runner's cache and its continuous
 * integration settings describe the whole tree; what happens to a file before it is committed is
 * arranged once per repository, because there is one hook; and the list of projects is what the
 * root has instead of tests of its own.
 *
 * Neither a tier nor part of one. A root config is not a package — nothing to pack, nothing to
 * build, no tests of its own — so it takes this rather than `base`, `node` or `web`.
 *
 * Unowned, unlike what a framework package hands over. These are the toolchain's own layers under
 * their own names, so a repository takes one back by the name it already knows.
 *
 * @returns Each layer a root config needs, in the order they compose.
 */
export function workspace(): readonly Extendable[] {
  return [run.cache(), run.ci(), staged.checked(), staged.formatted(), test.projects()];
}
