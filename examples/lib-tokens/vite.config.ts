/**
 * Builds the package and writes the stylesheet that ships beside it.
 *
 * @remarks
 *   The hook runs at `buildBefore` rather than `buildPrepare`, because the
 *   packer empties `dist` between those two moments and a file written at the
 *   earlier one is deleted before anything looks for it.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { pack } from "@stealthscale/vite-config";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

import { stylesheet, TOKEN_EXPORTS } from "./src/palette.ts";

/**
 * The directory the packer publishes, and where the stylesheet is written.
 */
const OUT = join(import.meta.dirname, "dist");

export default defineConfig(import.meta.dirname, {
  extends: [
    pack.buildBefore({
      because: "a custom property is not a module, so the palette has to reach a browser as text",
      runs: (): void => {
        mkdirSync(OUT, { recursive: true });
        writeFileSync(join(OUT, "tokens.css"), stylesheet());
      },
    }),

    pack.subpaths(TOKEN_EXPORTS),
  ],
});
