import { describe, expect, it } from "vitest";

import { statusVariants } from "#authoring/recipes/status.ts";

describe("statusVariants", () => {
  it("points the palette at the semantic palette of each status", () => {
    expect(statusVariants()).toStrictEqual({
      error: { colorPalette: "error" },
      info: { colorPalette: "info" },
      success: { colorPalette: "success" },
      warning: { colorPalette: "warning" },
    });
  });
});
