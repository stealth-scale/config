/**
 * Builds this package on the plain tier, written out rather than extended from a tier.
 *
 * @remarks
 *   Every tier packs through this plugin, so a tier cannot be the thing that builds it without
 *   depending on its own output.
 */

import { defineConfig } from "vite";

import { plain } from "@stealthscale/vite-config-plain";

export default defineConfig(plain);
