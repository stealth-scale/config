import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

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

test("takes the packages from the manifest rather than from a second list", () => {
  const held = block(["apps/*", "libs/*"], ["apps/one", "libs/two"]);

  expect(held.projects).toEqual(["apps/one", "libs/two"]);
});

test("names the package's directory, so one with no config of its own is still a project", () => {
  expect(block(["apps/*"], ["apps/bare"]).projects).toEqual(["apps/bare"]);
});

test("passes over a skeleton directory, which holds no manifest and so is no package yet", () => {
  const held = block(["apps/*"], ["apps/real", "apps/planned/"]);

  expect(held.projects).toEqual(["apps/real"]);
});

test("answers them in one order however the file system lists them", () => {
  const held = block(["apps/*"], ["apps/zeta", "apps/alpha"]);

  expect(held.projects).toEqual(["apps/alpha", "apps/zeta"]);
});

test("stops the root looking for its own tests, which all belong to a package", () => {
  expect(block(["apps/*"], ["apps/one"]).include).toEqual([]);
});

test("refuses a root declaring no workspace, which is not a root at all", () => {
  const held = resolving({
    at: "/repository",
    manifest: { name: "@acme/thing" },
    root: "/repository",
  });

  expect(held).toThrow(/found no workspaces/u);
});

test("states nothing for a package taking the root's config, which is not the root", () => {
  const held = resolving({ at: "/repository/packages/one", root: "/repository" });

  expect(held()).toEqual({});
});

test("refuses a root calling its workspace empty", () => {
  const held = resolving({ at: "/repository", manifest: { workspaces: [] }, root: "/repository" });

  expect(held).toThrow(/found no workspaces/u);
});

test("refuses a workspace naming somewhere nothing lives, rather than testing nothing", () => {
  expect(() => block(["apps/*"])).toThrow(/found no packages/u);
});
