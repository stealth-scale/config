import { describe, expect, it } from "vitest";

import { packageFiles, type ScratchFiles, withScratchWorkspace } from "@stealthscale/testing";

import { engines, exports, files, peers, type Published, publishedOf } from "#manifest.ts";

/**
 * The manifest fields every scratch package shares.
 */
const BASE = {
  engines: { node: ">=26.0.0" },
  files: ["dist", "LICENSE", "README.md"],
  name: "@acme/leaf",
};

/**
 * The files every scratch package carries beside its manifest.
 */
const CARRIED = { LICENSE: "MIT\n", "README.md": "# leaf\n", "src/index.ts": "export {};\n" };

/**
 * A conditional subpath as a stealth package writes it.
 */
const CONDITIONAL = { default: "./dist/index.mjs", "stealth-source": "./src/index.ts" };

/**
 * Writes a scratch workspace with one package and runs a check against it.
 *
 * @param fields - The package manifest fields beyond the shared ones.
 * @param run - The check to run, given the parsed manifest and the package directory.
 * @param extra - The files to write beside the manifest, on top of the shared ones.
 * @returns The violations the check returned.
 */
function checked(
  fields: Record<string, unknown>,
  run: (published: Published, at: string) => readonly string[],
  extra: ScratchFiles = {},
): readonly string[] {
  const tree = {
    "package.json": JSON.stringify({ engines: { node: ">=26.0.0" }, name: "root" }),
    "pnpm-workspace.yaml": "packages:\n  - packages/*\n",
    ...packageFiles("packages/leaf", { ...BASE, ...fields }, { ...CARRIED, ...extra }),
  };

  return withScratchWorkspace(tree, (workspace) => {
    const at = workspace.path("packages/leaf");

    return run(publishedOf(at), at);
  });
}

describe("manifest", () => {
  it("reads the manifest of the package at a directory", () => {
    expect(checked({}, (published) => [published.name])).toStrictEqual(["@acme/leaf"]);
  });

  it("accepts an export map whose files exist", () => {
    const fields = {
      exports: { ".": CONDITIONAL, "./package.json": "./package.json" },
      publishConfig: { exports: { ".": "./dist/index.mjs", "./package.json": "./package.json" } },
    };

    expect(checked(fields, exports)).toStrictEqual([]);
  });

  it("accepts a manifest without an export map", () => {
    expect(checked({}, exports)).toStrictEqual([]);
  });

  it("reports a subpath whose file does not exist", () => {
    const fields = { exports: { "./web.json": "./web.json" } };

    expect(checked(fields, exports)).toStrictEqual([
      'exports["./web.json"] names ./web.json, which does not exist',
    ]);
  });

  it("reports a conditional subpath without a default", () => {
    const fields = { exports: { ".": { "stealth-source": "./src/index.ts" } } };

    expect(checked(fields, exports)).toContain('exports["."] has no default');
  });

  it("reports a default outside dist", () => {
    const fields = { exports: { ".": { ...CONDITIONAL, default: "./src/index.ts" } } };

    expect(checked(fields, exports)).toContain(
      'exports["."] defaults to ./src/index.ts, which is not under dist',
    );
  });

  it("reports a conditional subpath without the source condition", () => {
    const fields = { exports: { ".": { default: "./dist/index.mjs" } } };

    expect(checked(fields, exports)).toContain('exports["."] publishes no stealth-source');
  });

  it("reports a source condition that names no source file", () => {
    const fields = { exports: { ".": { ...CONDITIONAL, "stealth-source": "./src/missing.ts" } } };

    expect(checked(fields, exports)).toContain(
      'exports["."] names ./src/missing.ts under stealth-source, which is not a source file',
    );
  });

  it("reports a missing publishConfig when a subpath is conditional", () => {
    const fields = { exports: { ".": CONDITIONAL } };

    expect(checked(fields, exports)).toContain(
      "publishConfig.exports is missing, and a conditional subpath is published as written",
    );
  });

  it("reports a published map that omits or changes a subpath", () => {
    const fields = {
      exports: { ".": CONDITIONAL, "./other": "./src/index.ts" },
      publishConfig: { exports: { ".": "./dist/other.mjs", "./extra": "./dist/extra.mjs" } },
    };

    expect(checked(fields, exports)).toStrictEqual([
      'publishConfig.exports["."] is "./dist/other.mjs", not "./dist/index.mjs"',
      "publishConfig.exports omits ./other",
      "exports omits ./extra, which is published",
    ]);
  });

  it("reports a published map when the development map is absent", () => {
    const fields = { exports: undefined, publishConfig: { exports: { ".": "./dist/index.mjs" } } };

    expect(checked(fields, exports)).toStrictEqual(["exports omits ., which is published"]);
  });

  it("accepts a files field that carries the licence and the README", () => {
    expect(checked({}, files)).toStrictEqual([]);
  });

  it("reports a manifest without a files field", () => {
    expect(checked({ files: undefined }, files)).toStrictEqual([
      "files omits LICENSE",
      "files omits README.md",
    ]);
  });

  it("reports a files field that omits the licence or the README", () => {
    expect(checked({ files: ["dist"] }, files)).toStrictEqual([
      "files omits LICENSE",
      "files omits README.md",
    ]);
  });

  it("reports a listed file that does not exist and exempts dist", () => {
    expect(checked({ files: [...BASE.files, "web.json"] }, files)).toStrictEqual([
      "files lists web.json, which does not exist",
    ]);
  });

  it("reports a published file that no entry covers", () => {
    const fields = {
      exports: { ".": CONDITIONAL, "./web.json": "./web.json" },
      publishConfig: { exports: { ".": "./dist/index.mjs", "./web.json": "./web.json" } },
    };

    expect(checked(fields, files, { "web.json": "{}" })).toStrictEqual([
      "files does not cover ./web.json",
    ]);
  });

  it("reads the covered files from the development map when no published map exists", () => {
    const fields = { exports: { ".": { "stealth-source": "./src/index.ts" } }, files: [] };

    expect(checked(fields, files)).toStrictEqual(["files omits LICENSE", "files omits README.md"]);
  });

  it("accepts a node range that matches the workspace root", () => {
    expect(checked({}, engines)).toStrictEqual([]);
  });

  it("reports a missing node range", () => {
    expect(checked({ engines: {} }, engines)).toStrictEqual(["engines.node is not stated"]);
  });

  it("reports a node range that differs from the workspace root", () => {
    expect(checked({ engines: { node: ">=24" } }, engines)).toStrictEqual([
      "engines.node is >=24, and the workspace root states >=26.0.0",
    ]);
  });

  it("accepts any node range when no workspace root exists", () => {
    const tree = packageFiles("leaf", { ...BASE, engines: { node: ">=24" } }, CARRIED);
    const found = withScratchWorkspace(tree, (workspace) => {
      const at = workspace.path("leaf");

      return engines(publishedOf(at), at);
    });

    expect(found).toStrictEqual([]);
  });

  it("accepts a library without peers", () => {
    expect(checked({}, (published) => peers(published, "library"))).toStrictEqual([]);
  });

  it("reports a peer that is also a dependency", () => {
    const fields = { dependencies: { react: "^19" }, peerDependencies: { react: "^19" } };

    expect(checked(fields, (published) => peers(published, "library"))).toStrictEqual([
      "react is both a peer and a dependency",
    ]);
  });

  it("reports a vite or vitest peer that is not from the peer catalog", () => {
    const fields = { peerDependencies: { vite: "^8.0.0", vitest: "catalog:" } };

    expect(checked(fields, (published) => peers(published, "library"))).toStrictEqual([
      "vite is peered as ^8.0.0, not from the peer catalog",
      "vitest is peered as catalog:, not from the peer catalog",
    ]);
  });

  it("reports a peer on the toolchain", () => {
    const fields = { peerDependencies: { vite: "catalog:peer", "vite-plus": "catalog:peer" } };

    expect(checked(fields, (published) => peers(published, "config"))).toStrictEqual([
      "the package peers on vite-plus, where vite is what it configures",
    ]);
  });

  it("reports a config package without a vite peer", () => {
    expect(checked({}, (published) => peers(published, "config"))).toStrictEqual([
      "a config package peers on nothing named vite",
    ]);
  });
});
