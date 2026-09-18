import { describe, expect, it, vi } from "vitest";

import { packageFiles, withScratchWorkspaceAsync } from "@stealthscale/testing";

import { type Conformance, violations } from "#conformance.ts";
import { type Layer } from "#layers.ts";

const REFRESH: Layer = { because: "why", kind: "contribution", name: "leaf.plugin.refresh" };

function hook(): undefined {
  return undefined;
}

const UNSET: string | undefined = undefined;

const MANIFEST = {
  engines: { node: ">=26.0.0" },
  exports: {
    ".": { default: "./dist/index.mjs", "stealth-source": "./src/index.ts" },
    "./package.json": "./package.json",
  },
  files: ["dist", "LICENSE", "README.md"],
  name: "@stealthscale/vite-config-leaf",
  peerDependencies: { vite: "catalog:peer" },
  publishConfig: { exports: { ".": "./dist/index.mjs", "./package.json": "./package.json" } },
};

const CARRIED = { LICENSE: "MIT\n", "README.md": "# leaf\n", "src/index.ts": "export {};\n" };

const BARREL = {
  layers: (): Layer[] => [REFRESH],
  plugin: { refresh: (): Layer => REFRESH },
};

function checked(
  stated: Omit<Conformance, "at">,
  fields: Record<string, unknown> = {},
  carried: Record<string, string> = {},
): Promise<readonly string[]> {
  const tree = {
    "package.json": JSON.stringify({ engines: { node: ">=26.0.0" }, name: "root" }),
    "pnpm-workspace.yaml": "packages:\n  - packages/*\n",
    ...packageFiles("packages/leaf", { ...MANIFEST, ...fields }, { ...CARRIED, ...carried }),
  };

  return withScratchWorkspaceAsync(tree, (workspace) =>
    violations({ ...stated, at: workspace.path("packages/leaf") }),
  );
}

describe("violations", () => {
  it("returns an empty array for a library that conforms", async () => {
    await expect(checked({ kind: "library", module: {} })).resolves.toStrictEqual([]);
  });

  it("returns an empty array for a config package that conforms", async () => {
    await expect(checked({ kind: "config", module: BARREL })).resolves.toStrictEqual([]);
  });

  it("returns an empty array for a plugin package that conforms", async () => {
    const plugin = { configResolved: hook, generateBundle: hook };
    const module = { leaf: (): Record<string, unknown> => ({ ...plugin, name: "stealth:leaf" }) };

    await expect(checked({ kind: "plugin", module })).resolves.toStrictEqual([]);
  });

  it("prefixes each violation with the check that found it", async () => {
    await expect(checked({ kind: "library", module: {} }, { files: [] })).resolves.toStrictEqual([
      "manifest.files: files omits LICENSE",
      "manifest.files: files omits README.md",
      "manifest.files: files does not cover ./dist/index.mjs",
    ]);
  });

  it("runs the layer checks for a config package only", async () => {
    const module = { lint: { relax: (): Layer => ({ kind: "preset", name: "wrong" }) } };
    const found = await checked({ kind: "library", module });
    const flagged = await checked({ kind: "config", module });

    expect(found).toStrictEqual([]);
    expect(flagged).toContain(
      "layer.named: lint.relax returns wrong, which is not named for the call",
    );
  });

  it("reads what a package's own sources import", async () => {
    const carried = { "src/held.spec.ts": "", "src/held.ts": 'export { one } from "elsewhere";\n' };
    const found = await checked({ kind: "library", module: {} }, {}, carried);

    expect(found).toStrictEqual([
      "source.declared: src/held.ts imports elsewhere, which the manifest does not declare",
    ]);
  });

  it("reads what a package's own sources are suffixed", async () => {
    const carried = { "src/held.spec.ts": "", "src/held.tsx": "export const one = 1;\n" };
    const found = await checked({ kind: "library", module: {} }, {}, carried);

    expect(found).toStrictEqual(["source.jsx: src/held.tsx writes no JSX, so its suffix is ts"]);
  });

  it("runs the checks listed in only and no others", async () => {
    vi.stubEnv("CI", UNSET);

    const found = await checked(
      { kind: "library", module: {}, only: ["manifest.engines"] },
      { engines: {}, files: [] },
    );

    expect(found).toStrictEqual(["manifest.engines: engines.node is not stated"]);
  });

  it("reports only as a violation when CI is set", async () => {
    vi.stubEnv("CI", "true");

    await expect(
      checked({ kind: "library", module: {}, only: ["manifest.engines"] }),
    ).resolves.toStrictEqual(["only is set in a specification running under CI"]);
  });

  it("leaves out a skipped check that gives a reason", async () => {
    const stated = { kind: "library", module: {}, skip: { "manifest.files": "a reason" } } as const;

    await expect(checked(stated, { files: [] })).resolves.toStrictEqual([]);
  });

  it("reports a skipped check that gives no reason", async () => {
    const stated = { kind: "library", module: {}, skip: { "manifest.files": " " } } as const;

    await expect(checked(stated)).resolves.toStrictEqual([
      "skip of manifest.files gives no reason",
    ]);
  });

  it("passes the supplied arguments and tiers through to the checks", async () => {
    const tier = { defineConfig: (): (() => object) => () => ({}), layers: (): Layer[] => [] };
    const module = { lint: { relax: (stated: unknown): unknown => stated } };
    const stated = {
      arguments: { "lint.relax": [{ kind: "contribution", name: "leaf.lint.relax" }] },
      kind: "config",
      module,
      tiers: { "preset/app": tier },
    } as const;
    const fields = {
      exports: { ...MANIFEST.exports, "./preset/app": "./src/index.ts" },
      publishConfig: {
        exports: { ...MANIFEST.publishConfig.exports, "./preset/app": "./src/index.ts" },
      },
    };

    await expect(checked(stated, fields)).resolves.toStrictEqual([
      "manifest.files: files does not cover ./src/index.ts",
      "layer.reasoned: leaf.lint.relax is a contribution with an empty because",
    ]);
  });
});
