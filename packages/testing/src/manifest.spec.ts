/**
 * Covers the manifests and file maps a spec builds a workspace out of.
 *
 * @remarks
 *   The exact JSON text is asserted once, because a caller writing it to disk cares about the
 *   trailing newline. Every other expectation parses the text, so field order stays free to move.
 */

import { describe, expect, it } from "vitest";

import { manifest, packageFiles, workspaceFiles } from "#manifest.ts";
import { withScratchWorkspace } from "#scratch.ts";

describe("manifest", () => {
  it("writes the fields a package manager expects with a default version", () => {
    expect(manifest({ name: "@acme/leaf" })).toBe(
      '{\n  "version": "0.0.0",\n  "name": "@acme/leaf"\n}\n',
    );
  });

  it("keeps the version the fields declare", () => {
    expect(JSON.parse(manifest({ name: "@acme/leaf", version: "1.2.3" }))).toStrictEqual({
      name: "@acme/leaf",
      version: "1.2.3",
    });
  });
});

describe("packageFiles", () => {
  it("writes the manifest and every other file under the directory", () => {
    const files = packageFiles(
      "packages/leaf",
      { name: "@acme/leaf" },
      { "README.md": "# leaf\n", "src/index.ts": "export {}\n" },
    );

    expect(Object.keys(files)).toStrictEqual([
      "packages/leaf/package.json",
      "packages/leaf/README.md",
      "packages/leaf/src/index.ts",
    ]);
    expect(JSON.parse(files["packages/leaf/package.json"] ?? "")).toStrictEqual({
      name: "@acme/leaf",
      version: "0.0.0",
    });
  });

  it("composes with the root into one scratch workspace", () => {
    const files = withScratchWorkspace(
      {
        ...workspaceFiles(["packages/*"]),
        ...packageFiles("packages/leaf", { name: "@acme/leaf" }),
      },
      (workspace) => workspace.files(),
    );

    expect(files).toStrictEqual(["package.json", "packages/leaf/package.json"]);
  });
});

describe("workspaceFiles", () => {
  it("writes a private root manifest with the globs it was given", () => {
    expect(JSON.parse(workspaceFiles(["core/*", "tools/*"])["package.json"] ?? "")).toStrictEqual({
      name: "root",
      private: true,
      version: "0.0.0",
      workspaces: ["core/*", "tools/*"],
    });
  });

  it("keeps other root fields such as the catalog", () => {
    const root = JSON.parse(
      workspaceFiles(["core/*"], { catalog: { valibot: "^1.4.2" } })["package.json"] ?? "",
    ) as { catalog: Record<string, string> };

    expect(root.catalog).toStrictEqual({ valibot: "^1.4.2" });
  });
});
