/**
 * Covers the root call, which is expected to contribute nothing.
 */

import { describe, expect, it } from "vitest";

import { workspace } from "#workspace.ts";

describe("workspace", () => {
  it("contributes nothing at a root", () => {
    expect(workspace()).toStrictEqual([]);
  });
});
