// By relative path, not by name: this is the package being configured, so the condition that
// resolves it to its source is the one this file is loading.
import { defineConfig } from "./src/index.ts";

export default defineConfig({
  pack: {
    dts: true,
    entry: ["src/index.ts", "src/preset/base.ts", "src/preset/node.ts", "src/preset/web.ts"],
    exports: {
      customExports: { "./globals": "./globals.d.ts" },
      devExports: "stealth-source",
    },
  },
});
