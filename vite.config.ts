import * as css from "@stealthscale/vite-config-css";
import * as react from "@stealthscale/vite-config-react";

import { layers as exampleAppWorker } from "./examples/app-worker/vite.layers.ts";
import { layers as exampleLibUi } from "./examples/lib-ui/vite.layers.ts";
import { layers as foundationTheme } from "./foundations/theme/vite.layers.ts";
import { fmt } from "./packages/vite-config/src/index.ts";
import { defineConfig } from "./packages/vite-config/src/preset/workspace.ts";

export default defineConfig(import.meta.dirname, {
  extends: [
    react.workspace(),
    css.workspace(),

    fmt.skip({
      because:
        "changesets writes it from the changeset files and rewrites it on every release, so a " +
        "wrapped changelog is undone by the next `changeset version` and the diff it leaves is " +
        "nobody's to read. The text is already wrapped where it is written, in the changeset",
      files: ["**/CHANGELOG.md"],
    }),

    exampleAppWorker,
    exampleLibUi,
    foundationTheme,
  ],
});
