import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { type ConfigEnv } from "vite-plus";
import { describe, expect, it, vi } from "vitest";

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

describe("context", () => {
  it("finds the root from a package below it", () => {
    const held = workspace();

    expect(rooted(held.at)).toBe(held.root);
  });

  it("finds it from the root itself", () => {
    const held = workspace();

    expect(rooted(held.root)).toBe(held.root);
  });

  it("finds it when the workspace is declared under a key rather than as an array", () => {
    const held = laid({ workspaces: { packages: ["packages/*"] } });

    expect(rooted(held.at)).toBe(held.root);
  });

  it("ignores a manifest declaring no workspace", () => {
    const held = laid({ name: "root" });

    expect(rooted(held.at)).toBe(held.at);
  });

  it("returns where it started when nothing above declares a workspace", () => {
    const held = laid({ name: "root" });

    expect(rooted(held.root)).toBe(held.root);
  });

  it("reads the variables the repository declares", () => {
    const held = workspace("STEALTH_SPECIFIED=stated\n");

    expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SPECIFIED"]).toBe("stated");
  });

  it("reads them with no prefix", () => {
    const held = workspace("NOT_PREFIXED=read\n");

    expect(contextOf(SERVING, held.at, held.at).env["NOT_PREFIXED"]).toBe("read");
  });

  it("returns no repository variable when the repository declares none", () => {
    const held = workspace();

    expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SPECIFIED"]).toBeUndefined();
  });

  it("reads what the package declares", () => {
    const held = workspace(undefined, "STEALTH_SPECIFIED=package\n");

    expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SPECIFIED"]).toBe("package");
  });

  it("lets the package override the workspace", () => {
    const held = workspace("STEALTH_SPECIFIED=workspace\n", "STEALTH_SPECIFIED=package\n");

    expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SPECIFIED"]).toBe("package");
  });

  it("keeps what the workspace declares and the package omits", () => {
    const held = workspace("STEALTH_SHARED=workspace\n", "STEALTH_SPECIFIED=package\n");
    const context = contextOf(SERVING, held.at, held.at);

    expect(context.env["STEALTH_SHARED"]).toBe("workspace");
    expect(context.env["STEALTH_SPECIFIED"]).toBe("package");
  });

  it("keeps the workspace value when the package writes a file naming another", () => {
    const held = workspace("STEALTH_SHARED=workspace\n", "STEALTH_OTHER=package\n");

    expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SHARED"]).toBe("workspace");
  });

  it("lets the shell override both", () => {
    const held = workspace("STEALTH_SPECIFIED=workspace\n", "STEALTH_SPECIFIED=package\n");

    vi.stubEnv("STEALTH_SPECIFIED", "shell");

    expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SPECIFIED"]).toBe("shell");
  });

  it("passes the command and the mode through", () => {
    const held = workspace();
    const context = contextOf({ command: "build", mode: "production" }, held.at, held.at);

    expect(context.command).toBe("build");
    expect(context.mode).toBe("production");
  });

  it("reports where the root is", () => {
    const held = workspace();

    expect(contextOf(SERVING, held.at, held.at).root).toBe(held.root);
  });

  it("reads the package's own manifest", () => {
    const held = workspace();

    expect(contextOf(SERVING, held.at, held.at).manifest.version).toBe("1.2.3");
  });

  it("returns the workspace as an array when the manifest declares one", () => {
    const held = laid({ workspaces: ["packages/*"] });

    expect(contextOf(SERVING, held.root, held.root).manifest.workspaces).toStrictEqual([
      "packages/*",
    ]);
  });

  it("returns undefined when the manifest declares no workspace", () => {
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

  it("finds the root by a pnpm workspace file when the manifest declares none", () => {
    const held = pnpm("packages:\n  - packages/*\n");

    expect(rooted(held.at)).toBe(held.root);
  });

  it("passes what that file declares through to the layer", () => {
    const held = pnpm("packages:\n  - examples/*\n  - packages/*\n");

    expect(contextOf(SERVING, held.root, held.root).manifest.workspaces).toStrictEqual([
      "examples/*",
      "packages/*",
    ]);
  });

  it("returns an empty manifest when the directory has none", () => {
    const held = workspace();
    const absent = join(held.root, "nothing");

    expect(contextOf(SERVING, absent, absent).manifest).toStrictEqual({});
  });

  it("returns an empty manifest when the file is not an object", () => {
    const held = workspace();

    writeFileSync(join(held.at, "package.json"), "null");

    expect(contextOf(SERVING, held.at, held.at).manifest).toStrictEqual({});
  });

  it("takes the declared directory when a package has a config of its own", () => {
    const held = workspace();

    expect(contextOf(SERVING, held.at, held.at).at).toBe(held.at);
  });

  it("keeps it when the command runs at the root", () => {
    const held = workspace();

    expect(contextOf(SERVING, held.at, held.root).at).toBe(held.at);
  });

  it("takes the working directory when a package has no config of its own", () => {
    const held = workspace();

    expect(contextOf(SERVING, held.root, held.at).at).toBe(held.at);
  });

  it("keeps the root when the command runs in a package with its own config", () => {
    const held = workspace();

    writeFileSync(join(held.at, "vite.config.ts"), "export default {};\n");

    expect(contextOf(SERVING, held.root, held.at).at).toBe(held.root);
  });

  it("keeps the root when it is both declared and where the command runs", () => {
    const held = workspace();

    expect(contextOf(SERVING, held.root, held.root).at).toBe(held.root);
  });

  it("keeps the root when the command runs where there is no manifest", () => {
    const held = workspace();
    const elsewhere = join(held.root, "docs");

    mkdirSync(elsewhere, { recursive: true });

    expect(contextOf(SERVING, held.root, elsewhere).at).toBe(held.root);
  });
});
