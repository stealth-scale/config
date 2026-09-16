/**
 * Builds this package on the node tier, since it ships configuration a build tool reads.
 */

import { defineConfig } from "@stealthscale/vite-config/preset/node";

export default defineConfig(import.meta.dirname);
