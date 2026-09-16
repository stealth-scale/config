/**
 * Builds and tests this package under the plain configuration.
 *
 * @remarks
 *   The configuration tiers are themselves built on the plugin packages, so a
 *   plugin that extended a tier would pack itself with a version of itself. The
 *   plain configuration writes those settings out instead.
 */

import { defineConfig } from "vite";

import { plain } from "@stealthscale/vite-config-plain";

export default defineConfig(plain);
