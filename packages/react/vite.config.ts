import { defineConfig } from "@stealthscale/config-vite/preset/node";

export default defineConfig({
  pack: {
    dts: true,
    entry: ["src/index.ts", "src/preset/web.ts"],
    exports: {
      customExports: { "./vitest.setup.ts": "./vitest.setup.ts", "./web.json": "./web.json" },
      devExports: "stealth-source",
    },
  },
});
