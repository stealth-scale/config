import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";

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

test("reads the list npm, bun and yarn each state in the manifest", () => {
  expect(workspaces(empty(), { workspaces: ["examples/*", "packages/*"] })).toEqual([
    "examples/*",
    "packages/*",
  ]);
});

test("reads the nested spelling too, a manifest written for one being installed by another", () => {
  expect(workspaces(empty(), { workspaces: { packages: ["packages/*"] } })).toEqual(["packages/*"]);
});

test("answers an empty list where the manifest states a workspace holding nothing", () => {
  expect(workspaces(empty(), { workspaces: {} })).toEqual([]);
});

test("answers an empty list where the field is neither a list nor an object", () => {
  expect(workspaces(empty(), { workspaces: "packages/*" })).toEqual([]);
});

test("drops an entry that is not a name, rather than handing it on", () => {
  expect(workspaces(empty(), { workspaces: ["packages/*", 3] })).toEqual(["packages/*"]);
});

test("answers nothing where no package manager states a workspace, which is what a package is", () => {
  expect(workspaces(empty(), { name: "one" })).toBeUndefined();
});

test("reads the directories pnpm states beside the manifest", () => {
  const at = written("packages:\n  - examples/*\n  - packages/*\n");

  expect(workspaces(at, {})).toEqual(["examples/*", "packages/*"]);
});

test("reads the directories written on one line", () => {
  const at = written('packages: ["examples/*", "packages/*"]\n');

  expect(workspaces(at, {})).toEqual(["examples/*", "packages/*"]);
});

test("takes a directory as written, without its quotes or what follows a hash", () => {
  const at = written('packages:\n  - "packages/*" # everything published\n');

  expect(workspaces(at, {})).toEqual(["packages/*"]);
});

test("stops at the next thing the file states, rather than reading it as a directory", () => {
  const at = written("packages:\n  - packages/*\n\ncatalog:\n  typescript: ^7.0.2\n");

  expect(workspaces(at, {})).toEqual(["packages/*"]);
});

test("reads past a comment sitting between the directories", () => {
  const at = written("packages:\n  - examples/*\n  # and what publishes\n  - packages/*\n");

  expect(workspaces(at, {})).toEqual(["examples/*", "packages/*"]);
});

test("answers an empty list where the file states no directories at all", () => {
  const at = written("catalog:\n  typescript: ^7.0.2\n");

  expect(workspaces(at, {})).toEqual([]);
});

test("lets the manifest answer where a repository states both, that being the file all three read", () => {
  const at = written("packages:\n  - from-the-file/*\n");

  expect(workspaces(at, { workspaces: ["from-the-manifest/*"] })).toEqual(["from-the-manifest/*"]);
});
