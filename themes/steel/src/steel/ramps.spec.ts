import { describe, expect, it } from "vitest";

import { ramps } from "#steel/ramps.ts";

describe("ramps", () => {
  it("keys every ramp by its own steps", () => {
    expect(Object.keys(ramps.blue)).toStrictEqual([
      "10",
      "20",
      "30",
      "40",
      "50",
      "60",
      "70",
      "80",
      "90",
      "100",
    ]);
  });

  it("draws blue at its first step", () => {
    expect(ramps.blue["10"]).toStrictEqual({ value: "oklch(96.7% 0.0159 253.9)" });
  });

  it("draws a ramp for 10 hues", () => {
    expect(Object.keys(ramps)).toHaveLength(10);
  });
});
