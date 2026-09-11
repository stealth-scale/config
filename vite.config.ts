import { preset } from "@stealthscale/config-react";

import { test } from "./packages/vite/src/index.ts";
import { defineConfig } from "./packages/vite/src/preset/node.ts";

export default defineConfig({
  // All three are read from this file and nowhere else. The formatter and the linter reach every
  // package from here, and the runner is told which packages to run rather than sweeping them into
  // one run of its own.
  extends: [test.projects(import.meta.dirname), preset.workspace()],

  run: { cache: true },
});
