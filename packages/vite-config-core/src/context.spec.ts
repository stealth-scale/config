import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { type ConfigEnv } from "vite-plus";
import { expect, test, vi } from "vite-plus/test";

import { contextOf, rooted } from "#context.ts";

/**
 * The environment Vite+ resolves before a configuration is read.
 */
const SERVING: ConfigEnv = { command: "serve", mode: "development" };

/**
 * Lays out a repository in a temporary directory and answers where its package sits.
 *
 * Written to disk rather than mocked, because what is being specified is a walk up real directories
 * and a file read at the end of it: a mocked file system would specify the mock.
 *
 * @param manifest - What the root's manifest holds.
 * @param env - The `.env` file to write at the root, or nothing to write none.
 * @param own - The `.env` file to write at the package, or nothing to write none.
 * @returns The root, and a package directory two levels below it.
 */
function laid(
  manifest: Record<string, unknown>,
  env?: string,
  own?: string,
): { readonly at: string; readonly root: string } {
  const root = mkdtempSync(join(tmpdir(), "stealth-context-"));
  const at = join(root, "packages", "one");

  mkdirSync(at, { recursive: true });
  writeFileSync(join(root, "package.json"), JSON.stringify(manifest));
  writeFileSync(join(at, "package.json"), JSON.stringify({ name: "one", version: "1.2.3" }));

  if (env !== undefined) writeFileSync(join(root, ".env"), env);
  if (own !== undefined) writeFileSync(join(at, ".env"), own);

  return { at, root };
}

/**
 * Lays out a workspace, since most of what follows wants one.
 *
 * @param env - The `.env` file to write at the root, or nothing to write none.
 * @param own - The `.env` file to write at the package, or nothing to write none.
 * @returns The root, and the package below it.
 */
function workspace(env?: string, own?: string): { readonly at: string; readonly root: string } {
  return laid({ workspaces: ["packages/*"] }, env, own);
}

test("finds the root from a package below it, which is where a command is usually run", () => {
  const held = workspace();

  expect(rooted(held.at)).toBe(held.root);
});

test("finds it from the root itself, which is where a task runner runs", () => {
  const held = workspace();

  expect(rooted(held.root)).toBe(held.root);
});

test("finds it where the workspace is stated under a key rather than as a list", () => {
  const held = laid({ workspaces: { packages: ["packages/*"] } });

  expect(rooted(held.at)).toBe(held.root);
});

test("passes over a manifest declaring no workspace, a package having one of its own", () => {
  const held = laid({ name: "root" });

  expect(rooted(held.at)).toBe(held.at);
});

test("answers where it started when nothing above declares a workspace", () => {
  const held = laid({ name: "root" });

  expect(rooted(held.root)).toBe(held.root);
});

test("reads the variables the repository states, so one file answers for the whole tree", () => {
  const held = workspace("STEALTH_SPECIFIED=stated\n");

  expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SPECIFIED"]).toBe("stated");
});

test("reads them with no prefix, a variable for the configuration not being one for a browser", () => {
  const held = workspace("NOT_PREFIXED=read\n");

  expect(contextOf(SERVING, held.at, held.at).env["NOT_PREFIXED"]).toBe("read");
});

test("holds no repository variable where the repository states none", () => {
  const held = workspace();

  expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SPECIFIED"]).toBeUndefined();
});

test("reads what the package states, so one of them can differ from the rest of the tree", () => {
  const held = workspace(undefined, "STEALTH_SPECIFIED=package\n");

  expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SPECIFIED"]).toBe("package");
});

test("lets the package override the workspace, the nearer statement deciding", () => {
  const held = workspace("STEALTH_SPECIFIED=workspace\n", "STEALTH_SPECIFIED=package\n");

  expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SPECIFIED"]).toBe("package");
});

test("keeps what the workspace states that the package says nothing about", () => {
  const held = workspace("STEALTH_SHARED=workspace\n", "STEALTH_SPECIFIED=package\n");
  const context = contextOf(SERVING, held.at, held.at);

  expect(context.env["STEALTH_SHARED"]).toBe("workspace");
  expect(context.env["STEALTH_SPECIFIED"]).toBe("package");
});

test("keeps the workspace's where the package writes a file naming something else", () => {
  const held = workspace("STEALTH_SHARED=workspace\n", "STEALTH_OTHER=package\n");

  expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SHARED"]).toBe("workspace");
});

test("lets the shell beat both, a variable given on the command line being the nearest of all", () => {
  const held = workspace("STEALTH_SPECIFIED=workspace\n", "STEALTH_SPECIFIED=package\n");

  vi.stubEnv("STEALTH_SPECIFIED", "shell");

  expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SPECIFIED"]).toBe("shell");
});

test("carries the command and the mode through, a layer needing both", () => {
  const held = workspace();
  const context = contextOf({ command: "build", mode: "production" }, held.at, held.at);

  expect(context.command).toBe("build");
  expect(context.mode).toBe("production");
});

test("says where the root is, so a layer reads one place rather than guessing", () => {
  const held = workspace();

  expect(contextOf(SERVING, held.at, held.at).root).toBe(held.root);
});

test("reads the package's own manifest, so no two blocks open the same file", () => {
  const held = workspace();

  expect(contextOf(SERVING, held.at, held.at).manifest.version).toBe("1.2.3");
});

test("answers the workspace as a list where the manifest states one", () => {
  const held = laid({ workspaces: ["packages/*"] });

  expect(contextOf(SERVING, held.root, held.root).manifest.workspaces).toEqual(["packages/*"]);
});

test("answers nothing where the manifest declares no workspace, which is what a package is", () => {
  const held = workspace();

  expect(contextOf(SERVING, held.at, held.at).manifest.workspaces).toBeUndefined();
});

/**
 * Lays out a workspace pnpm's way, which states the directories beside the manifest.
 *
 * @param yaml - What `pnpm-workspace.yaml` holds.
 * @returns The root, and the package below it.
 */
function pnpm(yaml: string): { readonly at: string; readonly root: string } {
  const held = laid({});

  writeFileSync(join(held.root, "pnpm-workspace.yaml"), yaml);

  return held;
}

test("finds the root by a pnpm workspace too, that manifest declaring none", () => {
  const held = pnpm("packages:\n  - packages/*\n");

  expect(rooted(held.at)).toBe(held.root);
});

test("carries what that file states through to the layer, as it does the manifest's own", () => {
  const held = pnpm("packages:\n  - examples/*\n  - packages/*\n");

  expect(contextOf(SERVING, held.root, held.root).manifest.workspaces).toEqual([
    "examples/*",
    "packages/*",
  ]);
});

test("answers an empty manifest where the directory holds none, which is a block's question", () => {
  const held = workspace();
  const absent = join(held.root, "nothing");

  expect(contextOf(SERVING, absent, absent).manifest).toEqual({});
});

test("answers an empty one where the manifest is not an object at all", () => {
  const held = workspace();

  writeFileSync(join(held.at, "package.json"), "null");

  expect(contextOf(SERVING, held.at, held.at).manifest).toEqual({});
});

test("takes the declared directory where a package states a config of its own", () => {
  const held = workspace();

  expect(contextOf(SERVING, held.at, held.at).at).toBe(held.at);
});

test("keeps it where the command runs at the root, as it does under `vp test`", () => {
  const held = workspace();

  expect(contextOf(SERVING, held.at, held.root).at).toBe(held.at);
});

test("takes where the command runs where a package states no config and the root's is read", () => {
  const held = workspace();

  expect(contextOf(SERVING, held.root, held.at).at).toBe(held.at);
});

test("keeps the root where that is both what was declared and where the command runs", () => {
  const held = workspace();

  expect(contextOf(SERVING, held.root, held.root).at).toBe(held.root);
});

test("keeps the root where the command runs somewhere holding no manifest at all", () => {
  const held = workspace();
  const elsewhere = join(held.root, "docs");

  mkdirSync(elsewhere, { recursive: true });

  expect(contextOf(SERVING, held.root, elsewhere).at).toBe(held.root);
});
