/**
 * What a commit does to the source files it is about to record.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * The files the whole toolchain has something to say about.
 */
const SOURCE = "*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}";

/**
 * Formats, lints and type-checks the source files a commit is about to record.
 *
 * The same command a repository runs by hand, pointed at the files that changed. `--fix` is the
 * point of running it here rather than after: what the formatter and the linter can settle, they
 * settle before the commit exists, so the diff under review is the one the tools agree on and no
 * later commit says "format".
 *
 * A hook is not a substitute for the checks a repository runs on the whole tree. What is staged is
 * a subset, and a change that only breaks something elsewhere passes this and fails `vp run ci`,
 * which is the right place for it to fail — this one is for the mistakes worth catching in the two
 * seconds before a commit rather than the two minutes after a push.
 *
 * Read from the workspace root's config. `vp staged` runs from wherever the hook does, which is the
 * root of the repository, so that is the config it reads.
 *
 * @returns The preset.
 */
export function checked(): Preset {
  return preset({
    config: { staged: { [SOURCE]: "vp check --fix" } },
    name: "staged.checked",
  });
}
