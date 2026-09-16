/**
 * Pins the names the entry point exports.
 *
 * @remarks
 *   The list is the package's public surface. Adding a name here is the step that makes removing it
 *   later a breaking change, so the spec fails on an export nobody meant to publish.
 */

import { describe, expect, it } from "vitest";

import * as testing from "#index.ts";

describe("testing", () => {
  it("exports the workspace manifest and measurement helpers", () => {
    expect(Object.keys(testing).toSorted()).toStrictEqual([
      "manifest",
      "packageFiles",
      "pixels",
      "scratchWorkspace",
      "seamBetween",
      "withScratchWorkspace",
      "withScratchWorkspaceAsync",
      "workspaceFiles",
    ]);
  });
});
