/**
 * Covers the scratch directory's lifetime, its path guard and its two wrappers.
 *
 * @remarks
 *   Every case that builds a workspace by hand removes it again, and each wrapper is checked once
 *   on a return and once on a throw. A case that skipped either would leave a directory in `tmpdir`
 *   that no later run reports.
 */

import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";

import { scratchWorkspace, withScratchWorkspace, withScratchWorkspaceAsync } from "#scratch.ts";

describe("scratchWorkspace", () => {
  it("creates a directory of its own under the temporary directory", () => {
    const workspace = scratchWorkspace();

    expect(workspace.root.startsWith(tmpdir())).toBe(true);
    expect(existsSync(workspace.root)).toBe(true);
    expect(workspace.files()).toStrictEqual([]);

    workspace.remove();
  });

  it("writes the files it is given and creates their directories", () => {
    const workspace = scratchWorkspace({
      "packages/leaf/src/index.ts": "export {}\n",
      "README.md": "# root\n",
    });

    expect(workspace.read("packages/leaf/src/index.ts")).toBe("export {}\n");
    expect(workspace.files()).toStrictEqual(["README.md", "packages/leaf/src/index.ts"]);

    workspace.remove();
  });

  it("overwrites a file on a second write", () => {
    const workspace = scratchWorkspace({ "a/c.txt": "two", "b.txt": "one" });

    workspace.write({ "a/a.txt": "four", "b.txt": "three" });

    expect(workspace.read("b.txt")).toBe("three");
    expect(workspace.files()).toStrictEqual(["a/a.txt", "a/c.txt", "b.txt"]);

    workspace.remove();
  });

  it("resolves a relative path inside the root and throws for one that leaves it", () => {
    const workspace = scratchWorkspace();

    expect(workspace.path("a/b.txt")).toBe(`${workspace.root}/a/b.txt`);
    expect(workspace.path(".")).toBe(workspace.root);
    expect(() => workspace.path("../outside.txt")).toThrow("leaves the scratch workspace");
    expect(() => {
      workspace.write({ "../outside.txt": "" });
    }).toThrow("leaves the scratch workspace");

    workspace.remove();
  });

  it("throws when a file to read is missing", () => {
    const workspace = scratchWorkspace();

    expect(() => workspace.read("missing.txt")).toThrow("ENOENT");

    workspace.remove();
  });

  it("removes the directory and does nothing on a second call", () => {
    const workspace = scratchWorkspace({ "a.txt": "" });

    workspace.remove();

    expect(existsSync(workspace.root)).toBe(false);
    expect(() => {
      workspace.remove();
    }).not.toThrow();
  });
});

describe("withScratchWorkspace", () => {
  it("runs the function against the workspace and returns its result", () => {
    let root = "";

    const files = withScratchWorkspace({ "a.txt": "" }, (workspace) => {
      root = workspace.root;
      return workspace.files();
    });

    expect(files).toStrictEqual(["a.txt"]);
    expect(existsSync(root)).toBe(false);
  });

  it("removes the directory when the function throws", () => {
    let root = "";

    expect(() =>
      withScratchWorkspace({}, (workspace) => {
        root = workspace.root;
        throw new Error("refused");
      }),
    ).toThrow("refused");
    expect(existsSync(root)).toBe(false);
  });
});

describe("withScratchWorkspaceAsync", () => {
  it("awaits the function and resolves to its result", async () => {
    let root = "";

    const files = await withScratchWorkspaceAsync({ "a.txt": "" }, async (workspace) => {
      root = workspace.root;
      await Promise.resolve();
      return workspace.files();
    });

    expect(files).toStrictEqual(["a.txt"]);
    expect(existsSync(root)).toBe(false);
  });

  it("removes the directory when the function rejects", async () => {
    let root = "";

    await expect(
      withScratchWorkspaceAsync({}, async (workspace) => {
        root = workspace.root;
        await Promise.resolve();
        throw new Error("refused");
      }),
    ).rejects.toThrow("refused");
    expect(existsSync(root)).toBe(false);
  });
});
