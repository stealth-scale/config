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
