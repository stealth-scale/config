/**
 * Builds this package against the Node preset and adds nothing to it.
 *
 * @remarks
 *   The preset supplies the entry, the target and the externals. A file this
 *   short is the whole configuration a Node library needs, and anything written
 *   here would be a second copy of a default.
 */

import { defineConfig } from "@stealthscale/vite-config/preset/node";

export default defineConfig(import.meta.dirname);
