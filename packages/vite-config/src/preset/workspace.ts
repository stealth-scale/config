/**
 * Configures the root of a repository rather than a package inside it.
 */

import { configuring, type Defining, type Extendable } from "@stealthscale/vite-config-core";

import { layers as node } from "#preset/node.ts";
import * as run from "#run/index.ts";
import * as staged from "#staged/index.ts";
import * as test from "#test/index.ts";

/**
 * Lists the node tier plus everything only a workspace root gets to declare.
 *
 * @remarks
 *   A task table, a commit hook and the project list are read once for the
 *   whole tree. Declaring any of the three inside a package has every package
 *   repeat it while the runner reads the root's copy regardless.
 */
export function layers(): readonly Extendable[] {
  return [...node(), run.cache(), run.ci(), staged.checked(), staged.formatted(), test.projects()];
}

/**
 * Composes the Vite configuration a repository root is defined with.
 *
 * @remarks
 *   Every layer reaching this tier carries an unowned name, with no path in it.
 *   A repository can therefore remove one by the name it reads in the
 *   configuration rather than by guessing which package minted it.
 */
export const defineConfig: Defining = configuring(layers);
