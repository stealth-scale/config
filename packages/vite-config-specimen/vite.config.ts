/**
 * Builds this package with the node tier, which is what a package shipping no browser code takes.
 */

import { defineConfig } from "@stealthscale/vite-config/preset/node";

export default defineConfig(import.meta.dirname);
