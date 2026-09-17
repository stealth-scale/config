/**
 * Formats the documents and manifests a commit stages.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * The glob matching the file types the formatter owns and the linter ignores.
 */
const WRITTEN = "*.{json,jsonc,md,css,html,yml,yaml}";

/**
 * The command the staged files are handed to.
 *
 * @remarks
 *   The formatter ignores a lockfile on its own, and a commit that stages `pnpm-lock.yaml` alone
 *   hands it nothing else. Without the flag it exits with "Expected at least one target file" and
 *   the commit is refused.
 */
const COMMAND = "vp fmt --no-error-on-unmatched-pattern";

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
    config: { staged: { [WRITTEN]: COMMAND } },
    name: "staged.formatted",
  });
}
