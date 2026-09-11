// Plain Vite+ configuration, naming no stealth package. Every other package here is configured by
// layers, and the layers are in this one — config-vite resolves the kernel by name, so the kernel is
// packed first and has nothing to compose itself out of. What the tiers would have stated is
// therefore written out below, and a change to either has to be made in both places.
import sbom from "rollup-plugin-sbom";
import { defineConfig } from "vite-plus";

export default defineConfig(({ mode }) => ({
  pack: {
    // `pack.quality`: an export pointing at a file that is not shipped, and types that resolve as
    // something other than the module they sit beside.
    attw: true,
    dts: true,
    entry: { index: "src/index.ts" },
    exports: { devExports: "stealth-source" },

    // `pack.inventory`: what a packer inlines is no longer named by the manifest that declared it,
    // so the tarball carries its own account of what went in. A release says which build wrote it
    // and when; a development pack says neither, so two runs of one commit are the same file.
    // Nothing goes to `.well-known`: that is a path on a server, and nothing serves a tarball.
    plugins: [
      sbom({
        collectLicenseEvidence: true,
        generateSerial: mode === "production",
        includeWellKnown: false,
        outFormats: ["json"],
        rootComponentType: "library",
        saveTimestamp: mode === "production",
        specVersion: "1.7",
        supplier: { contact: [], name: "Stealth Scale B.V.", url: ["https://stealthscale.io"] },
      }),
    ],
    publint: true,
  },

  test: {
    // `test.isolation`: nothing a test did reaches the next one.
    clearMocks: true,
    exclude: ["**/node_modules/**", "**/dist/**", "**/coverage/**"],

    // `test.assertion`: a test that asserts nothing has not tested anything.
    expandSnapshotDiff: true,
    expect: { requireAssertions: true },
    globals: false,

    // `test.files`: tests live beside what they cover, and nowhere else.
    include: ["**/*.spec.ts"],
    restoreMocks: true,

    // `test.order`: a different order every run, so no test leans on the one before it.
    sequence: { shuffle: true },
    unstubEnvs: true,
    unstubGlobals: true,
  },
}));
