/**
 * Covers the two writes a generator makes: one that leaves an unchanged file alone, and one that
 * clears a directory.
 */

import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { withScratchWorkspace } from "@stealthscale/testing";

import { emptyDir, writeIfChanged } from "#fs.ts";

/**
 * Writes `content` to one file in a scratch workspace holding `files`, and reads the file back.
 */
function written(
  files: Readonly<Record<string, string>>,
  content: string,
): { readonly content: string; readonly wrote: boolean } {
  return withScratchWorkspace(files, (workspace) => {
    const wrote = writeIfChanged(workspace.path("a/b/c.txt"), content);

    return { content: workspace.read("a/b/c.txt"), wrote };
  });
}

describe("fs", () => {
  it("writes a file that does not exist and creates the directories above it", () => {
    expect(written({}, "one")).toStrictEqual({ content: "one", wrote: true });
  });

  it("returns false and leaves the file alone when the content is the same", () => {
    expect(written({ "a/b/c.txt": "one" }, "one")).toStrictEqual({ content: "one", wrote: false });
  });

  it("overwrites a file whose content differs", () => {
    expect(written({ "a/b/c.txt": "one" }, "two")).toStrictEqual({ content: "two", wrote: true });
  });

  it("deletes a directory and everything under it", () => {
    const left = withScratchWorkspace({ "out/a.txt": "", "out/deep/b.txt": "" }, (workspace) => {
      emptyDir(workspace.path("out"));

      return existsSync(workspace.path("out"));
    });

    expect(left).toBe(false);
  });

  it("does nothing when the directory to empty is absent", () => {
    const left = withScratchWorkspace({}, (workspace) => {
      emptyDir(workspace.path("out"));

      return existsSync(workspace.path("out"));
    });

    expect(left).toBe(false);
  });
});
