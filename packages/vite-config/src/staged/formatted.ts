/**
 * What a commit does to everything else it is about to record.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * The files the formatter has something to say about and the linter has not.
 */
const WRITTEN = "*.{json,jsonc,md,css,html,yml,yaml}";

/**
 * Formats everything a commit is about to record that is not source.
 *
 * Apart from `staged.checked` because what these need is the smaller half of it: a stylesheet, a
 * manifest and a document are formatted and nothing more. Running the whole check on them would
 * type-check a repository because somebody edited a README.
 *
 * @returns The preset.
 */
export function formatted(): Preset {
  return preset({
    config: { staged: { [WRITTEN]: "vp fmt" } },
    name: "staged.formatted",
  });
}
