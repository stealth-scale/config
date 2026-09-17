/**
 * Configures the build and the specification run for this package.
 *
 * @remarks
 *   The web preset gives each specification a document, which the readers of a rendered component
 *   are checked against. The file readers reach the file system through node's own modules, which
 *   the toolchain's types put in scope in every tier.
 */

import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname);
