import { preset } from "@stealthscale/config-react";

import { defineConfig } from "./packages/vite/src/preset/node.ts";

export default defineConfig({
  // The formatter and the linter are read from this file and nowhere else, so what renders under
  // `examples/react` is grouped and checked from here rather than from its own config.
  extends: [preset.workspace()],

  run: { cache: true },
});
