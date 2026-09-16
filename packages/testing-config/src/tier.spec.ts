import { describe, expect, it } from "vitest";

import { type Layer } from "#layers.ts";
import { composes } from "#tier.ts";

/**
 * A manifest that publishes one tier.
 */
const PUBLISHED = {
  exports: { ".": "./dist/index.mjs", "./preset/app": "./dist/app.mjs" },
  name: "x",
};

/**
 * A layer as a tier composes it.
 */
const LAYER: Layer = { kind: "preset", name: "test.files" };

/**
 * A config function that resolves to a config, as a tier's `defineConfig` returns.
 *
 * @returns The config.
 */
function composing(): Promise<object> {
  return Promise.resolve({ test: {} });
}

/**
 * A config function that throws.
 *
 * @throws Error Always, with the message the check is expected to report.
 */
function failing(): never {
  throw new Error("no manifest");
}

/**
 * A config function that resolves to a string.
 *
 * @returns The string.
 */
function stringly(): string {
  return "x";
}

/**
 * A tier module that composes cleanly.
 */
const TIER = {
  defineConfig: (): (() => Promise<object>) => composing,
  layers: (): unknown[] => [LAYER, [{ kind: "preset", name: "lint.node" }]],
};

/**
 * Runs the check with one tier module standing in for `preset/app`.
 *
 * @param tier - The tier module.
 * @returns The violations.
 */
function checked(tier: Record<string, unknown>): Promise<readonly string[]> {
  return composes(PUBLISHED, { "preset/app": tier }, "/x");
}

describe("composes", () => {
  it("accepts a tier that exports both functions and composes under a build", async () => {
    await expect(checked(TIER)).resolves.toStrictEqual([]);
  });

  it("accepts a manifest without a tier", async () => {
    await expect(composes({ name: "x" }, {}, "/x")).resolves.toStrictEqual([]);
  });

  it("reports a published tier the specification does not supply", async () => {
    await expect(composes(PUBLISHED, {}, "/x")).resolves.toStrictEqual([
      "preset/app is exported and not given to tiers",
    ]);
  });

  it("reports a tier without layers", async () => {
    await expect(checked({ defineConfig: TIER.defineConfig })).resolves.toStrictEqual([
      "preset/app exports no layers()",
    ]);
  });

  it("reports a tier without defineConfig", async () => {
    await expect(checked({ layers: TIER.layers })).resolves.toStrictEqual([
      "preset/app exports no defineConfig",
    ]);
  });

  it("reports a tier that composes something other than a layer", async () => {
    const layers = (): unknown[] => [LAYER, "x"];

    await expect(checked({ ...TIER, layers })).resolves.toStrictEqual([
      "preset/app composes something that is not a layer",
    ]);
  });

  it("reports a tier that composes one layer twice", async () => {
    const layers = (): unknown[] => [LAYER, LAYER];

    await expect(checked({ ...TIER, layers })).resolves.toStrictEqual([
      "preset/app composes twice a layer named test.files",
    ]);
  });

  it("reports a defineConfig that returns something other than a function", async () => {
    await expect(checked({ ...TIER, defineConfig: composing })).resolves.toStrictEqual([
      "preset/app defineConfig returns something other than a function of the environment",
    ]);
  });

  it("reports a config function that resolves to something other than a config", async () => {
    const defineConfig = (): (() => string) => stringly;

    await expect(checked({ ...TIER, defineConfig })).resolves.toStrictEqual([
      "preset/app composes to something other than a config",
    ]);
  });

  it("reports the message when composing throws", async () => {
    const defineConfig = (): (() => never) => failing;

    await expect(checked({ ...TIER, defineConfig })).resolves.toStrictEqual([
      "preset/app fails to compose under a build: no manifest",
    ]);
  });
});
