// Plain Vite+ configuration, naming no stealth package. config-vite's tiers reach for this plugin,
// so a plugin built by those tiers is a cycle: each would have to be packed before the other. What
// the node tier would have stated is written out below, and a change to either has to be made in
// both places.
import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    attw: true,
    dts: true,
    entry: { index: "src/index.ts" },
    exports: { devExports: "stealth-source" },
    publint: true,
  },

  test: {
    clearMocks: true,
    exclude: ["**/node_modules/**", "**/dist/**", "**/coverage/**"],
    expandSnapshotDiff: true,
    expect: { requireAssertions: true },
    globals: false,
    include: ["**/*.spec.ts"],
    restoreMocks: true,
    sequence: { shuffle: true },
    unstubEnvs: true,
    unstubGlobals: true,
  },
});
