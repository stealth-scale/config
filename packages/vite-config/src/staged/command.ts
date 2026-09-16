/**
 * Attaches a repository's own command to the files a commit stages.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

import { type Runs } from "#staged/settings.ts";

/**
 * Runs the given commands over each staged file matching a glob.
 *
 * @remarks
 *   The layer is named for its glob, so a second call naming the same glob
 *   replaces the first instead of running alongside it. A list is copied into
 *   the layer, and a caller mutating its array afterwards changes nothing.
 * @param files - The glob matched against each staged path.
 * @param runs - One command, or several to run in the order written.
 */
export function command(files: string, runs: Runs): Preset {
  return preset({
    config: { staged: { [files]: typeof runs === "string" ? runs : [...runs] } },
    name: `staged.command(${files})`,
  });
}
