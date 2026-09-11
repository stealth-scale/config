/**
 * Configuring a package says nothing about where it runs.
 */

import { type Extendable } from "#core/layer.ts";
import * as fmt from "#fmt/index.ts";
import * as lint from "#lint/index.ts";
import { configuring, type Defining } from "#preset/defaults.ts";
import * as resolve from "#resolve/index.ts";
import * as test from "#test/index.ts";

/**
 * The layers a package that reaches for neither node's globals nor the browser's is built on.
 *
 * Answered as a list as well as bound below, so that a config package for a framework composes
 * these with its own rather than sitting beside them. Sitting beside them is what lets a repository
 * pair the wrong tier with the right framework and lose half its rules without being told.
 *
 * @returns Each layer the tier is built on, in the order they compose.
 */
export function layers(): readonly Extendable[] {
  return [
    fmt.docblocks(),
    fmt.imports(),
    fmt.generated(),
    fmt.prose(),
    fmt.style(),
    fmt.manifests(),
    resolve.source(),
    lint.preset.base(),
    test.preset.base(),
  ];
}

/**
 * Composes a config for a package that reaches for neither node's globals nor the browser's.
 */
export const defineConfig: Defining = configuring(layers);
