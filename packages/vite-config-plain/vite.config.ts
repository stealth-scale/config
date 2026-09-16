/**
 * Configures the build and the specification run for this package.
 *
 * @remarks
 *   The package packs under the very value it publishes, so a defect in that value fails this
 *   package's own build before it reaches anything downstream.
 */

import { defineConfig } from "vite";

import { plain } from "./src/index.ts";

export default defineConfig(plain);
