/**
 * Running a repository's own command over what it is about to commit.
 */

import { type Preset, preset } from "@stealthscale/config-core";

import { type Runs } from "#staged/settings.ts";

/**
 * Runs a repository's own command over the staged files matching a glob.
 *
 * For what only this repository knows to do before a commit: regenerating something a file implies,
 * checking a licence header, refusing a fixture somebody meant to delete. The command is given the
 * matching paths, so it acts on what changed rather than on the tree.
 *
 * One preset per glob, each named for the glob it carries, so a repository can take back exactly
 * one. Two layers naming the same glob are the one case that does not compose, and the nearer one
 * wins — which is how a repository replaces what the house put there.
 *
 * @param files - The glob, matched against each staged path.
 * @param runs - The command, or the commands in order.
 * @returns The preset.
 */
export function on(files: string, runs: Runs): Preset {
  return preset({
    config: { staged: { [files]: typeof runs === "string" ? runs : [...runs] } },
    name: `staged.on(${files})`,
  });
}
