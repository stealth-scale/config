import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { projects } from "#test/projects.ts";
import { answered, told } from "#vite.fixtures.ts";

/**
 * Writes a workspace: a root manifest, and a directory for each package named under it.
 *
 * The directories are real because finding the packages is a walk over the file system, which a
 * stated manifest cannot stand in for.
 *
 * @param globs - Where the root says its packages live.
 * @param held - The package directories to create, each given a manifest of its own. A directory
 *   named with a trailing slash is created empty, which is what a skeleton left for a package
 *   nobody has written yet looks like.
 * @returns Where the workspace sits.
 */
function workspace(globs: readonly string[], held: readonly string[] = []): string {
  const at = mkdtempSync(join(tmpdir(), "stealth-projects-"));

  writeFileSync(join(at, "package.json"), JSON.stringify({ workspaces: globs }));

  for (const one of held) {
    const where = join(at, one);

    mkdirSync(where, { recursive: true });

    if (!one.endsWith("/"))
      writeFileSync(join(where, "package.json"), JSON.stringify({ name: one }));
  }

  return at;
}

/**
 * Reads the test block the preset sets for a workspace on disk.
 *
 * @param globs - Where the root says its packages live.
 * @param held - The package directories to create.
 * @returns That block.
 */
function block(
  globs: readonly string[],
  held: readonly string[] = [],
): NonNullable<UserConfig["test"]> {
  const at = workspace(globs, held);
  const config = answered(projects(), {
    at,
    manifest: { workspaces: globs },
    root: at,
  }) as UserConfig;

  return config.test as NonNullable<UserConfig["test"]>;
}

/**
 * Resolves the layer against a manifest, for the cases that refuse one.
 *
 * @param stated - Whatever differs from an ordinary package.
 * @returns What the layer does when it is resolved.
 */
function resolving(stated: Parameters<typeof told>[0]): () => unknown {
  const held = projects().config;

  return () => (typeof held === "function" ? held(told(stated)) : held);
}

describe("projects", () => {
  it("takes the packages from the manifest rather than from a second list", () => {
    const held = block(["apps/*", "libs/*"], ["apps/one", "libs/two"]);

    expect(held.projects).toStrictEqual(["apps/one", "libs/two"]);
  });

  it("names the package's directory", () => {
    expect(block(["apps/*"], ["apps/bare"]).projects).toStrictEqual(["apps/bare"]);
  });

  it("ignores a skeleton directory", () => {
    const held = block(["apps/*"], ["apps/real", "apps/planned/"]);

    expect(held.projects).toStrictEqual(["apps/real"]);
  });

  it("returns them in one order however the file system lists them", () => {
    const held = block(["apps/*"], ["apps/zeta", "apps/alpha"]);

    expect(held.projects).toStrictEqual(["apps/alpha", "apps/zeta"]);
  });

  it("stops the root looking for its own tests", () => {
    expect(block(["apps/*"], ["apps/one"]).include).toStrictEqual([]);
  });

  it("throws for a root declaring no workspace", () => {
    const held = resolving({
      at: "/repository",
      manifest: { name: "@acme/thing" },
      root: "/repository",
    });

    expect(held).toThrow(/found no workspaces/u);
  });

  it("contributes nothing for a package using the root config", () => {
    const held = resolving({ at: "/repository/packages/one", root: "/repository" });

    expect(held()).toStrictEqual({});
  });

  it("throws for a root declaring an empty workspace", () => {
    const held = resolving({
      at: "/repository",
      manifest: { workspaces: [] },
      root: "/repository",
    });

    expect(held).toThrow(/found no workspaces/u);
  });

  it("throws for a workspace naming a directory that does not exist", () => {
    expect(() => block(["apps/*"])).toThrow(/found no packages/u);
  });
});
