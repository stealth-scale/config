import { describe, expect, it } from "vitest";

import { definePreset } from "#authoring/preset.ts";

describe("definePreset", () => {
  it("returns the preset it was handed", () => {
    const preset = { name: "@acme/kit" };

    expect(definePreset(preset)).toBe(preset);
  });
});
