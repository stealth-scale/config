import { describe, expect, it } from "vitest";

import { grayRamp } from "#quartz/gray-ramp.ts";

describe("grayRamp", () => {
  it("carries 52 steps", () => {
    expect(Object.keys(grayRamp)).toHaveLength(52);
  });

  it("draws the first step", () => {
    expect(grayRamp["white"]).toStrictEqual({ value: "oklch(100.0% 0.0000 0.0)" });
  });
});
