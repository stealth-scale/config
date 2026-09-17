/**
 * Configures the build and the test run for this package.
 *
 * @remarks
 *   The web preset decides every setting, because the scheme runs in the browser as well as in
 *   Node and reads nothing from either. The directory it is handed is the package root, which is
 *   what resolves the entry point and the output paths.
 */

import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname);
