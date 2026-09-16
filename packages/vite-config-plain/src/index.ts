/**
 * The configuration a package is packed under when it cannot extend a tier.
 *
 * Every tier in `@stealthscale/vite-config` is built on the kernel and packs through the bill of
 * materials plugin, so the kernel and the plugins are packed before any tier exists. They use this
 * configuration instead. It repeats the node tier's `pack`, `resolve`, `ssr` and `test` blocks, and
 * `index.spec.ts` fails when the two stop agreeing.
 *
 * @packageDocumentation
 */

import { defaultClientConditions, defaultServerConditions, type UserConfig } from "vite";

/**
 * The condition every stealth repository resolves its own packages through.
 *
 * `@stealthscale/vite-config` publishes the same string as `resolve.SOURCE`, and the shared
 * tsconfig names it in `customConditions`. `index.spec.ts` fails when the three stop agreeing.
 */
const SOURCE = "stealth-source";

/**
 * The directories excluded from every test run.
 */
const FOREIGN = ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/coverage/**"];

/**
 * The configuration the kernel and the plugins are packed under.
 */
export const plain: UserConfig = {
  pack: {
    attw: true,
    dts: true,
    entry: { index: "src/index.ts" },
    exports: { devExports: SOURCE },
    publint: true,
  },

  resolve: { conditions: [SOURCE, ...defaultClientConditions] },

  ssr: { resolve: { conditions: [SOURCE, ...defaultServerConditions] } },

  test: {
    clearMocks: true,
    environment: "node",
    exclude: FOREIGN,
    expandSnapshotDiff: true,
    expect: { requireAssertions: true },
    globals: false,
    include: ["**/*.spec.{ts,tsx}"],
    restoreMocks: true,
    sequence: { shuffle: true },
    unstubEnvs: true,
    unstubGlobals: true,
  },
};
