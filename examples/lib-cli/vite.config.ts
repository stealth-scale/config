import { pack } from "@stealthscale/vite-config";
import { defineConfig } from "@stealthscale/vite-config/preset/node";

export default defineConfig(import.meta.dirname, {
  extends: [
    // The package is named for where it sits and the command for what it does, so the two are said
    // apart. Left alone the packer names the command after the package with its scope stripped,
    // which here would install `example-lib-cli`.
    pack.command({ tally: "src/bin/tally.ts" }),
  ],
});
