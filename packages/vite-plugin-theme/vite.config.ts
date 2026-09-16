/**
 * Configures the build and the test run for this package.
 *
 * @remarks
 *   The node preset decides every setting, and this package adds none of its own. The directory it
 *   is handed is the package root, which is what resolves the entry points and the output paths.
 */

import { defineConfig } from "@stealthscale/vite-config/preset/node";

export default defineConfig(import.meta.dirname);
