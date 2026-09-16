import { mkdirSync, symlinkSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
  manifest,
  packageFiles,
  type ScratchFiles,
  type ScratchWorkspace,
  withScratchWorkspace,
} from "@stealthscale/testing";

import { contributors, workspaceSources } from "#contributors.ts";

function installed(
  name: string,
  dependsOn: readonly string[] = [],
  publishes = false,
  directory = `node_modules/${name}`,
): ScratchFiles {
  return packageFiles(
    directory,
    {
      dependencies: Object.fromEntries(dependsOn.map((each) => [each, "*"])),
      exports: publishes
        ? { ".": "./index.js", "./package.json": "./package.json", "./theme": "./theme.js" }
        : { ".": "./index.js", "./package.json": "./package.json" },
      name,
    },
    { "index.js": "export {};\n", "theme.js": "export default {};\n" },
  );
}

function root(dependsOn: readonly string[]): ScratchFiles {
  return {
    "package.json": manifest({
      dependencies: Object.fromEntries(dependsOn.map((each) => [each, "*"])),
      name: "@acme/app",
    }),
  };
}

function named(files: ScratchFiles, system = "@acme/design"): readonly string[] {
  return withScratchWorkspace(files, (workspace) =>
    contributors(workspace.root, system).map((each) => each.name),
  );
}

function linked(workspace: ScratchWorkspace, names: readonly string[]): void {
  mkdirSync(workspace.path("node_modules/@acme"), { recursive: true });

  for (const name of names) {
    symlinkSync(
      workspace.path(`packages/${name}`),
      workspace.path(`node_modules/@acme/${name}`),
      "dir",
    );
  }
}

describe("contributors", () => {
  it("lists a dependency that publishes a preset", () => {
    expect(named({ ...root(["@acme/kit"]), ...installed("@acme/kit", [], true) })).toStrictEqual([
      "@acme/kit",
    ]);
  });

  it("records the directory of a contributor", () => {
    const at = withScratchWorkspace(
      { ...root(["@acme/kit"]), ...installed("@acme/kit", [], true) },
      (workspace) =>
        contributors(workspace.root, "@acme/design").map((each) =>
          each.at.slice(workspace.root.length + 1),
        ),
    );

    expect(at).toStrictEqual(["node_modules/@acme/kit"]);
  });

  it("passes over a dependency that publishes no preset", () => {
    expect(named({ ...root(["@acme/plain"]), ...installed("@acme/plain") })).toStrictEqual([]);
  });

  it("places the system package first whatever the graph says", () => {
    expect(
      named({
        ...root(["@acme/kit", "@acme/design"]),
        ...installed("@acme/design", [], true),
        ...installed("@acme/kit", [], true),
      }),
    ).toStrictEqual(["@acme/design", "@acme/kit"]);
  });

  it("places a package after the package it builds on", () => {
    expect(
      named({
        ...root(["@acme/extra"]),
        ...installed("@acme/base", [], true),
        ...installed("@acme/extra", ["@acme/base"], true),
      }),
    ).toStrictEqual(["@acme/base", "@acme/extra"]);
  });

  it("finds a publisher reached through a package that publishes nothing", () => {
    expect(
      named({
        ...root(["@acme/shared"]),
        ...installed("@acme/kit", [], true),
        ...installed("@acme/shared", ["@acme/kit"]),
      }),
    ).toStrictEqual(["@acme/kit"]);
  });

  it("returns an empty array when the application has no readable manifest", () => {
    expect(named({ "package.json": "{ not json" })).toStrictEqual([]);
  });

  it("lists a glob for the source of every linked package", () => {
    const globs = withScratchWorkspace(
      {
        ...root(["@acme/kit"]),
        ...installed("@acme/deep", [], false, "packages/deep"),
        ...installed("@acme/kit", ["@acme/deep"], false, "packages/kit"),
      },
      (workspace) => {
        linked(workspace, ["deep", "kit"]);

        return workspaceSources(workspace.root);
      },
    );

    expect(globs).toStrictEqual([
      "packages/deep/src/**/*.{ts,tsx}",
      "packages/kit/src/**/*.{ts,tsx}",
    ]);
  });

  it("leaves an installed package out of the source globs", () => {
    const globs = withScratchWorkspace(
      { ...root(["@acme/vendor"]), ...installed("@acme/vendor") },
      (workspace) => workspaceSources(workspace.root),
    );

    expect(globs).toStrictEqual([]);
  });
});
