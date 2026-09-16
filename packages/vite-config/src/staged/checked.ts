/**
 * Runs the repository check over the source files a commit stages.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * The glob matching every source extension the checker reads.
 */
const SOURCE = "*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}";

/**
 * Checks each staged source file and writes back what it can fix.
 *
 * @remarks
 *   The command is the one a developer already runs by hand, so a commit is
 *   never refused for a rule the local check would have passed. Documents and
 *   stylesheets match nothing here and are handled by the formatting layer
 *   instead.
 */
export function checked(): Preset {
  return preset({
    config: { staged: { [SOURCE]: "vp check --fix" } },
    name: "staged.checked",
  });
}
