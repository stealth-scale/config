import { describe, expect, it } from "vitest";

import { dense } from "#authoring/recipes/dense.ts";

describe("dense", () => {
  it("nests the styles under the compact condition", () => {
    expect(dense({ height: "control.sm" })).toStrictEqual({ _compact: { height: "control.sm" } });
  });
});
