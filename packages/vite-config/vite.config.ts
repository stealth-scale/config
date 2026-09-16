/**
 * Configures this package with the same tier it hands every other node package.
 *
 * @remarks
 *   The tier is imported by relative path rather than by package name, because
 *   this is the package being configured and the condition that would resolve
 *   its name to source is the one this file is still loading. The node tier
 *   rather than the bare kernel, so that a package stating how everything else
 *   is tested is tested that way itself.
 */

import { defineConfig } from "./src/preset/node.ts";

export default defineConfig(import.meta.dirname);
