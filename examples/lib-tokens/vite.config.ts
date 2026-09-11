import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { pack } from "@stealthscale/config-vite";
import { defineConfig } from "@stealthscale/config-vite/preset/web";

import { stylesheet, TOKEN_EXPORTS } from "./src/palette.ts";

/**
 * Where the packer writes, and so where the stylesheet has to be by the time it looks.
 */
const OUT = join(import.meta.dirname, "dist");

export default defineConfig({
  extends: [
    pack.published(import.meta.dirname),

    // `build:before` rather than `build:prepare`: the packer empties `dist` between the two, so a
    // file written at the earlier moment is deleted before anything looks for it.
    pack.hook({
      because: "a custom property is not a module, so the palette has to reach a browser as text",
      hooks: {
        "build:before": (): void => {
          mkdirSync(OUT, { recursive: true });
          writeFileSync(join(OUT, "tokens.css"), stylesheet());
        },
      },
    }),

    // The list is the palette module's, not this file's. Written down here it would be a second
    // copy to keep in step with whatever the hook above actually writes.
    pack.ships(TOKEN_EXPORTS),
  ],
});
