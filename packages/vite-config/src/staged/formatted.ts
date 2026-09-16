/**
 * Formats the documents and manifests a commit stages.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * The glob matching the file types the formatter owns and the linter ignores.
 */
const WRITTEN = "*.{json,jsonc,md,css,html,yml,yaml}";

/**
 * Formats each staged document, stylesheet and manifest, and does nothing
 * further to it.
 *
 * @remarks
 *   None of these file types carries the type information the checker wants, so
 *   only the formatter runs. A source extension is deliberately absent, which
 *   keeps the two staged layers from touching the same file twice.
 */
export function formatted(): Preset {
  return preset({
    config: { staged: { [WRITTEN]: "vp fmt" } },
    name: "staged.formatted",
  });
}
