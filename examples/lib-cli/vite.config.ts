/**
 * Builds the library and the command it installs.
 *
 * @remarks
 *   The command is named here rather than left to the packer, which would take
 *   the package name with its scope stripped and install `example-lib-cli`.
 *   This package is named for where it sits in the tree and the command for
 *   what it does, so the two are stated apart.
 */

import { pack } from "@stealthscale/vite-config";
import { defineConfig } from "@stealthscale/vite-config/preset/node";

export default defineConfig(import.meta.dirname, {
  extends: [pack.command({ tally: "src/bin/tally.ts" })],
});
