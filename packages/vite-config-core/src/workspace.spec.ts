import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { workspaces } from "#workspace.ts";

/**
 * A directory holding nothing, for a reading that does not turn on a file.
 *
 * @returns Where it is.
 */
function empty(): string {
  return mkdtempSync(join(tmpdir(), "stealth-workspace-"));
}

/**
 * Lays out a directory holding a pnpm workspace file.
 *
 * @param yaml - What the file holds.
 * @returns Where it is.
 */
function written(yaml: string): string {
  const at = empty();

  writeFileSync(join(at, "pnpm-workspace.yaml"), yaml);

  return at;
}

describe("workspace", () => {
  it("reads the array npm bun and yarn each declare in the manifest", () => {
    expect(workspaces(empty(), { workspaces: ["examples/*", "packages/*"] })).toStrictEqual([
      "examples/*",
      "packages/*",
    ]);
  });

  it("reads the nested spelling too", () => {
    expect(workspaces(empty(), { workspaces: { packages: ["packages/*"] } })).toStrictEqual([
      "packages/*",
    ]);
  });

  it("returns an empty array when the manifest declares an empty workspace", () => {
    expect(workspaces(empty(), { workspaces: {} })).toStrictEqual([]);
  });

  it("returns an empty array when the field is neither an array nor an object", () => {
    expect(workspaces(empty(), { workspaces: "packages/*" })).toStrictEqual([]);
  });

  it("drops an entry that is not a string", () => {
    expect(workspaces(empty(), { workspaces: ["packages/*", 3] })).toStrictEqual(["packages/*"]);
  });

  it("returns undefined when no package manager declares a workspace", () => {
    expect(workspaces(empty(), { name: "one" })).toBeUndefined();
  });

  it("reads the directories pnpm declares beside the manifest", () => {
    const at = written("packages:\n  - examples/*\n  - packages/*\n");

    expect(workspaces(at, {})).toStrictEqual(["examples/*", "packages/*"]);
  });

  it("reads the directories written on one line", () => {
    const at = written('packages: ["examples/*", "packages/*"]\n');

    expect(workspaces(at, {})).toStrictEqual(["examples/*", "packages/*"]);
  });

  it("takes a directory without its quotes or trailing comment", () => {
    const at = written('packages:\n  - "packages/*" # everything published\n');

    expect(workspaces(at, {})).toStrictEqual(["packages/*"]);
  });

  it("stops at the next key the file declares", () => {
    const at = written("packages:\n  - packages/*\n\ncatalog:\n  typescript: ^7.0.2\n");

    expect(workspaces(at, {})).toStrictEqual(["packages/*"]);
  });

  it("reads past a comment sitting between the directories", () => {
    const at = written("packages:\n  - examples/*\n  # and what publishes\n  - packages/*\n");

    expect(workspaces(at, {})).toStrictEqual(["examples/*", "packages/*"]);
  });

  it("returns an empty array when the file declares no directories", () => {
    const at = written("catalog:\n  typescript: ^7.0.2\n");

    expect(workspaces(at, {})).toStrictEqual([]);
  });

  it("prefers the manifest when a repository declares both", () => {
    const at = written("packages:\n  - from-the-file/*\n");

    expect(workspaces(at, { workspaces: ["from-the-manifest/*"] })).toStrictEqual([
      "from-the-manifest/*",
    ]);
  });
});
