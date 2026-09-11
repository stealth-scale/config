// Plain Vite+ configuration, naming no stealth package. Every other package here is configured by
// layers, and the layers are in this one — config-vite resolves the kernel by name, so the kernel is
// packed first and has nothing to compose itself out of. What the tiers would have stated is
// therefore written out below, and a change to either has to be made in both places.
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
