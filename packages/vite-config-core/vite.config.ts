/**
 * Packs this package under the settings the plain tier states.
 *
 * @remarks
 *   Every tier is built on this package, so composing one here would have the
 *   package configure itself. The tier's bare config goes to Vite directly
 *   instead, with no layer involved.
 */

import { defineConfig } from "vite";

import { plain } from "@stealthscale/vite-config-plain";

export default defineConfig(plain);
