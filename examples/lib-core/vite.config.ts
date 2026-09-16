/**
 * Builds this package against the base preset, which assumes no runtime.
 *
 * @remarks
 *   The preset leaves out every Node and browser default, so an import of
 *   `node:fs` added to the source fails the build here rather than at a
 *   consumer's.
 */

import { defineConfig } from "@stealthscale/vite-config/preset/base";

export default defineConfig(import.meta.dirname);
