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
  it("exports the workspace helpers and the plugin drivers by name", () => {
    expect(Object.keys(testing).toSorted()).toStrictEqual([
      "changed",
      "configured",
      "created",
      "generated",
      "hookContext",
      "loaded",
      "manifest",
      "packageFiles",
      "pixels",
      "removed",
      "resolved",
      "scratchWorkspace",
      "seamBetween",
      "started",
      "transformed",
      "updated",
      "withScratchWorkspace",
      "withScratchWorkspaceAsync",
      "workspaceFiles",
    ]);
  });
});
