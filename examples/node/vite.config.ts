import { defineConfig } from "@stealthscale/config-vite/preset/node";

export default defineConfig({
  pack: {
    dts: true,
    entry: ["src/index.ts"],
    exports: { devExports: "stealth-source" },
  },
});
